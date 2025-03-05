import { Helmet } from "react-helmet-async";
import Calculator from "../../components/calculator";
import { useState } from "react";

export default function FrontCalculator() {
  const [activeTab, setActiveTab] = useState("aspect-ratio");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [hexColor, setHexColor] = useState("#000000");
  const [rgbColor, setRgbColor] = useState("rgb(0, 0, 0)");
  const [pxValue, setPxValue] = useState("");
  const [remValue, setRemValue] = useState("");

  // 16:9 비율 계산 함수
  const calculateAspectRatio = (type: "width" | "height", value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    if (type === "width") {
      setWidth(value);
      setHeight(((numValue * 9) / 16).toFixed(2));
    } else {
      setHeight(value);
      setWidth(((numValue * 16) / 9).toFixed(2));
    }
  };

  // HEX to RGB 변환 함수
  const hexToRgb = (hex: string) => {
    setHexColor(hex);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setRgbColor(`rgb(${r}, ${g}, ${b})`);
    }
  };

  // px to rem 변환 함수 (기본 16px = 1rem)
  const pxToRem = (px: string) => {
    const numValue = parseFloat(px);
    if (isNaN(numValue)) return;

    setPxValue(px);
    setRemValue((numValue / 16).toFixed(4));
  };

  // rem to px 변환 함수
  const remToPx = (rem: string) => {
    const numValue = parseFloat(rem);
    if (isNaN(numValue)) return;

    setRemValue(rem);
    setPxValue((numValue * 16).toFixed(0));
  };

  return (
    <>
      <Helmet>
        <title>프론트엔드 계산기 | 프론트엔드 웹 개발자를 위한 계산기</title>
        <meta
          name="description"
          content="A special calculator application for frontend developers. Provides various functions such as aspect ratio calculation, color conversion, and unit conversion."
        />
        <meta name="keywords" content="frontend, calculator, developer tools, React, aspect ratio calculation, color conversion, unit conversion" />
        <meta property="og:title" content="Frontend Calculator | Frontend Web Developer Calculator" />
        <meta
          property="og:description"
          content="Frontend developer's special calculator application. Provides various functions such as aspect ratio calculation, color conversion, and unit conversion."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skhyena.com/front-calculator" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Frontend Calculator</h1>

          {/* 탭 메뉴 */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex">
              <button
                onClick={() => setActiveTab("aspect-ratio")}
                className={`px-4 py-2 rounded-md ${activeTab === "aspect-ratio" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
              >
                Aspect Ratio
              </button>
              <button
                onClick={() => setActiveTab("color-converter")}
                className={`px-4 py-2 rounded-md ${activeTab === "color-converter" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
              >
                Color Converter
              </button>
              <button
                onClick={() => setActiveTab("unit-converter")}
                className={`px-4 py-2 rounded-md ${activeTab === "unit-converter" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
              >
                Unit Converter
              </button>
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="flex justify-center">
            {activeTab === "calculator" && (
              <div className="w-full max-w-xl">
                <Calculator />
              </div>
            )}

            {activeTab === "aspect-ratio" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xl">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Aspect Ratio Calculator (16:9)</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => calculateAspectRatio("width", e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter width"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => calculateAspectRatio("height", e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter height"
                      />
                      <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">px</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 text-center">
                    Aspect Ratio:{" "}
                    <span className="font-semibold">
                      {width} × {height}
                    </span>
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>* 16:9 is the standard aspect ratio used on most monitors and TVs, including HD (1920×1080), FHD, and 4K.</p>
                </div>
              </div>
            )}

            {activeTab === "color-converter" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xl">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Color Converter</h2>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">HEX Color</label>
                  <div className="flex">
                    <input
                      type="color"
                      value={hexColor}
                      onChange={(e) => hexToRgb(e.target.value)}
                      className="h-10 w-12 rounded-l-lg border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={hexColor}
                      onChange={(e) => hexToRgb(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">RGB Color</label>
                  <input
                    type="text"
                    value={rgbColor}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-6 flex items-center">
                  <div className="w-full h-20 rounded-lg" style={{ backgroundColor: hexColor }}></div>
                </div>
              </div>
            )}

            {activeTab === "unit-converter" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-xl">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Unit Converter</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Pixel (px)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pxValue}
                        onChange={(e) => pxToRem(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                      />
                      <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Rem (rem)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={remValue}
                        onChange={(e) => remToPx(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder=""
                      />
                      <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">rem</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>* Default setting: 1rem = 16px (browser default)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
