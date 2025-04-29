// VS Code API 가져오기
import * as vscode from 'vscode';
// Git 유틸 함수들 가져오기 (저장소 감지, diff 조회, 워크스페이스 경로)
import { isGitRepo, getStagedDiff, getWorkspacePath } from './gitUtils';

// 플러그인 활성화 시 호출
export function activate(context: vscode.ExtensionContext) {
  console.log('"commit-buddy" 플러그인이 활성화되었습니다!');

  // 설정에서 모델 이름 가져오기 (기본값: codellama:latest)
  const config = vscode.workspace.getConfiguration('commitBuddy');
  const modelName = config.get<string>('modelName') || 'codellama:latest';
  
  // 백그라운드에서 모델 미리 로드 (활성화 시 모델 준비)
  preloadModel(modelName);

  // [1] Staged Diff 출력 커맨드 등록
  const diffDisposable = vscode.commands.registerCommand('commit-buddy.showStagedDiff', async () => {
    const workspacePath = getWorkspacePath();
    if (!workspacePath) {
      vscode.window.showErrorMessage('워크스페이스가 열려있지 않습니다.');
      return;
    }

    const isRepo = await isGitRepo(workspacePath);
    if (!isRepo) {
      vscode.window.showErrorMessage('Git 저장소가 아닙니다.');
      return;
    }

    const diff = await getStagedDiff(workspacePath);
    if (!diff) {
      vscode.window.showInformationMessage('스테이지된 변경사항이 없습니다.');
    } else {
      console.log('📦 스테이지된 변경사항 (Diff):', diff);
    }
  });
  context.subscriptions.push(diffDisposable);

  /**
   * Ollama에 특정 모델이 설치되어 있는지 확인
   * @param model 확인할 모델 이름
   * @returns 모델 존재 여부 (true/false)
   */
  async function checkOllamaModel(model: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json() as { models: { name: string }[] };
      const models = data.models.map((m) => m.name);
      console.log('설치된 Ollama 모델 목록:', models);
      return models.includes(model);
    } catch (error) {
      console.error('Ollama 서버 연결 오류:', error);
      vscode.window.showErrorMessage('Ollama 서버에 연결할 수 없습니다. Ollama가 실행 중인지 확인하세요.');
      return false;
    }
  }

  /**
   * Ollama 모델을 백그라운드에서 미리 로드
   * @param model 로드할 모델 이름
   */
  async function preloadModel(model: string): Promise<void> {
    try {
      // 모델 존재 여부 확인
      const modelExists = await checkOllamaModel(model);
      if (!modelExists) {
        console.log(`모델 '${model}'이 설치되어 있지 않아 사전 로딩을 건너뜁니다.`);
        return;
      }

      // 상태 표시줄에 로딩 메시지 표시
      const loadingMessage = vscode.window.setStatusBarMessage(`$(sync~spin) Commit Buddy: ${model} 모델 준비 중...`);
      
      // 매우 간단한 프롬프트로 모델 메모리에 로드
      const startTime = Date.now();
      await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          prompt: 'Hello',
          stream: false
        })
      });

      const loadTime = Date.now() - startTime;
      console.log(`모델 '${model}' 사전 로딩 완료 (${loadTime}ms)`);
      
      // 로딩 완료 메시지로 변경
      loadingMessage.dispose();
      vscode.window.setStatusBarMessage(`Commit Buddy: ${model} 모델 준비 완료`, 3000);
    } catch (error) {
      console.error('모델 사전 로딩 중 오류:', error);
      // 오류가 발생해도 플러그인 사용에 영향이 없도록 조용히 실패
    }
  }

  // 커밋 메시지 추천 커맨드 등록
  const recommendDisposable = vscode.commands.registerCommand('commit-buddy.recommendMessage', async () => {
    const workspacePath = getWorkspacePath();
    if (!workspacePath) {
      vscode.window.showErrorMessage('워크스페이스가 열려있지 않습니다.');
      return;
    }

    const isRepo = await isGitRepo(workspacePath);
    if (!isRepo) {
      vscode.window.showErrorMessage('Git 저장소가 아닙니다.');
      return;
    }

    const diff = await getStagedDiff(workspacePath);
    if (!diff) {
      vscode.window.showInformationMessage('스테이지된 변경사항이 없습니다.');
      return;
    }

    // 설정에서 모델 이름 가져오기 (기본값: codellama:latest)
    const config = vscode.workspace.getConfiguration('commitBuddy');
    const modelName = config.get<string>('modelName') || 'codellama:latest';
    
    const modelExists = await checkOllamaModel(modelName);
    if (!modelExists) {
      const installOption = '모델 설치';
      const result = await vscode.window.showErrorMessage(
        `${modelName} 모델이 Ollama에 설치되어 있지 않습니다.`,
        installOption,
        '취소'
      );
      
      if (result === installOption) {
        // 터미널 열고 모델 설치 명령어 실행
        const terminal = vscode.window.createTerminal('Ollama Model Install');
        terminal.sendText(`ollama pull ${modelName}`);
        terminal.show();
      }
      return;
    }

    try {
      // 로딩 메시지 표시
      const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
      statusBarItem.text = "$(sync~spin) 커밋 메시지 추천 중...";
      statusBarItem.show();

      const recommendedMessages = await fetchLLMRecommendation(diff, modelName);
      statusBarItem.dispose();

      // 각 추천 메시지를 별도의 QuickPickItem으로 변환
      const options: vscode.QuickPickItem[] = [
        ...recommendedMessages.map(msg => ({
          label: msg,
          description: '' // 필요시 여기에 설명 추가 가능
        })),
        // 직접 입력 옵션
        {
          label: '$(pencil) 직접 입력...',
          description: ''
        }
      ];

      const selected = await vscode.window.showQuickPick(options, {
        placeHolder: '추천 커밋 메시지를 선택하세요'
      });

      if (selected) {
        if (selected.label === '$(pencil) 직접 입력...') {
          const userInput = await vscode.window.showInputBox({
            placeHolder: '커밋 메시지를 입력하세요'
          });
          
          if (userInput) {
            await commitWithMessage(userInput);
          }
        } else {
          await commitWithMessage(selected.label);
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`오류 발생: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  context.subscriptions.push(recommendDisposable);

  // 플러그인 설정 등록
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('commitBuddy')) {
        // 설정이 변경되면 모델 다시 로드
        console.log('Commit Buddy 설정이 변경되었습니다.');
        const newModelName = config.get<string>('modelName') || 'codellama:latest';
        preloadModel(newModelName);
      }
    })
  );
}

/**
 * 커밋 실행 함수
 * @param message 커밋 메시지
 */
async function commitWithMessage(message: string): Promise<void> {
  try {
    // Git 커밋 명령 실행
    await vscode.commands.executeCommand('git.commitStagedWithMessage', message);
    vscode.window.showInformationMessage(`커밋 완료: ${message}`);
  } catch (error) {
    vscode.window.showErrorMessage(`커밋 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Ollama LLM API 호출 함수
 * @param diff Git diff 문자열
 * @param modelName 사용할 모델 이름
 * @returns 추천 커밋 메시지 배열
 */
async function fetchLLMRecommendation(diff: string, modelName: string): Promise<string[]> {
  // diff 길이가 너무 길면 짧게 줄이기 (필요 시)
  const truncatedDiff = diff.length > 2000 ? diff.substring(0, 2000) + '...(truncated)' : diff;

  // 타임아웃 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: `다음 Git diff를 참고해서 **3개의 좋은 커밋 메시지**를 제안해주세요.
          
          규칙:
          - 정확히 3개의 커밋 메시지만 작성할 것
          - 각 메시지는 새 줄에 번호와 함께 작성 (1., 2., 3.)
          - 영어로 작성
          - 명령형 동사 사용 (Add, Fix, Update 등)
          - 50자 이내로 간결하게
          - conventional commit 형식 사용 (feat, fix, docs, style, refactor, test, chore)
          - 각 메시지 전후에 추가 설명이나 텍스트를 포함하지 말 것 (메시지만 작성)
          
          Git diff:
          ${truncatedDiff}
          
          다음 형식으로만 응답하세요:
          1. <type>: <subject>
          2. <type>: <subject>
          3. <type>: <subject>
          
          어떤 설명도 추가하지 말고 위 형식의 3줄만 응답하세요.`,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json() as { response?: string };
    console.log('LLM 응답:', data);
    
    // 응답에서 커밋 메시지 추출 로직 개선
    const responseText = data?.response || '';
    let suggestions: string[] = [];
    
    // 패턴 1: 숫자+점 형식으로 시작하는 라인 찾기
    const numberedPattern = /^\s*(\d+)\.\s*([a-z]+(\([a-z-]+\))?:.+)$/gm;
    let match;
    const numberedMatches = [];
    
    while ((match = numberedPattern.exec(responseText)) !== null) {
      numberedMatches.push(match[2].trim());
    }
    
    if (numberedMatches.length > 0) {
      suggestions = numberedMatches;
    } else {
      // 패턴 2: 각 줄이 <type>: <subject> 형식인지 확인
      const lines = responseText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const typePattern = /^[a-z]+(\([a-z-]+\))?:.+$/;
      suggestions = lines.filter(line => typePattern.test(line));
    }
    
    // 제안 메시지가 없거나 3개 미만인 경우, 기본 메시지 추가
    if (suggestions.length === 0) {
      // 기본 메시지 제안
      suggestions = [
        'feat: Implement new feature based on changes',
        'fix: Fix issue related to the modified code',
        'chore: Update project dependencies and configuration'
      ];
      vscode.window.showWarningMessage('AI가 적절한 메시지를 생성하지 못했습니다. 기본 메시지를 제공합니다.');
    }
    
    // 최대 3개의 제안으로 제한
    return suggestions.slice(0, 3);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('LLM 요청 타임아웃');
      return ['응답 시간이 너무 오래 걸려 요청이 취소되었습니다.'];
    }
    console.error('LLM 호출 중 오류:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 플러그인 비활성화 시 호출
export function deactivate() {}