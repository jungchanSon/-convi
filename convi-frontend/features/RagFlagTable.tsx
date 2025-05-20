const RagFlagTable = () => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">RAG_FLAG 값</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">프롬프트에 포함되는 컨텍스트</th>
                </tr>
                </thead>
                <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">"rag"</td>
                    <td className="border border-gray-300 px-4 py-2">변경 코드 + <strong>유사도 상위 5개</strong> 코드 조각</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">"" (빈 값)</td>
                    <td className="border border-gray-300 px-4 py-2">변경 코드만 사용</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RagFlagTable;
