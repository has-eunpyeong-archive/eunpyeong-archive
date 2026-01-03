"""
카테고리 마이그레이션 스크립트
기존 모든 자료의 카테고리를 "기타"로 변경합니다.
"""

import os
import sys

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# .env 파일 로드
load_dotenv()


def migrate_categories():
    # 데이터베이스 URL 가져오기
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("ERROR: DATABASE_URL이 설정되지 않았습니다.")
        print(".env 파일을 확인해주세요.")
        sys.exit(1)

    print("데이터베이스 연결 중...")
    print(f"DB URL: {db_url}")

    try:
        # 엔진 및 세션 생성
        engine = create_engine(db_url)
        Session = sessionmaker(bind=engine)
        session = Session()

        # 현재 카테고리 분포 확인
        print("\n=== 마이그레이션 전 카테고리 분포 ===")
        result = session.execute(
            text(
                "SELECT category, COUNT(*) as count FROM document GROUP BY category ORDER BY count DESC"
            )
        )
        for row in result:
            print(f"  {row.category}: {row.count}개")

        # 총 문서 수 확인
        total = session.execute(text("SELECT COUNT(*) FROM document")).scalar()
        print(f"\n총 {total}개의 문서가 있습니다.")

        if total == 0:
            print("\n마이그레이션할 문서가 없습니다.")
            session.close()
            return

        # 사용자 확인
        print("\n모든 문서의 카테고리를 '기타'로 변경하시겠습니까?")
        confirm = input("계속하려면 'yes'를 입력하세요: ")

        if confirm.lower() != "yes":
            print("마이그레이션이 취소되었습니다.")
            session.close()
            return

        # 카테고리 업데이트
        print("\n카테고리 업데이트 중...")
        result = session.execute(
            text("UPDATE document SET category = :new_category"),
            {"new_category": "기타"},
        )
        session.commit()

        updated_count = result.rowcount
        print(f"✓ {updated_count}개의 문서 카테고리가 업데이트되었습니다.")

        # 업데이트 후 카테고리 분포 확인
        print("\n=== 마이그레이션 후 카테고리 분포 ===")
        result = session.execute(
            text(
                "SELECT category, COUNT(*) as count FROM document GROUP BY category ORDER BY count DESC"
            )
        )
        for row in result:
            print(f"  {row.category}: {row.count}개")

        print("\n마이그레이션이 완료되었습니다! ✓")

        session.close()

    except Exception as e:
        print("\nERROR: 마이그레이션 중 오류가 발생했습니다.")
        print(f"오류 내용: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    print("=" * 60)
    print("카테고리 마이그레이션 스크립트")
    print("=" * 60)
    migrate_categories()
