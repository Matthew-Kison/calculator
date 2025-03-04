import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calculator from "./components/calculator";
import FrontCalculator from "./route/front-calculator";

function App() {
  // const [darkMode, setDarkMode] = useState(false);

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle("dark");
  // };
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        {/* <button onClick={toggleDarkMode} className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800">
          {darkMode ? "🌞" : "🌙"}
        </button> */}

        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/front-calculator" element={<FrontCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
