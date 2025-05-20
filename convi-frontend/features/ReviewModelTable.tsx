const ReviewModelTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">REVIEW_MODEL 값</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">사용 LLM</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">비고</th>
                </tr>
                </thead>
                <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">OpenAI</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">GPT Open API</td>
                    <td className="border border-gray-300 px-4 py-2">OpenAI API Key 필요</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">llama3.2</td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Ollama 3.2</td>
                    <td className="border border-gray-300 px-4 py-2">이미지에 Ollama 모델 사전 내장</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ReviewModelTable;
