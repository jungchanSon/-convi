import simpleGit, { SimpleGit } from 'simple-git';
import * as vscode from 'vscode';

export const getGit = (workspacePath: string): SimpleGit => simpleGit(workspacePath);

export const isGitRepo = async (workspacePath: string): Promise<boolean> => {
  const git = getGit(workspacePath);
  return git.checkIsRepo();
};

export const getStagedDiff = async (workspacePath: string): Promise<string> => {
  const git = getGit(workspacePath);
  return git.diff(['--staged']);
};

export const getWorkspacePath = (): string | undefined => {
  const folders = vscode.workspace.workspaceFolders;
  return folders ? folders[0].uri.fsPath : undefined;
};