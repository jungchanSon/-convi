
const RunnerTable = () => {
    return (
        <div className="overflow-x-auto mt-3">
            <table className="min-w-full border border-gray-300 text-sm text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">변수명</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">용도 / 설명</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">지정 방법</th>
                </tr>
                </thead>
                <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">gitlab_runner_token</td>
                    <td className="border border-gray-300 px-4 py-2">
                        GitLab <strong>New project runner</strong> 화면 <em>Step 1</em> 에서 복사한 Registration Token
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        아래 Runner 설정 명령어에 직접 치환<br />
                        혹은 Runner 사용 환경에서 <code className="bg-gray-100 px-1 py-0.5 rounded">export gitlab_runner_token=…</code> 후 명령 실행
                    </td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600">gitlab_url</td>
                    <td className="border border-gray-300 px-4 py-2">
                        Runner를 등록할 GitLab 인스턴스 URL (예: <code className="bg-gray-100 px-1 py-0.5 rounded">https://lab.ssafy.com</code>)
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        Runner 설정 명령어에 직접 치환<br />
                        혹은 Runner 사용 환경에서 <code className="bg-gray-100 px-1 py-0.5 rounded">export gitlab_url=…</code> 후 명령 실행
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RunnerTable