'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/archive?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoginOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 mr-3 flex items-center justify-center">
              <img 
                src="https://static.readdy.ai/image/6ec37383ed77e59432a1d898729581ca/4bbef40c987483839884a776d07ede23.png" 
                alt="은평 아카이브 로고"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-gray-900">은평 아카이브</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/introduction" className="text-gray-700 hover:text-blue-600 transition-colors">
              소개
            </Link>
            <Link href="/archive" className="text-gray-700 hover:text-blue-600 transition-colors">
              자료실
            </Link>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <i className="ri-search-line text-gray-400 text-sm"></i>
              </button>
            </form>
          </nav>

          {/* Login/Register or MyPage/Logout */}
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <i className="ri-user-line mr-2"></i>
                {isAuthenticated ? '마이페이지' : '로그인 / 회원가입'}
              </button>

              {/* Dropdown */}
              {isLoginOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 p-2 z-50 w-48">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <Link
                        href="/mypage"
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        <i className="ri-user-line mr-3 text-lg w-5 h-5 flex items-center justify-center"></i>
                        마이페이지
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center"
                      >
                        <i className="ri-logout-box-line mr-3 text-lg w-5 h-5 flex items-center justify-center"></i>
                        로그아웃
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        href="/login"
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        <i className="ri-login-box-line mr-3 text-lg w-5 h-5 flex items-center justify-center"></i>
                        로그인
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center"
                        onClick={() => setIsLoginOpen(false)}
                      >
                        <i className="ri-user-add-line mr-3 text-lg w-5 h-5 flex items-center justify-center"></i>
                        회원가입
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-3">
            <Link href="/introduction" className="text-gray-700 hover:text-blue-600">소개</Link>
            <Link href="/archive" className="text-gray-700 hover:text-blue-600">자료실</Link>
            <form onSubmit={handleSearch} className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-search-line text-gray-400 text-sm"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}