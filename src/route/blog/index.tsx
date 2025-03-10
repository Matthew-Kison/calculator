import { CircularProgress, Input } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

// 블로그 포스트 타입 정의
interface BlogPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  date: string;
}

// 가상의 API 호출 함수
const fetchPosts = async ({
  pageParam = 0,
  searchQuery = "",
  category = "react",
}: {
  pageParam?: number;
  searchQuery?: string;
  category?: string;
}): Promise<{ posts: BlogPost[]; nextPage: number | null }> => {
  // 실제 구현에서는 여기서 API를 호출합니다
  // 지금은 가상 데이터를 반환합니다
  await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 시뮬레이션

  const mockPosts: BlogPost[] = Array.from({ length: 10 }, (_, i) => ({
    id: pageParam * 10 + i + 1,
    title: `React 블로그 포스트 ${pageParam * 10 + i + 1}`,
    description: "리액트에 관한 흥미로운 내용을 다루는 블로그 포스트입니다. 컴포넌트, 훅, 상태 관리 등에 대해 알아봅니다.",
    thumbnail: `https://picsum.photos/seed/${pageParam * 10 + i + 1}/400/300`,
    category: "react",
    date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
  }));

  // 검색어 필터링
  const filteredPosts = searchQuery
    ? mockPosts.filter(
        (post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockPosts;

  // 카테고리 필터링
  const categoryFilteredPosts = category ? filteredPosts.filter((post) => post.category === category) : filteredPosts;

  return {
    posts: categoryFilteredPosts,
    nextPage: pageParam < 5 ? pageParam + 1 : null, // 최대 5페이지까지만 제공
  };
};

// 블로그 카드 컴포넌트
const BlogCard = ({ post, onClick }: { post: BlogPost; onClick: () => void }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClick}>
      <div className="h-48 overflow-hidden">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{post.category}</span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-100">{post.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-3">{post.description}</p>
      </div>
    </div>
  );
};

export default function Blog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { ref, inView } = useInView();

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["blogPosts", debouncedQuery],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        pageParam,
        searchQuery: debouncedQuery,
        category: "react",
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // 인피니티 스크롤 구현
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 포스트 목록 평탄화
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // 포스트 클릭 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>React Blog | 최신 리액트 정보</title>
        <meta name="description" content="리액트 관련 최신 정보와 튜토리얼을 제공하는 블로그입니다." />
      </Helmet>

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">React Blog</h1>

      {/* 검색 바 */}
      <div className="relative max-w-md mx-auto mb-8">
        <Input
          startContent={<FaMagnifyingGlass className="h-5 w-5 text-gray-400" />}
          placeholder="블로그 포스트 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 블로그 포스트 그리드 */}
      {status === "pending" ? (
        <div className="flex justify-center items-center">
          <CircularProgress aria-label="Loading..." label="Loading..." size="lg" color="default" />
        </div>
      ) : status === "error" ? (
        <div className="text-center py-10">
          <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : (
        <>
          {allPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <BlogCard key={post.id} post={post} onClick={() => handlePostClick(post.id)} />
              ))}
            </div>
          )}

          {/* 로딩 인디케이터 */}
          <div ref={ref} className={`flex justify-center mt-8 ${!hasNextPage ? "hidden" : ""}`}>
            {isFetchingNextPage && <CircularProgress aria-label="More..." label="More..." size="lg" color="secondary" />}
          </div>

          {/* 더 이상 데이터가 없을 때 */}
          {!hasNextPage && allPosts.length > 0 && <p className="text-center text-gray-400 mt-8">모든 포스트를 불러왔습니다.</p>}
        </>
      )}
    </div>
  );
}
