import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [numberHistory, setNumberHistory] = useState<string[]>([]);

  // 키보드 이벤트 처리 추가
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey } = event;

      // Cmd(Mac) 또는 Ctrl(Windows) 키와 함께 사용되는 경우 기본 동작 유지
      if (metaKey || ctrlKey) {
        return; // 브라우저 기본 동작 허용
      }

      event.preventDefault();

      // 숫자 키 처리 (0-9)
      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
      }
      // 소수점 처리
      else if (key === "." || key === ",") {
        inputDecimal();
      }
      // 연산자 처리
      else if (key === "+" || key === "-") {
        performOperation(key);
      } else if (key === "*") {
        performOperation("×");
      } else if (key === "/") {
        performOperation("÷");
      }
      // 엔터 키 처리 (=)
      else if (key === "Enter" || key === "=") {
        handleEquals();
      }
      // 백스페이스 처리
      else if (key === "Backspace") {
        handleBackspace();
      }
      // Escape 키 처리 (AC)
      else if (key === "Escape") {
        clearAll();
      }
      // % 키 처리
      else if (key === "%") {
        handlePercentage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display, equation, operator, prevValue, waitingForOperand, numberHistory]); // 의존성 배열에 상태 변수 추가

  // 숫자 히스토리에 추가하는 함수
  const addToNumberHistory = (number: string) => {
    // 음수인 경우 절대값으로 변환
    const absoluteNumber = number.startsWith("-") ? number.substring(1) : number;

    // 이미 히스토리에 있는 숫자는 추가하지 않음
    if (!numberHistory.includes(absoluteNumber) && absoluteNumber !== "0") {
      setNumberHistory((prev) => {
        // 중복 체크를 한번 더 수행
        if (prev.includes(absoluteNumber)) {
          return prev;
        }
        const newHistory = [absoluteNumber, ...prev];
        return newHistory.slice(0, 10);
      });
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setEquation("");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // 백스페이스 처리 함수 추가
  const handleBackspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const inputDigit = (digit: string) => {
    let newDisplay;

    // 연산 결과 후 새 숫자 입력 시 새로운 연산 시작
    if (equation === "" && prevValue !== null) {
      // 이전 결과값 히스토리에 추가
      addToNumberHistory(display);
      // 새로운 연산 시작 - 모든 상태 초기화
      clearAll();
      newDisplay = digit;
      setDisplay(newDisplay);
      setEquation(digit); // equation도 새로 설정
    } else if (waitingForOperand) {
      newDisplay = digit;
      setDisplay(newDisplay);
      setWaitingForOperand(false);
    } else {
      newDisplay = display === "0" ? digit : display + digit;
      setDisplay(newDisplay);
    }

    // 최초 숫자 입력 시 equation에 표시
    if (equation === "" && operator === null && prevValue === null) {
      setEquation(newDisplay);
    } else if (operator === null && !waitingForOperand && prevValue === null) {
      // 첫 번째 숫자를 계속 입력하는 경우 equation 업데이트
      setEquation(newDisplay);
    }
  };

  const inputDecimal = () => {
    let newDisplay;
    if (waitingForOperand) {
      newDisplay = "0.";
      setDisplay(newDisplay);
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      newDisplay = display + ".";
      setDisplay(newDisplay);
    } else {
      newDisplay = display;
    }

    // 소수점 입력 시 equation 업데이트 (추가된 부분)
    if (equation === "" && operator === null) {
      setEquation(newDisplay);
    } else if (operator === null && !waitingForOperand) {
      setEquation(newDisplay);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    // 연산자 입력 시 현재 숫자를 히스토리에 추가
    addToNumberHistory(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
      // 최초 연산자 입력 시 equation에 표시
      setEquation(`${display} ${nextOperator}`);
    } else if (operator) {
      // 연산자가 이미 있는 경우
      if (waitingForOperand) {
        // 연산자를 연속으로 입력한 경우 - 이전 연산자 덮어쓰기
        setEquation(equation.substring(0, equation.length - 1) + nextOperator);
      } else {
        const currentValue = prevValue || 0;
        let newValue = 0;

        switch (operator) {
          case "+":
            newValue = currentValue + inputValue;
            break;
          case "-":
            newValue = currentValue - inputValue;
            break;
          case "×":
            newValue = currentValue * inputValue;
            break;
          case "÷":
            newValue = currentValue / inputValue;
            break;
          default:
            break;
        }

        setPrevValue(newValue);
        setDisplay(String(newValue));
        setEquation(`${equation} ${display} ${nextOperator}`);
      }
    } else {
      setEquation(`${display} ${nextOperator}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (!operator || prevValue === null) return;

    // 등호 입력 시 현재 숫자를 히스토리에 추가
    addToNumberHistory(display);

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operator) {
      case "+":
        result = prevValue + inputValue;
        break;
      case "-":
        result = prevValue - inputValue;
        break;
      case "×":
        result = prevValue * inputValue;
        break;
      case "÷":
        result = prevValue / inputValue;
        break;
      default:
        break;
    }

    // 결과 표시
    setDisplay(String(result));
    setEquation("");
    setPrevValue(null); // 계산 후 prevValue를 null로 설정
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const toggleSign = () => {
    setDisplay(display.charAt(0) === "-" ? display.substr(1) : "-" + display);
  };

  // 버튼 스타일 클래스
  const buttonClass = "flex items-center justify-center rounded-full text-xl font-medium transition-all duration-200 focus:outline-none";
  const numberButtonClass = `${buttonClass} bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 h-16 w-16`;
  const operatorButtonClass = `${buttonClass} bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 h-16 w-16`;
  const functionButtonClass = `${buttonClass} bg-gray-500 text-white hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 h-16 w-16`;
  const equalsButtonClass = `${buttonClass} bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 h-16 w-16`;

  return (
    <>
      <Helmet>
        <title>Calculator | Dark Mode Calculator</title>
        <meta name="description" content="Simple Calculator" />
        <meta name="keywords" content="calculator, 计算器, 계산기, logging calculator" />
        <meta property="og:title" content="Calculator | Dark Mode Calculator" />
        <meta property="og:description" content="Simple logging calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skhyena.com/" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col md:flex-row w-full max-w-xl justify-center gap-4">
          {/* 계산기 본체 */}
          <div className="w-full max-w-md bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
            {/* 계산기 디스플레이 */}
            <div className="p-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
              <div className="text-right">
                <div className="text-gray-600 dark:text-gray-400 text-sm h-6 overflow-hidden">{equation}</div>
                <div className="text-4xl font-bold text-gray-800 dark:text-white tracking-wider overflow-x-auto overflow-y-hidden">{display}</div>
              </div>
            </div>

            {/* 키보드 단축키 안내 */}
            <div className="px-6 py-2 bg-gray-300 dark:bg-gray-800 text-xs text-center text-gray-600 dark:text-gray-400">
              Keyboard usage: Number keys (0-9), Operators (+, -, *, /), Enter (=), ESC (AC), Backspace
            </div>

            {/* 계산기 버튼 */}
            <div className="grid grid-cols-4 gap-3 p-6 bg-gray-200 dark:bg-gray-900">
              <button onClick={clearAll} className={functionButtonClass}>
                AC
              </button>
              <button onClick={toggleSign} className={functionButtonClass}>
                +/-
              </button>
              <button onClick={handlePercentage} className={functionButtonClass}>
                %
              </button>
              <button onClick={() => performOperation("÷")} className={operatorButtonClass}>
                ÷
              </button>

              <button onClick={() => inputDigit("7")} className={numberButtonClass}>
                7
              </button>
              <button onClick={() => inputDigit("8")} className={numberButtonClass}>
                8
              </button>
              <button onClick={() => inputDigit("9")} className={numberButtonClass}>
                9
              </button>
              <button onClick={() => performOperation("×")} className={operatorButtonClass}>
                ×
              </button>

              <button onClick={() => inputDigit("4")} className={numberButtonClass}>
                4
              </button>
              <button onClick={() => inputDigit("5")} className={numberButtonClass}>
                5
              </button>
              <button onClick={() => inputDigit("6")} className={numberButtonClass}>
                6
              </button>
              <button onClick={() => performOperation("-")} className={operatorButtonClass}>
                -
              </button>

              <button onClick={() => inputDigit("1")} className={numberButtonClass}>
                1
              </button>
              <button onClick={() => inputDigit("2")} className={numberButtonClass}>
                2
              </button>
              <button onClick={() => inputDigit("3")} className={numberButtonClass}>
                3
              </button>
              <button onClick={() => performOperation("+")} className={operatorButtonClass}>
                +
              </button>

              <button
                onClick={() => inputDigit("0")}
                className="col-span-2 flex items-center justify-start pl-7 rounded-full bg-gray-700 text-white hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 h-16 text-xl font-medium transition-all duration-200 focus:outline-none"
              >
                0
              </button>
              <button onClick={inputDecimal} className={numberButtonClass}>
                .
              </button>
              <button onClick={handleEquals} className={equalsButtonClass}>
                =
              </button>
            </div>
          </div>

          {/* 최근 입력 숫자 히스토리 */}
          <div className="w-full md:w-24 bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden ">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center text-sm font-medium">Recents</div>
            <div className="p-3 flex flex-row flex-nowrap md:flex-1 md:flex-col gap-2">
              {numberHistory.length > 0 ? (
                numberHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDisplay(item);
                      if (equation === "" || waitingForOperand) {
                        setEquation(item);
                      }
                    }}
                    className="p-2 text-center bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors truncate"
                  >
                    {item}
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 text-xs p-2">Input numbers will be displayed here</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
