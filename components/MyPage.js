"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("사용자 정보를 가져오는데 실패했습니다.");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!user) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">마이페이지</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <p className="text-gray-600 font-semibold">이름:</p>
          <p className="text-lg">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 font-semibold">이메일:</p>
          <p className="text-lg">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">학년:</p>
          <p className="text-lg">{user.grade || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
