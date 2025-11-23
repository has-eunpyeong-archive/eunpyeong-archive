"use client";
import { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ArchiveDetailComponentProps {
  id: string;
}

interface Document {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string | null;
  author: string;
  grade: string;
  file_path: string | null;
  date: string;
  views: number;
  downloads: number;
}

// FileViewer component to render different file types
const FileViewer = ({
  file_path,
  content,
}: {
  file_path: string | null;
  content: string | null;
}) => {
  if (content) {
    return (
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
          {content}
        </pre>
      </div>
    );
  }

  if (!file_path) {
    return <p className="text-gray-500">표시할 파일이 없습니다.</p>;
  }

  const fileUrl = `/uploads/${file_path}`;
  const fileExtension = file_path.split(".").pop()?.toLowerCase();

  if (fileExtension === "pdf") {
    return (
      <div className="w-full h-[800px] border rounded-lg">
        <iframe
          src={fileUrl}
          width="100%"
          height="100%"
          title={file_path}
        ></iframe>
      </div>
    );
  }

  if (["mp4", "mov", "webm"].includes(fileExtension || "")) {
    return (
      <div className="w-full">
        <video controls className="w-full rounded-lg">
          <source src={fileUrl} type={`video/${fileExtension}`} />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>
    );
  }

  if (["png", "jpg", "jpeg", "gif"].includes(fileExtension || "")) {
    return (
      <div className="w-full">
        <img
          src={fileUrl}
          alt={file_path}
          className="max-w-full h-auto rounded-lg"
        />
      </div>
    );
  }

  return (
    <p className="text-gray-500">
      지원하지 않는 파일 형식입니다.{" "}
      <a href={fileUrl} download className="text-blue-600 hover:underline">
        파일 다운로드
      </a>
    </p>
  );
};

export default function ArchiveDetailComponent({
  id,
}: ArchiveDetailComponentProps) {
  const [archiveDocument, setArchiveDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      async function fetchDocument() {
        try {
          setLoading(true);
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || ""}/api/documents/${id}/view`,
            { method: "PUT" },
          );
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || ""}/api/documents/${id}`,
          );
          if (!res.ok) {
            throw new Error("문서 정보를 가져오는 데 실패했습니다.");
          }
          const data: Document = await res.json();
          setArchiveDocument(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "알 수 없는 에러가 발생했습니다.",
          );
        } finally {
          setLoading(false);
        }
      }
      fetchDocument();
    }
  }, [id]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "paper":
        return "bg-blue-100 text-blue-600";
      case "poster":
        return "bg-green-100 text-green-600";
      case "video":
        return "bg-purple-100 text-purple-600";
      case "db":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getCategoryName = (category: string) => {
    if (!category) return "자료";
    const lowerCategory = category.toLowerCase();
    if (lowerCategory === "paper") return "논문";
    if (lowerCategory === "poster") return "포스터";
    if (lowerCategory === "video") return "영상";
    return category;
  };

  const handleDownload = async () => {
    if (!archiveDocument || !archiveDocument.file_path) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/documents/${
          archiveDocument.id
        }/download`,
        { method: "PUT" },
      );
    } catch (err) {
      console.error("다운로드 횟수 증가에 실패했습니다.", err);
    }
    const fileUrl = `/uploads/${archiveDocument.file_path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = archiveDocument.file_path;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("링크 복사 실패:", err);
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleReport = () => {
    if (!reportReason || !reportDescription.trim() || !archiveDocument) {
      alert("신고 사유와 상세 내용을 모두 입력해주세요.");
      return;
    }

    const reportData = {
      archiveId: id,
      archiveTitle: archiveDocument.title,
      reason: reportReason,
      description: reportDescription,
      timestamp: new Date().toISOString(),
      reporterInfo: "Anonymous",
    };

    console.log("신고 데이터:", reportData);
    localStorage.setItem(
      `report_${id}_${Date.now()}`,
      JSON.stringify(reportData),
    );

    alert("신고가 접수되었습니다. 검토 후 조치하겠습니다.");
    setShowReportModal(false);
    setReportReason("");
    setReportDescription("");
  };

  const isAuthor =
    user && archiveDocument && user.name === archiveDocument.author;

  const handleDelete = async () => {
    if (!archiveDocument || !isAuthor) {
      alert("이 문서를 삭제할 권한이 없습니다.");
      return;
    }
    if (
      !confirm(
        "정말로 이 자료를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/documents/${
          archiveDocument.id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "삭제에 실패했습니다.");
      }

      alert("자료가 성공적으로 삭제되었습니다.");
      router.push("/archive");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">문서 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-500">에러: {error}</p>
      </div>
    );
  }

  if (!archiveDocument) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">문서를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 cursor-pointer">
              홈
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link
              href="/archive"
              className="hover:text-blue-600 cursor-pointer"
            >
              자료실
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900">자료 상세</span>
          </div>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  archiveDocument.category,
                )}`}
              >
                <i className="ri-book-line mr-1 text-sm w-4 h-4 flex items-center justify-center"></i>
                {getCategoryName(archiveDocument.category)}
              </span>
              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      router.push(`/upload?edit=${archiveDocument.id}`)
                    }
                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <i className="ri-pencil-line mr-1"></i>수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>삭제
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {archiveDocument.title}
            </h1>

            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <i className="ri-user-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                <span>
                  {archiveDocument.author} ({archiveDocument.grade})
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-calendar-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                <span>{archiveDocument.date}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-eye-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                <span>{archiveDocument.views} 조회</span>
              </div>
              <div className="flex items-center">
                <i className="ri-download-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                <span>{archiveDocument.downloads} 다운로드</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">요약</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {archiveDocument.description}
              </p>
            </div>

            {/* File Viewer */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                자료 내용
              </h3>
              <FileViewer
                file_path={archiveDocument.file_path}
                content={archiveDocument.content}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                disabled={!archiveDocument.file_path}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center whitespace-nowrap cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <i className="ri-download-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                다운로드
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 border border-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                <i className="ri-share-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                공유하기
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="border border-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                <i className="ri-flag-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                신고
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals (기존과 동일) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">공유하기</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="ri-link mr-3 text-gray-600 w-5 h-5 flex items-center justify-center"></i>
                <span className="text-gray-700">링크 복사</span>
                {copySuccess && (
                  <span className="ml-auto text-green-600 text-sm">
                    복사됨!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">신고하기</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신고 사유
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="">사유를 선택해주세요</option>
                  <option value="inappropriate">부적절한 내용</option>
                  <option value="copyright">저작권 침해</option>
                  <option value="spam">스팸/광고</option>
                  <option value="false">허위 정보</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 내용
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="신고 사유에 대해 자세히 설명해주세요..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {reportDescription.length}/500
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleReport}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  신고하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
