
'use client';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Introduction() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Eunpyeong Archive 소개
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            하나고등학교 지역연계 프로젝트 결과물을 공유하는 디지털 아카이브
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">우리의 미션</h2>
            <p className="text-lg text-gray-600 mb-6">
              Eunpyeong Archive는 하나고등학교 학생들의 지역연계 프로젝트 결과물을 
              체계적으로 수집, 보존, 공유하는 플랫폼입니다.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              학생들의 연구 논문, 포스터, 영상 작품 등을 통해 지역사회와의 연결고리를 
              강화하고 학생들 간의 교류를 활성화하는 것이 우리의 목표입니다.
            </p>
            <Link
              href="/archive"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              자료실 둘러보기
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-book-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">연구 논문</h3>
                  <p className="text-gray-600">지역연계 프로젝트 연구 성과물 관리</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-image-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">포스터</h3>
                  <p className="text-gray-600">프로젝트 결과물의 시각적 표현</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-video-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">영상</h3>
                  <p className="text-gray-600">프로젝트 과정과 결과 영상 기록</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">주요 기능</h2>
            <p className="text-lg text-gray-600">
              하나고등학교 지역연계 프로젝트를 지원하는 다양한 기능을 제공합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-upload-2-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">간편한 업로드</h3>
              <p className="text-gray-600">
                직관적인 인터페이스로 논문, 포스터, 영상을 쉽게 업로드할 수 있습니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-2-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">스마트 검색</h3>
              <p className="text-gray-600">
                키워드, 카테고리, 저자별로 원하는 자료를 빠르게 찾을 수 있습니다.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-share-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">학생 교류</h3>
              <p className="text-gray-600">
                프로젝트 결과물을 동료들과 쉽게 공유하고 피드백을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About School Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">하나고등학교 지역연계 프로젝트</h2>
          <p className="text-lg text-gray-600 mb-8">
            하나고등학교는 지역사회와의 연결을 통해 학생들의 실질적인 학습 경험을 제공합니다.
            지역연계 프로젝트를 통해 학생들은 지역 문제를 발견하고 해결방안을 모색하며,
            이 과정에서 얻은 성과물을 Eunpyeong Archive에서 공유합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              회원가입하기
            </Link>
            <Link
              href="/archive"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              자료실 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-archive-line text-white text-lg"></i>
                </div>
                <span className="text-lg font-semibold">Eunpyeong Archive</span>
              </div>
              <p className="text-gray-400">
                하나고등학교 지역연계 프로젝트 결과물을 공유하는 디지털 아카이브 플랫폼
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">메뉴</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">홈</Link></li>
                <li><Link href="/introduction" className="hover:text-white transition-colors cursor-pointer">소개</Link></li>
                <li><Link href="/archive" className="hover:text-white transition-colors cursor-pointer">자료실</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">계정</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/login" className="hover:text-white transition-colors cursor-pointer">로그인</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors cursor-pointer">회원가입</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400">
            <p>&copy; 2025 Eunpyeong Archive. All rights reserved.</p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
