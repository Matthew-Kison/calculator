import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Calculator from "./components/calculator";
import FrontCalculator from "./route/front-calculator";
import SavingsCalculator from "./route/savings";
import JsonConvertor from "./route/json-convertor";
import Favicon from "./route/favicon";

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
      <div className="min-h-screen transition-colors duration-300 flex flex-col">
        <Header />
        <main className="flex-grow">
          {/* <button onClick={toggleDarkMode} className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800">
            {darkMode ? "🌞" : "🌙"}
          </button> */}

          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/front-calculator" element={<FrontCalculator />} />
            <Route path="/savings" element={<SavingsCalculator />} />
            <Route path="/json-convertor" element={<JsonConvertor />} />
            <Route path="/favicon" element={<Favicon />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
