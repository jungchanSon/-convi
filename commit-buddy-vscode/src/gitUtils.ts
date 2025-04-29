import simpleGit, { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';

/**
 * 지정된 경로에 대한 Git 인스턴스 반환
 * @param workspacePath 워크스페이스 경로
 * @returns SimpleGit 인스턴스
 */
export const getGit = (workspacePath: string): SimpleGit => simpleGit(workspacePath);

/**
 * 해당 경로가 Git 저장소인지 확인
 * @param workspacePath 확인할 경로
 * @returns 저장소 여부 (true/false)
 */
export const isGitRepo = async (workspacePath: string): Promise<boolean> => {
  const git = getGit(workspacePath);
  return git.checkIsRepo();
};

/**
 * 스테이징된 변경사항의 diff 가져오기
 * @param workspacePath 워크스페이스 경로
 * @returns 스테이징된 diff 문자열
 */
export const getStagedDiff = async (workspacePath: string): Promise<string> => {
  const git = getGit(workspacePath);
  return git.diff(['--staged']);
};

/**
 * 스테이징되지 않은 변경사항의 diff 가져오기
 * @param workspacePath 워크스페이스 경로
 * @returns 스테이징되지 않은 diff 문자열
 */
export const getUnstagedDiff = async (workspacePath: string): Promise<string> => {
  const git = getGit(workspacePath);
  return git.diff();
};

/**
 * 현재 활성화된 워크스페이스 경로 반환
 * @returns 워크스페이스 경로 (없으면 undefined)
 */
export const getWorkspacePath = (): string | undefined => {
  const folders = vscode.workspace.workspaceFolders;
  return folders ? folders[0].uri.fsPath : undefined;
};

/**
 * 스테이징된 파일 목록 가져오기
 * @param workspacePath 워크스페이스 경로
 * @returns 스테이징된 파일 경로 배열
 */
export const getStagedFiles = async (workspacePath: string): Promise<string[]> => {
  const git = getGit(workspacePath);
  const status = await git.status();
  return status.staged;
};

/**
 * 현재 브랜치 이름 가져오기
 * @param workspacePath 워크스페이스 경로
 * @returns 현재 브랜치 이름
 */
export const getCurrentBranch = async (workspacePath: string): Promise<string> => {
  const git = getGit(workspacePath);
  return git.branch().then(result => result.current);
};