// VS Code API 가져오기
import * as vscode from 'vscode';
// Git 유틸 함수들 가져오기 (저장소 감지, diff 조회, 워크스페이스 경로)
import { isGitRepo, getStagedDiff, getWorkspacePath } from './gitUtils';

// 플러그인 활성화 시 호출
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "commit-buddy" is now active!');

	// Staged Diff 출력 커맨드 등록
	const diffDisposable = vscode.commands.registerCommand('commit-buddy.showStagedDiff', async () => {

		// 현재 열려있는 워크스페이스(폴더) 경로 가져오기
		const workspacePath = getWorkspacePath();
		if (!workspacePath) {
		  vscode.window.showErrorMessage('No workspace is opened.');
		  return;
		}
	  
		// 현재 워크스페이스가 Git 저장소인지 확인
		const isRepo = await isGitRepo(workspacePath);
		if (!isRepo) {
		  vscode.window.showErrorMessage('Not a Git repository.');
		  return;
		}
	  
		// 스테이지된 변경사항(diff) 가져오기 (git diff --staged)
		const diff = await getStagedDiff(workspacePath);
		if (!diff) {
		  vscode.window.showInformationMessage('No staged changes.');
		} else {
		  console.log('Diff:', diff);  // DEBUG CONSOLE에 출력
		}
	  });

	context.subscriptions.push(diffDisposable);
}

// 플러그인 비활성화 시 호출
export function deactivate() {}
