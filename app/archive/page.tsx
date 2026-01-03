"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Header from "../../components/Header";
import Link from "next/link";

// API로 받아올 데이터의 타입을 정의합니다.
interface Archive {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  downloads: number;
  views: number;
  description: string;
}

function ArchiveContent() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const perPage = 20; // 페이지당 항목 수

  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchTerm, setLocalSearchTerm] = useState(""); // 검색 입력 필드 상태

  const [sortBy, setSortBy] = useState("latest");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchTerm(urlSearch);
      setLocalSearchTerm(urlSearch); // localSearchTerm도 초기화
    }
    const urlPage = searchParams.get("page");
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
    const urlSortBy = searchParams.get("sort_by");
    if (urlSortBy) {
      setSortBy(urlSortBy);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchArchives() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          per_page: perPage.toString(),
          category: activeCategory === "전체" ? "" : activeCategory,
          search: searchTerm,
          sort_by: sortBy,
        }).toString();

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || ""
          }/api/documents?${queryParams}`,
        );
        if (!res.ok) {
          throw new Error("백엔드에서 데이터를 가져오는 데 실패했습니다.");
        }
        const result = await res.json();
        setArchives(result.documents);
        setTotalPages(result.total_pages);
        setCurrentPage(result.current_page);
        setTotalDocuments(result.total_documents);
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

    fetchArchives();
  }, [currentPage, activeCategory, searchTerm, sortBy]); // 의존성 배열에 추가

  const categories = [
    { id: "all", name: "전체", icon: "ri-folder-line" },
    { id: "academic-report", name: "학술팀 보고서", icon: "ri-book-line" },
    { id: "media-report", name: "미디어팀 보고서", icon: "ri-file-text-line" },
    { id: "media-content", name: "미디어팀 미디어", icon: "ri-video-line" },
    { id: "etc", name: "기타", icon: "ri-file-line" },
  ];

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      router.push(
        `/archive?page=${pageNumber}&category=${
          activeCategory === "전체" ? "" : activeCategory
        }&search=${searchTerm}&sort_by=${sortBy}`,
      );
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentPage(1); // 카테고리 변경 시 1페이지로 리셋
    router.push(
      `/archive?page=1&category=${
        categoryName === "전체" ? "" : categoryName
      }&search=${searchTerm}&sort_by=${sortBy}`,
    );
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(localSearchTerm); // 실제 검색어 상태 업데이트
    setCurrentPage(1); // 검색어 변경 시 1페이지로 리셋
    router.push(
      `/archive?page=1&category=${
        activeCategory === "전체" ? "" : activeCategory
      }&search=${localSearchTerm}&sort_by=${sortBy}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // 정렬 변경 시 1페이지로 리셋
    router.push(
      `/archive?page=1&category=${
        activeCategory === "전체" ? "" : activeCategory
      }&search=${searchTerm}&sort_by=${e.target.value}`,
    );
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.name === category); // name으로 찾도록 수정
    return cat ? cat.icon : "ri-file-line";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "학술팀 보고서":
        return "bg-blue-100 text-blue-600";
      case "미디어팀 보고서":
        return "bg-green-100 text-green-600";
      case "미디어팀 미디어":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find((c) => c.name === category); // name으로 찾도록 수정
    return cat ? cat.name : category;
  };

  const handleItemClick = (itemId: number) => {
    router.push(`/archive/detail/${itemId}`);
  };

  // 페이지네이션 버튼 렌더링 로직
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // 표시할 최대 페이지 버튼 수
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border border-gray-200 rounded-lg transition-colors cursor-pointer ${
            currentPage === i ? "bg-blue-600 text-white" : "hover:bg-gray-50"
          }`}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-[url('/img/hanok2.png')] bg-cover bg-center bg-fixed">
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Header />
      </div>

      {/* Hero Section */}
      <div className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            자료실
          </h1>
          <p className="text-xl text-white/90 mb-8 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
            하나고등학교 학생들의 연구 성과와 창작물을 탐색해보세요
          </p>
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="제목, 저자, 내용으로 검색하세요..."
                value={localSearchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-none focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">카테고리</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                        activeCategory === category.name
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <i
                        className={`${category.icon} mr-3 text-lg w-5 h-5 flex items-center justify-center`}
                      ></i>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Button */}
              <div className="mt-6">
                <Link
                  href="/upload"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-upload-2-line mr-2"></i>
                  자료 업로드
                </Link>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {activeCategory} 자료
                  </h2>
                  <p className="text-gray-600 mt-1">
                    총 {totalDocuments}개의 자료가 있습니다
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={handleSortByChange}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                  >
                    <option value="latest">최신순</option>
                    <option value="views">조회수순</option>
                    <option value="downloads">다운로드순</option>
                    <option value="title">제목순</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">자료를 불러오는 중입니다...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center items-center py-12">
                  <p className="text-lg text-red-500">
                    데이터 로딩 중 에러 발생: {error}
                  </p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {/* Archive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {archives.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className="bg-white/50 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                                item.category,
                              )}`}
                            >
                              <i
                                className={`${getCategoryIcon(
                                  item.category,
                                )} mr-1 text-sm w-4 h-4 flex items-center justify-center`}
                              ></i>
                              {getCategoryName(item.category)}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                              <i className="ri-bookmark-line text-lg w-5 h-5 flex items-center justify-center"></i>
                            </button>
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {item.description}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <i className="ri-user-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                            <span className="mr-4">{item.author}</span>
                            <i className="ri-calendar-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                            <span>{item.date}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <i className="ri-eye-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                                {item.views}
                              </span>
                              <span className="flex items-center">
                                <i className="ri-download-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                                {item.downloads}
                              </span>
                            </div>

                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                              자세히 보기
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {archives.length === 0 && (
                    <div className="text-center py-12">
                      <i className="ri-search-line text-gray-300 text-6xl mb-4 w-16 h-16 flex items-center justify-center mx-auto"></i>
                      <h3 className="text-xl font-semibold text-gray-500 mb-2">
                        검색 결과가 없습니다
                      </h3>
                      <p className="text-gray-400">
                        다른 키워드로 검색하거나 카테고리를 변경해보세요
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        {renderPaginationButtons()}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900/90 backdrop-blur-sm text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400">
            <p>&copy; 2025 Eunpyeong Archive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Archive() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[url('/img/hanok2.png')] bg-cover bg-center bg-fixed">
          <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <Header />
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </div>
      }
    >
      <ArchiveContent />
    </Suspense>
  );
}
