import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
import traceback
from werkzeug.utils import secure_filename
from functools import wraps

load_dotenv()

app = Flask(__name__)
# CORS 설정 - 프로덕션에서는 실제 도메인으로 변경
cors_origins = [
    "http://localhost:3000",  # 개발 환경
    "http://127.0.0.1:3000",  # 개발 환경
]

# 프로덕션 환경에서는 환경 변수로 허용할 도메인 설정
if os.environ.get("FLASK_ENV") == "production":
    production_origin = os.environ.get("FRONTEND_URL", "http://127.0.0.1")
    cors_origins = [production_origin]

CORS(
    app,
    resources={r"/api/*": {"origins": cors_origins}},
    supports_credentials=True,
)

# DATABASE_URL 환경 변수가 없으면 앱이 시작되지 않도록 강제합니다.
# 이를 통해 잘못된 데이터베이스에 연결되는 것을 방지합니다.
db_url = os.environ.get("DATABASE_URL")
if not db_url:
    raise ValueError(
        "DATABASE_URL is not set. Please check your .env file and ensure it's being loaded."
    )
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    grade = db.Column(db.String(50), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, email, password, grade):
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")
        self.grade = grade

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "grade": self.grade,
            "date": self.date.strftime("%Y-%m-%d"),
        }


class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    content = db.Column(db.Text, nullable=True)  # 파일 내용을 저장, 비워둘 수 있음
    author = db.Column(db.String(100), nullable=True)
    grade = db.Column(db.String(50), nullable=True)
    file_path = db.Column(
        db.String(500), nullable=True
    )  # 파일 저장 경로 (파일명만 저장)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "content": self.content,
            "author": self.author,
            "grade": self.grade,
            "file_path": self.file_path,
            "date": self.date.strftime("%Y-%m-%d"),
            "views": self.views,
            "downloads": self.downloads,
        }


# --- Decorators ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"error": "인증 토큰이 필요합니다."}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
        except Exception as e:
            return jsonify(
                {"error": "유효하지 않은 토큰입니다.", "message": str(e)}
            ), 401

        return f(current_user, *args, **kwargs)

    return decorated


# --- Auth Routes ---
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or not "name" in data or not "email" in data or not "password" in data:
        return jsonify({"error": "모든 필드를 입력해주세요."}), 400

    user_exists = User.query.filter_by(email=data["email"]).first()
    if user_exists:
        return jsonify({"error": "이미 사용중인 이메일입니다."}), 409

    new_user = User(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        grade=data.get("grade"),
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not "email" in data or not "password" in data:
        return jsonify({"error": "이메일과 비밀번호를 입력해주세요."}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and bcrypt.check_password_hash(user.password, data["password"]):
        try:
            token = jwt.encode(
                {"user_id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
                app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            return jsonify({"token": token})
        except Exception as e:
            return jsonify({"error": "토큰 생성 중 오류 발생", "message": str(e)}), 500
    else:
        return jsonify({"error": "이메일 또는 비밀번호가 올바르지 않습니다."}), 401


@app.route("/api/user", methods=["GET"])
@token_required
def get_user(current_user):
    return jsonify(current_user.to_dict())


# --- Document Routes ---
@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/api/documents", methods=["GET"])
def get_documents():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get(
        "per_page", 20, type=int
    )  # Default to 20 items per page

    query = Document.query.order_by(Document.date.desc())

    # Apply filters if provided (e.g., category, search term)
    category = request.args.get("category")
    search_term = request.args.get("search")
    sort_by = request.args.get("sort_by", "latest")

    if category and category != "전체":
        query = query.filter_by(category=category)

    if search_term:
        search_pattern = f"%{search_term}%"
        query = query.filter(
            (Document.title.ilike(search_pattern))
            | (Document.author.ilike(search_pattern))
            | (Document.description.ilike(search_pattern))
        )

    if sort_by == "latest":
        query = query.order_by(Document.date.desc())
    elif sort_by == "views":
        query = query.order_by(Document.views.desc())
    elif sort_by == "downloads":
        query = query.order_by(Document.downloads.desc())
    elif sort_by == "title":
        query = query.order_by(Document.title.asc())

    paginated_documents = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "documents": [doc.to_dict() for doc in paginated_documents.items],
            "total_pages": paginated_documents.pages,
            "current_page": paginated_documents.page,
            "total_documents": paginated_documents.total,
        }
    )


@app.route("/api/documents", methods=["POST"])
@token_required
def add_document(current_user):
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        title = request.form.get("title")
        category = request.form.get("category", "일반")
        description = request.form.get("description", "")

        if not title:
            return jsonify({"error": "Title is required"}), 400

        content = None
        filename = None
        if file and file.filename:
            filename = secure_filename(file.filename)
            if file.content_type.startswith("text/"):
                try:
                    content = file.read().decode("utf-8")
                except UnicodeDecodeError:
                    return jsonify(
                        {
                            "error": "File is not a valid text file (UTF-8 encoding required)."
                        }
                    ), 400
            else:
                os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
                file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                file.save(file_path)

        new_doc = Document(
            title=title,
            content=content,
            category=category,
            description=description,
            author=current_user.name,
            grade=current_user.grade,
            file_path=filename,
        )
        db.session.add(new_doc)
        db.session.commit()
        return jsonify(new_doc.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": "An internal error occurred", "message": str(e)}), 500


@app.route("/api/documents/<int:id>", methods=["GET"])
def get_document(id):
    doc = Document.query.get_or_404(id)
    return jsonify(doc.to_dict())


@app.route("/api/documents/<int:id>", methods=["PUT"])
@token_required
def update_document(current_user, id):
    doc = Document.query.get_or_404(id)

    # Check if the current_user is the author of the document
    if doc.author != current_user.name:
        return jsonify({"error": "이 문서를 수정할 권한이 없습니다."}), 403

    # Get metadata from form
    doc.title = request.form.get("title", doc.title)
    doc.category = request.form.get("category", doc.category)
    doc.description = request.form.get("description", doc.description)

    # Check for a new file
    if "file" in request.files:
        file = request.files["file"]
        if file and file.filename != "":
            # If there was an old file, remove it
            if doc.file_path:
                try:
                    old_file_path = os.path.join(
                        app.config["UPLOAD_FOLDER"], doc.file_path
                    )
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                except OSError as e:
                    print(f"Error deleting old file {doc.file_path}: {e.strerror}")

            # Save the new file
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
            doc.file_path = filename
            # If a new file is uploaded, clear any text-based content
            doc.content = None

    db.session.commit()
    return jsonify(doc.to_dict())


@app.route("/api/documents/<int:id>", methods=["DELETE"])
@token_required
def delete_document(current_user, id):
    doc = Document.query.get_or_404(id)

    # Check if the current_user is the author of the document
    if doc.author != current_user.name:
        return jsonify({"error": "이 문서를 삭제할 권한이 없습니다."}), 403

    if doc.file_path:
        try:
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], doc.file_path))
        except OSError as e:
            print(f"Error deleting file {doc.file_path}: {e.strerror}")
    db.session.delete(doc)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully"}), 200


@app.route("/api/documents/<int:id>/view", methods=["PUT"])
def increment_view(id):
    doc = Document.query.get_or_404(id)
    doc.views += 1
    db.session.commit()
    return jsonify({"message": "View count incremented successfully"}), 200


@app.route("/api/documents/<int:id>/download", methods=["PUT"])
def increment_download(id):
    doc = Document.query.get_or_404(id)
    doc.downloads += 1
    db.session.commit()
    return jsonify({"message": "Download count incremented successfully"}), 200


@app.cli.command("init-db")
def init_db():
    """Create all database tables."""
    db.create_all()
    if not Document.query.first():
        print("Database is empty, adding initial data.")
        initial_docs = [
            Document(
                title="은평구 #1 (from DB)",
                category="DB",
                description="이 데이터는 실제 DB에서 왔습니다.",
                content="문서의 전체 내용입니다. 1",
                author="관리자",
                grade="전체",
                views=10,
                downloads=5,
            ),
            Document(
                title="은평구 #2 (from DB)",
                category="DB",
                description="이 데이터는 실제 DB에서 왔습니다.",
                content="문서의 전체 내용입니다. 2",
                author="관리자",
                grade="전체",
                views=20,
                downloads=15,
            ),
        ]
        db.session.bulk_save_objects(initial_docs)
        db.session.commit()
    print("Database initialized!")


if __name__ == "__main__":
    # 프로덕션에서는 gunicorn을 사용하므로 개발 환경에서만 직접 실행
    app.run(
        debug=os.environ.get("FLASK_ENV") != "production", host="127.0.0.1", port=5001
    )
