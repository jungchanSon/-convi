const SettingsTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">구분</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">키/값</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">필수 여부</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">역할 · 동작</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">비고</th>
                </tr>
                </thead>
                <tbody>
                {/* 환경 변수 */}
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-bold align-top" rowSpan={2}>환경 변수</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">GITLAB_TOKEN</td>
                    <td className="border border-gray-300 px-4 py-2">✅</td>
                    <td className="border border-gray-300 px-4 py-2">
                        MR diff 조회·코멘트 작성용 <strong>Personal Access Token</strong>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <code className="bg-gray-100 px-1 py-0.5 rounded">api</code> scope 필요
                    </td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">OPEN_AI_KEY</td>
                    <td className="border border-gray-300 px-4 py-2">옵션</td>
                    <td className="border border-gray-300 px-4 py-2">
                        GPT-4o 사용 시 OpenAI API Key
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        Ollama만 쓰면 빈 값 가능
                    </td>
                </tr>
                {/* LLM 선택 */}
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-bold">LLM 선택</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">REVIEW_MODEL</td>
                    <td className="border border-gray-300 px-4 py-2">기본=<code className="bg-gray-100 px-1 py-0.5 rounded">OpenAI</code></td>
                    <td className="border border-gray-300 px-4 py-2">
                        리뷰에 사용할 LLM 종류
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <code className="bg-gray-100 px-1 py-0.5 rounded">OpenAI</code> | <code className="bg-gray-100 px-1 py-0.5 rounded">llama3.2</code>
                    </td>
                </tr>
                {/* RAG 사용 여부 */}
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-bold">RAG 사용 여부</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">RAG_FLAG</td>
                    <td className="border border-gray-300 px-4 py-2">기본=<code className="bg-gray-100 px-1 py-0.5 rounded">rag</code></td>
                    <td className="border border-gray-300 px-4 py-2">
                        RAG 기반 컨텍스트 추가 여부
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        <code className="bg-gray-100 px-1 py-0.5 rounded">"rag"</code> | <code className="bg-gray-100 px-1 py-0.5 rounded">""</code>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SettingsTable;
