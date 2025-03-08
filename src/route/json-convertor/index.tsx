import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function JsonConvertor() {
  const [inputJson, setInputJson] = useState<string>("");
  const [outputJson, setOutputJson] = useState<string>("");

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      setOutputJson("");
      return;
    }

    setInputJson(value);

    try {
      const parsed = JSON.parse(value);
      setOutputJson(JSON.stringify(parsed, null, 2));
    } catch (error) {
      console.error("Invalid JSON:", error);
      setOutputJson(
        "Invalid JSON format\n\n" +
          "Please check your JSON. The JSON format must follow these rules:\n\n" +
          "1) All keys must be enclosed in double quotes.\n" +
          "2) String values must also be enclosed in double quotes.\n" +
          "3) Each key-value pair must be separated by a colon (:), and pairs must be separated by commas (,)."
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>JSON Convertor | SKHyena</title>
        <meta
          name="description"
          content="Free online JSON Converter tool to format, validate and beautify your JSON data. Easily parse, transform and visualize JSON with our simple and powerful editor. Perfect for developers working with APIs and data structures."
        />
        <meta
          name="keywords"
          content="JSON, JSON converter, JSON formatter, JSON parser, JSON validator, JSON beautifier, JSON editor, JSON viewer, developer tools, web tools"
        />
        <meta property="og:title" content="JSON Convertor | SKHyena" />
        <meta
          property="og:description"
          content="Free online JSON Converter tool to format, validate and beautify your JSON data. Easily parse, transform and visualize JSON with our simple and powerful editor. Perfect for developers working with APIs and data structures."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skhyena.com/json-convertor" />
      </Helmet>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-center">JSON Convertor</h1>
        <div className="flex flex-col md:flex-row gap-4 h-[70vh]">
          <div className="flex-1 border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-2 text-sm">Input JSON</div>
            <MonacoEditor
              height="calc(100% - 32px)"
              defaultLanguage="json"
              value={inputJson}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <div className="flex-1 border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-2 text-sm">Converted JSON</div>
            <MonacoEditor
              height="calc(100% - 32px)"
              defaultLanguage="json"
              value={outputJson}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
