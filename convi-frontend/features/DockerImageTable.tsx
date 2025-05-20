const DockerImageTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Docker 이미지</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">내장 LLM 구성</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">최초 pull 용량(≈)</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">용도</th>
                </tr>
                </thead>
                <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">os2864/review-buddy-gpt:v0.1.2</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-1o 전용</td>
                    <td className="border border-gray-300 px-4 py-2">226 MB</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-1o만 사용하는 경우 추천하는 경량 이미지</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">os2864/review-buddy-gpt:v0.1.1</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-4o 전용</td>
                    <td className="border border-gray-300 px-4 py-2">226 MB</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-4o만 사용하는 경우 추천하는 경량 이미지</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">os2864/review-buddy:v0.1.6</td>
                    <td className="border border-gray-300 px-4 py-2">Ollama 3.2 + GPT-1o</td>
                    <td className="border border-gray-300 px-4 py-2">3.7 GB</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-1o 또는 Ollama 3.2 사용할 수 있는 중량 이미지</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">os2864/review-buddy:v0.1.5</td>
                    <td className="border border-gray-300 px-4 py-2">Ollama 3.2 + GPT-4o</td>
                    <td className="border border-gray-300 px-4 py-2">3.7 GB</td>
                    <td className="border border-gray-300 px-4 py-2">GPT-4o 또는 Ollama 3.2 사용할 수 있는 중량 이미지</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DockerImageTable;
