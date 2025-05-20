
const EnvVarTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">변수 이름</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">필수</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">용도 / 설명</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">비고</th>
                </tr>
                </thead>
                <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">GITLAB_TOKEN</td>
                    <td className="border border-gray-300 px-4 py-2">✅</td>
                    <td className="border border-gray-300 px-4 py-2">
                        <strong>API 스코프</strong>가 포함된 Personal Access Token. MR diff 조회·코멘트 작성에 사용
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        프로젝트 Owner 계정으로 발급 권장
                    </td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">OPEN_AI_KEY</td>
                    <td className="border border-gray-300 px-4 py-2">▫️</td>
                    <td className="border border-gray-300 px-4 py-2">
                        GPT-4o 리뷰를 사용할 때 입력하는 OpenAI API Key
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        Ollama만 쓸 경우 비워도 무방
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EnvVarTable;