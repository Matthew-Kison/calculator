import { Alert, Card, CardBody, CardFooter, CardHeader, NumberInput, Radio, RadioGroup } from "@heroui/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

// 언어 설정을 위한 번역 객체
const translations = {
  en: {
    title: "Savings Calculator",
    subtitle: "Calculate monthly deposit to achieve target amount",
    currency: "Currency",
    targetAmount: "Target Amount",
    period: "Period (months)",
    interestRate: "Annual Interest Rate (%)",
    calculate: "Calculate",
    result: "Result",
    monthlyDeposit: "Monthly Deposit:",
    invalidValues: "Please enter valid values.",
  },
  ko: {
    title: "저축 계산기",
    subtitle: "목표 금액 달성을 위한 월 납입액 계산",
    currency: "통화",
    targetAmount: "목표 금액",
    period: "기간 (개월)",
    interestRate: "연이율 (%)",
    calculate: "계산하기",
    result: "결과",
    monthlyDeposit: "월 납입액:",
    invalidValues: "유효한 값을 입력해주세요.",
  },
};

const currencies = ["KRW", "USD", "CNY", "EUR", "INR", "JPY"];

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "KRW":
      return "₩";
    case "USD":
      return "$";
    case "CNY":
      return "¥";
    case "EUR":
      return "€";
    case "INR":
      return "₹";
    case "JPY":
      return "¥";
    default:
      return "";
  }
};

const SavingsCalculator = () => {
  const [currency, setCurrency] = useState<string>("KRW"); // 기본 원화
  const [targetAmount, setTargetAmount] = useState<number>(1000000); // 목표 금액
  const [months, setMonths] = useState<number>(12); // 기간 (개월)
  const [annualRate, setAnnualRate] = useState<number>(3); // 연이율 (%)
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(null);
  const [language, setLanguage] = useState<"en" | "ko">("en"); // 기본 언어는 영어

  // 사용자 위치 기반 언어 설정
  useEffect(() => {
    // 사용자의 브라우저 언어 설정 확인
    const userLanguage = navigator.language.toLowerCase();

    // 사용자 위치 정보 가져오기 (IP 기반)
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        // 한국에서 접속한 경우 (country_code가 KR인 경우)
        if (data.country_code === "KR" || userLanguage.startsWith("ko")) {
          setLanguage("ko");
        } else {
          setLanguage("en");
        }
      })
      .catch((error) => {
        console.error("위치 정보를 가져오는데 실패했습니다:", error);
        // 오류 발생 시 브라우저 언어 설정만으로 판단
        if (userLanguage.startsWith("ko")) {
          setLanguage("ko");
        }
      });
  }, []);

  // 현재 언어에 맞는 번역 텍스트
  const t = translations[language];

  const calculateSavings = () => {
    if (months <= 0 || annualRate < 0 || targetAmount <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12; // 월 이자율
    const n = months;

    let M: number;
    if (monthlyRate === 0) {
      M = targetAmount / n; // 이자 없음
    } else {
      M = (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    return Math.ceil(M); // 반올림 처리
  };

  // 입력값이 변경될 때마다 결과 업데이트
  useEffect(() => {
    const result = calculateSavings();
    setMonthlyDeposit(result);
  }, [targetAmount, months, annualRate]);

  return (
    <>
      <Helmet>
        <title>Savings Calculator | SKHyena</title>
        <meta
          name="description"
          content="A specialized calculator for savings and investments. Plan your financial future with our easy-to-use tools for calculating interest, returns, and growth on your savings accounts and investments."
        />
        <meta
          name="keywords"
          content="savings calculator, investment calculator, compound interest, financial planning, retirement calculator, interest rate, savings planner, money growth, financial tools, SKHyena"
        />
        <meta property="og:title" content="Savings Calculator | SKHyena" />
        <meta
          property="og:description"
          content="A specialized calculator for savings and investments. Plan your financial future with our easy-to-use tools for calculating interest, returns, and growth on your savings accounts and investments."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skhyena.com/savings" />
      </Helmet>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2 flex-col">
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-blue-100">{t.subtitle}</p>
          </CardHeader>

          <CardBody className="space-y-4">
            {/* 통화 선택 */}
            <RadioGroup label={t.currency} orientation="horizontal" value={currency} onValueChange={setCurrency}>
              {currencies.map((cur) => (
                <Radio key={cur} value={cur}>
                  {cur} ({getCurrencySymbol(cur)})
                </Radio>
              ))}
            </RadioGroup>

            {/* 목표 금액 */}
            <NumberInput
              label={`${t.targetAmount} (${getCurrencySymbol(currency)})`}
              id="targetAmount"
              value={targetAmount}
              onValueChange={(e) => setTargetAmount(e)}
              className="w-full"
            />

            {/* 기간 (개월) */}
            <NumberInput label={t.period} id="months" value={months} onValueChange={(e) => setMonths(e)} className="w-full" />

            {/* 연이율 (%) */}
            <NumberInput label={t.interestRate} id="annualRate" value={annualRate} onValueChange={(e) => setAnnualRate(e)} className="w-full" />
          </CardBody>

          <CardFooter>
            {/* 결과 출력 */}
            {monthlyDeposit !== null && (
              <Alert className="w-full">
                <h3 className="text-lg font-medium">{t.result}</h3>
                <p className="mt-2">
                  <span>{t.monthlyDeposit}</span>{" "}
                  <span className="text-xl font-bold">
                    {getCurrencySymbol(currency)}
                    {monthlyDeposit ? monthlyDeposit.toLocaleString() : 0}
                  </span>
                </p>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default SavingsCalculator;
