import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function createGitHook() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('워크스페이스가 열려있지 않습니다.');
    return;
  }

  const workspacePath = workspaceFolder.uri.fsPath;

  let gitRoot: string;
  try {
    gitRoot = execSync('git rev-parse --show-toplevel', { cwd: workspacePath }).toString().trim();
  } catch (err) {
    vscode.window.showErrorMessage('Git 저장소를 찾을 수 없습니다. 프로젝트가 Git 저장소 내에 있는지 확인하세요.');
    return;
  }

  const config = vscode.workspace.getConfiguration('commitBuddy');
  const commitRegex = config.get<string>('regex') || '<type>: <description>'; // fallback
  
  // Shell-safe escape 처리 (특수문자 대비)
  const safeRegex = commitRegex.replace(/'/g, "'\"'\"'");

  const hookScript = `#!/bin/sh

commit_msg_file="$1"
commit_msg=$(cat "$commit_msg_file")

echo "$commit_msg" | grep -P '${safeRegex}' > /dev/null
if [ $? -ne 0 ]; then
  echo "커밋 메시지가 규칙에 맞지 않습니다."
  exit 1
fi
`;

  const hookDir = path.join(gitRoot, '.git', 'hooks');
  const hookPath = path.join(hookDir, 'commit-msg');

  try {
    if (!fs.existsSync(hookDir)) {
      fs.mkdirSync(hookDir, { recursive: true });
    }

    fs.writeFileSync(hookPath, hookScript, { mode: 0o755 });

    vscode.window.showInformationMessage(`Git commit hook이 생성되었습니다.`);
  } catch (err: any) {
    vscode.window.showErrorMessage(`Git hook 생성 실패: ${err.message}`);
  }
}
