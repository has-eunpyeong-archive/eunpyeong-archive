"use client";
import { Suspense } from "react";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function UploadForm() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    file: null as File | null,
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  // Check for edit mode on component mount
  useEffect(() => {
    const docId = searchParams.get("edit");
    if (docId) {
      setEditId(docId);
      const fetchDocument = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${docId}`,
          );
          if (!res.ok) {
            throw new Error("수정할 문서 정보를 가져오는데 실패했습니다.");
          }
          const data = await res.json();
          setFormData({
            title: data.title,
            category: data.category,
            description: data.description,
            file: null, // File input cannot be pre-filled for security reasons
          });
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "데이터 로딩 중 오류가 발생했습니다.",
          );
        }
      };
      fetchDocument();
    }
  }, [searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const categories = ["논문", "포스터", "영상", "DB", "일반"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "", file: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description) {
      setError("제목, 카테고리, 설명을 모두 입력해주세요.");
      return;
    }
    if (!editId && !formData.file) {
      setError("새 자료를 업로드하려면 파일이 필요합니다.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      let response;

      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("description", formData.description);
      if (formData.file) {
        data.append("file", formData.file);
      }

      if (editId) {
        // EDIT MODE - PUT request with FormData
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/documents/${editId}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: data,
          },
        );
      } else {
        // CREATE MODE - POST request with FormData
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/documents`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: data,
          },
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            (editId
              ? "자료 수정에 실패했습니다."
              : "자료 업로드에 실패했습니다."),
        );
      }

      const resultDocument = await response.json();
      setSuccess(true);
      resetForm();

      setTimeout(() => {
        router.push(`/archive/detail/${resultDocument.id}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">사용자 정보를 확인하는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="relative">
        <div className="h-60 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-[60px] mx-4 sm:mx-6 lg:mx-8 mt-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {editId ? "자료 수정" : "자료 업로드"}
              </h1>
              <p className="text-xl opacity-90">
                {editId
                  ? "문서 정보를 수정합니다."
                  : "새로운 자료를 공유해보세요"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="자료 제목을 입력하세요"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                카테고리 *
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none pr-8"
                  required
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                설명 *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                placeholder="자료에 대한 설명을 입력하세요 (최대 500자)"
                required
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/500
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 업로드 {editId ? "(선택 사항)" : "*"}
              </label>

              {/* Informational message for edit mode */}
              {editId && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
                  <i className="ri-information-line mr-1"></i>
                  기존 파일을 유지하려면 아무것도 업로드하지 마세요. 파일을
                  교체하려면 새 파일을 업로드하세요.
                </div>
              )}

              {/* The actual file upload dropzone, now visible in both modes */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.wmv,.txt"
                />

                {formData.file ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center bg-blue-100 rounded-full">
                      <i className="ri-file-text-line text-blue-600 text-xl"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto flex items-center justify-center bg-gray-100 rounded-full">
                      <i className="ri-upload-cloud-2-line text-gray-400 text-xl"></i>
                    </div>
                    <p className="text-sm text-gray-600">
                      파일을 드래그하거나 클릭하여 업로드하세요
                    </p>
                    <p className="text-xs text-gray-500">
                      TXT, PDF, DOC, PPT, MP4 등 파일 지원
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">
                {editId
                  ? "자료가 성공적으로 수정되었습니다."
                  : "자료가 성공적으로 업로드되었습니다."}{" "}
                잠시 후 상세 페이지로 이동합니다.
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                초기화
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {submitting
                  ? editId
                    ? "수정 중..."
                    : "업로드 중..."
                  : editId
                  ? "수정하기"
                  : "업로드"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 로딩하는 중입니다...</p>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UploadForm />
    </Suspense>
  );
}
