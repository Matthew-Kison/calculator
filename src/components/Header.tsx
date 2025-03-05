import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { pathname } = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // 드로어 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 경로 변경 시 드로어 닫기
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  return (
    <header className="bg-gray-100 dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
            Calculator
          </Link>
        </div>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className={`text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                  pathname === "/" ? "text-blue-500 dark:text-blue-400" : ""
                }`}
              >
                Arithmetic Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/front-calculator"
                className={`text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 ${
                  pathname === "/front-calculator" ? "text-blue-500 dark:text-blue-400" : ""
                }`}
              >
                Frontend Calculator
              </Link>
            </li>
          </ul>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="메뉴 열기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 모바일 드로어 메뉴 */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800 dark:text-white">MENU</span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label="close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block py-2 px-4 rounded-lg ${
                  pathname === "/"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Arithmetic Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/front-calculator"
                className={`block py-2 px-4 rounded-lg ${
                  pathname === "/front-calculator"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Frontend Calculator
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 드로어가 열렸을 때 배경 오버레이 */}
      {isDrawerOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsDrawerOpen(false)} />}
    </header>
  );
}
