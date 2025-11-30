"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API로 받아올 데이터의 타입을 정의합니다.
interface Paper {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
}

// 슬라이드쇼에 사용할 배경 이미지 목록
const backgroundImages = [
  "/img/spring.png",
  "/img/summer.png",
  "/img/fall.png",
  "/img/winter.png",
];

export default function Home() {
  const router = useRouter();

  // API 데이터, 로딩, 에러 상태
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 슬라이드쇼 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 데이터 가져오기 useEffect
  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/documents`,
        );
        if (!res.ok) {
          throw new Error("백엔드에서 데이터를 가져오는 데 실패했습니다.");
        }
        const result = await res.json();
        setPapers(result.documents);
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
    fetchPapers();
  }, []);

  // 슬라이드쇼 타이머 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length,
      );
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const handlePaperClick = (paperId: number) => {
    router.push(`/archive/detail/${paperId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 w-full h-full -z-10">
        {backgroundImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative py-40 text-center bg-white/30 backdrop-blur-sm my-4 mx-4 sm:mx-6 lg:mx-8 rounded-2xl shadow-xl h-[400px] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Eunpyeong Archive
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            하나고등학교 학생들의 지역연계 프로젝트 결과물을 공유하는 디지털 아카이브
          </p>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">추천 목록</h3>
        {loading && <p className="text-lg">추천 목록을 불러오는 중입니다...</p>}
        {error && <p className="text-lg text-red-500">데이터 로딩 중 에러 발생: {error}</p>}
        
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {papers.map((paper) => (
                <div
                  key={paper.id}
                  onClick={() => handlePaperClick(paper.id)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                      {paper.category}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">
                    {paper.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">{paper.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{paper.date}</span>
                    <i className="ri-arrow-right-line text-gray-400 hover:text-blue-600 transition-colors"></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/archive"
                className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                자료실 더보기
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Footer */}
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
