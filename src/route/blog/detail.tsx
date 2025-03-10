import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FaArrowLeft } from "react-icons/fa6";

// 블로그 포스트 타입 정의 (index.tsx와 동일)
interface BlogPost {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  date: string;
  content?: string; // 상세 내용 추가
}

// 가상의 API 호출 함수 - 단일 포스트 조회
const fetchPostDetail = async (postId: string): Promise<BlogPost> => {
  // 실제 구현에서는 여기서 API를 호출합니다
  await new Promise((resolve) => setTimeout(resolve, 500)); // API 호출 시뮬레이션

  // 가상 데이터 생성
  return {
    id: parseInt(postId),
    title: `React 블로그 포스트 ${postId}`,
    description: "리액트에 관한 흥미로운 내용을 다루는 블로그 포스트입니다. 컴포넌트, 훅, 상태 관리 등에 대해 알아봅니다.",
    thumbnail: `https://picsum.photos/seed/${postId}/800/400`,
    category: "react",
    date: new Date().toISOString().split("T")[0],
    content: `
      # React 블로그 포스트 ${postId}
      
      이 블로그 포스트에서는 React의 다양한 기능과 최신 트렌드에 대해 알아봅니다.
      
      ## 주요 내용
      
      1. **컴포넌트 설계**: 효율적인 컴포넌트 구조 설계 방법
      2. **상태 관리**: React의 상태 관리 방법과 라이브러리 비교
      3. **성능 최적화**: 렌더링 최적화 및 메모이제이션 기법
      
      React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리로, 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 요소를 만들 수 있습니다.
      
      \`\`\`jsx
      function Example() {
        const [count, setCount] = useState(0);
        
        return (
          <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
              Click me
            </button>
          </div>
        );
      }
      \`\`\`
      
      React의 선언적 프로그래밍 방식은 코드의 가독성을 높이고 디버깅을 용이하게 합니다.
    `,
  };
};

export default function BlogDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");

  // postId가 없으면 블로그 목록으로 리다이렉트
  useEffect(() => {
    if (!postId) {
      navigate("/blog");
    }
  }, [postId, navigate]);

  const { data: post, status } = useQuery({
    queryKey: ["blogPost", postId],
    queryFn: () => fetchPostDetail(postId!),
    enabled: !!postId,
  });

  // 마크다운 렌더링 (실제로는 마크다운 라이브러리를 사용해야 함)
  useEffect(() => {
    if (post?.content) {
      // 간단한 마크다운 파싱 (실제로는 marked나 remark 같은 라이브러리 사용 권장)
      let html = post.content
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\n/g, "<br/><br/>");

      // 코드 블록 처리
      html = html.replace(
        /```([a-z]*)\n([\s\S]*?)```/g,
        '<pre class="bg-gray-800 text-gray-100 p-4 rounded my-4 overflow-x-auto"><code>$2</code></pre>'
      );

      setContent(html);
    }
  }, [post]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{post?.title || "블로그 상세"} | React Blog</title>
        <meta name="description" content={post?.description} />
      </Helmet>

      {/* 뒤로 가기 버튼 */}
      <button onClick={() => navigate("/blog")} className="flex items-center text-blue-500 hover:text-blue-700 mb-6">
        <FaArrowLeft className="mr-2" /> 블로그 목록으로 돌아가기
      </button>

      {status === "pending" ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-400">포스트를 불러오는 중...</p>
        </div>
      ) : status === "error" ? (
        <div className="text-center py-10">
          <p className="text-red-500">포스트를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      ) : post ? (
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          {/* 헤더 이미지 */}
          <div className="h-64 md:h-96 overflow-hidden">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* 포스트 메타데이터 */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{post.category}</span>
              <span className="text-sm text-gray-400">{post.date}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">{post.title}</h1>
            <p className="text-xl text-gray-300 mb-8">{post.description}</p>

            {/* 포스트 내용 */}
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
