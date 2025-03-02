import { useEffect } from "react";
import Calculator from "./components/calculator";

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
    <div className="min-h-screen transition-colors duration-300">
      {/* <button onClick={toggleDarkMode} className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800">
        {darkMode ? "🌞" : "🌙"}
      </button> */}

      <Calculator />
    </div>
  );
}

export default App;
