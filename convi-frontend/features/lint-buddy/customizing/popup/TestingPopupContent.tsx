import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useExampleStore } from "@/store/lintBuddy/example-store";

type TestingPopupContentProps = {
  regexPattern: string;
  regexExample: string;
};

const TestingPopupContent = ({ regexPattern, regexExample }: TestingPopupContentProps) => {
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const {
    inputExamples,
    addExample,
    removeExample,
    updateExample,
    clearExamples,
  } = useExampleStore();

  useEffect(() => {
    if (inputExamples.length === 0) {
      addExample("");
    }
  }, [inputExamples, addExample]);

  const handleCheck = () => {
    try {
      const regex = new RegExp(regexPattern);
      const newResults = inputExamples.map((input) => regex.test(input));
      setResults(newResults);
    } catch (e) {
      setResults(inputExamples.map(() => false));
    }
  };

  const handleClear = () => {
    clearExamples();
    setResults([]);
  };

  const overallStatus = () => {
    if (results.length === 0) return "";
    if (results.every((r) => r === true)) return "✅ 모두 맞았습니다!";
    if (results.every((r) => r === false)) return "❌ 모두 틀렸습니다!";
    if (results.some((r) => r === true)) return "⚠️ 부분적으로 맞았습니다.";
    return "";
  };

  return (
    <Card className="p-4 space-y-6">
      {/* 상단: 예제 안내 */}
      <CardHeader className="p-0 flex justify-center">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 font-semibold">예제:</p>
          <div className="bg-gray-100 px-3 py-1 rounded border border-gray-300 w-fit">
            <code className="font-mono text-xs text-gray-800">{regexExample}</code>
          </div>
        </div>
      </CardHeader>

      {/* 예제 관리 버튼 그룹 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="border-black px-2 py-1 bg-green-200 rounded text-sm hover:bg-green-100 "
          onClick={() => addExample("")}>
            + 추가
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="border-black px-2 py-1 bg-red-200 rounded text-sm hover:bg-red-100"
            onClick={() => {
              if (inputExamples.length > 0) {
                removeExample(inputExamples.length - 1);
                const newLength = inputExamples.length - 1;
                if (newLength <= 0) {
                  setResults([]);
                } else {
                  setResults((prev) => prev.slice(0, newLength));
                }
              }
            }}
          >
            - 삭제
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="border-black-200 hover:bg-red-500 hover:text-white"
        >
          초기화
        </Button>
      </div>

      {/* 예제 입력 필드들 */}
      <CardContent className="p-0 space-y-4">
        {inputExamples.map((example, index) => {
          const result = results[index];
          const borderClass =
            result === true
              ? "border-green-400"
              : result === false
              ? "border-red-400"
              : "border-gray-300";

          return (
            <div key={index} className="space-y-1">
              <Input
                className={`border ${borderClass}`}
                placeholder={`Example ${index + 1}`}
                value={example}
                onChange={(e) => updateExample(index, e.target.value)}
              />
            </div>
          );
        })}
      </CardContent>

      {/* 검사 버튼 */}
      <div>
        <Button className="w-full" onClick={handleCheck}>
          검사하기
        </Button>
      </div>

      {/* 최종 요약 */}
      <div className="text-center text-base font-semibold">{overallStatus()}</div>
    </Card>
  );
};

export default TestingPopupContent;