'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2728&auto=format&fit=crop', // 도서관
  'https://images.unsplash.com/photo-1579149296294-17e84369f3d2?q=80&w=2832&auto=format&fit=crop', // 현미경/연구
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop', // 학생/협업
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents`);
        if (!res.ok) {
          throw new Error('백엔드에서 데이터를 가져오는 데 실패했습니다.');
        }
        const result = await res.json();
        setPapers(result.documents);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, []);

  // 슬라이드쇼 타이머 useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000); // 3초마다 이미지 변경

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const handlePaperClick = (paperId: number) => {
    router.push(`/archive/detail/${paperId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-12">
          <p className="text-lg">추천 목록을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-12">
          <p className="text-lg text-red-500">데이터 로딩 중 에러 발생: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-80 rounded-b-[60px] mx-4 sm:mx-6 lg:mx-8 mt-4 overflow-hidden">
          {/* 배경 이미지 컨테이너 */}
          <div className="absolute inset-0 w-full h-full">
            {backgroundImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out rounded-b-[60px] ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          
          {/* 반투명 블러 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-75 backdrop-blur-sm"></div>

          {/* 텍스트 콘텐츠 */}
          <div className="relative h-full flex items-center justify-between px-8 lg:px-16">
            <div className="text-white">
              <h2 className="text-2xl mb-2 font-medium">은평구에 대한 새로운 시각</h2>
            </div>
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold">Eunpyeong Archive</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">추천 목록</h3>
        
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
              
              <h4 className="font-semibold text-gray-900 mb-2">{paper.title}</h4>
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
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            자료실 더보기
            <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}