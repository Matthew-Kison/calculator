import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet-async";

export default function Favicon() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // 이미지 파일만 허용
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        generateFavicon(imageUrl);
      };
      reader.readAsDataURL(file);
    },
  });

  const generateFavicon = (imageUrl: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // favicon 표준 크기 (16x16, 32x32, 48x48)
      canvas.width = 32;
      canvas.height = 32;

      if (ctx) {
        // 이미지를 캔버스에 그리기
        ctx.drawImage(img, 0, 0, 32, 32);

        // 캔버스를 favicon 형식으로 변환
        const faviconDataUrl = canvas.toDataURL("image/png");
        setFaviconUrl(faviconDataUrl);
      }
    };

    img.src = imageUrl;
  };

  const downloadFavicon = () => {
    if (!faviconUrl) return;

    const link = document.createElement("a");
    link.href = faviconUrl;
    link.download = "favicon.ico";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <title>Favicon Generator | SKHyena</title>
        <meta name="description" content="Free online Favicon Generator tool to convert your image into a favicon for your website." />
        <meta name="keywords" content="favicon, favicon generator, 파비콘, 파비콘 변환" />
        <meta property="og:title" content="Favicon Generator | SKHyena" />
        <meta property="og:description" content="Free online Favicon Generator tool to convert your image into a favicon for your website." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skhyena.com/favicon" />
      </Helmet>
      <div className="max-w-3xl mx-auto p-5 font-sans">
        <h1 className="text-2xl font-bold text-gray-100 text-center mb-2">Favicon Generator</h1>
        <p className="text-gray-400 text-center mb-8">Upload an image to convert it into a favicon for your website.</p>

        <div className="mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-3">
              <svg
                className={`w-12 h-12 ${isDragActive ? "text-blue-500" : "text-gray-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {isDragActive ? (
                <p className="text-blue-500 font-medium">Drop your image here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-1">Drag and drop your image here or</p>
                  <p className="text-blue-500 font-medium">Click to select a file</p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Supported formats: PNG, JPG, GIF, SVG, etc.</p>
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="bg-gray-100 p-5 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Original Image</h3>
              <img src={selectedImage} alt="Original Image" className="max-w-[200px] max-h-[200px] object-contain mx-auto" />
            </div>

            {faviconUrl && (
              <div className="bg-gray-100 p-5 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Favicon Preview</h3>
                <div className="flex flex-col items-center gap-5">
                  <img src={faviconUrl} alt="favicon_img" className="w-16 h-16 border border-gray-300 p-1 bg-white" />
                  <div className="w-full max-w-[300px] border border-gray-300 rounded-t-lg bg-gray-50 p-2">
                    <div className="flex items-center bg-white rounded-t p-1 border border-gray-200 w-fit">
                      <img src={faviconUrl} alt="tab_favicon" className="w-4 h-4 mr-2" />
                      <span className="text-sm text-black">myWebsite | SKHyena</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={downloadFavicon}
                  className="mt-5 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Download Favicon For Free
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-5 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">What is Favicon?</h3>
          <p className="text-gray-600 text-left leading-relaxed">
            Favicon is a small icon that represents your website, displayed in the browser tab, bookmark list, and history. Typically, it is provided
            in .ico format with 16x16, 32x32, and 48x48 pixel sizes.
          </p>
        </div>
      </div>
    </>
  );
}
