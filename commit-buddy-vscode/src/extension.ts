// VS Code API 가져오기
import * as vscode from 'vscode';
// Git 유틸 함수들 가져오기 (저장소 감지, diff 조회, 워크스페이스 경로)
import { isGitRepo, getStagedDiff, getWorkspacePath } from './gitUtils';
import * as path from 'path';
import * as fs from "fs";
import OpenAI from 'openai';
import { createGitHook } from './createGitHook';


// 플러그인 활성화 시 호출
export function activate(context: vscode.ExtensionContext) {
  console.log('"commit-buddy" 플러그인이 활성화되었습니다!');

  // 설정에서 모델 이름 가져오기 (기본값: llama3.2:latest)
  const config = vscode.workspace.getConfiguration('commitBuddy');
  const {provider, modelName, modelKey} = getLLMConfig();
  
  // 백그라운드에서 모델 미리 로드 (활성화 시 모델 준비)
  if(provider === "Ollama") {
    preloadModel(modelName);
  }

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

    // 설정에서 모델 이름 가져오기 (기본값: llama3.2:latest)
    const config = vscode.workspace.getConfiguration('commitBuddy');
    const {provider, modelName, modelKey} = getLLMConfig();

    if(provider === 'Ollama'){
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
    }
   

    try {
      // 로딩 메시지 표시
      const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
      
      var recommendedMessages;

      statusBarItem.text = "$(sync~spin) 커밋 메시지 추천 중...";
      statusBarItem.show();
      
      if(provider === "OpenAI") {
        recommendedMessages = await fetchGPTRecommendation(diff, modelName, modelKey);
      } else {
        recommendedMessages = await fetchOllamaRecommendation(diff, modelName);
      }
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

  // Git Hook 파일 생성 커맨드 등록
  context.subscriptions.push(
    vscode.commands.registerCommand('commit-buddy.createGitHook', createGitHook)
  );

  // 플러그인 설정 등록
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('commitBuddy')) {
        // 설정이 변경되면 모델 다시 로드
        console.log('Commit Buddy 설정이 변경되었습니다.');
        const newModelName = config.get<string>('modelName') || 'llama3.2:latest';
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
    // await vscode.commands.executeCommand('git.commitStagedWithMessage', message);
    const gitExtension = vscode.extensions.getExtension('vscode.git');
    if (!gitExtension) {
      throw new Error('Unable to find the Git extension.');
    }

    const api = gitExtension.exports.getAPI(1);
    if (!api || api.repositories.length === 0) {
      throw new Error('Unable to access the Git repositories.');
    }

    const repository = api.repositories[0];

    repository.inputBox.value = message;
    
    vscode.window.showInformationMessage(`커밋 추천 완료: ${message}`);
  } catch (error) {
    vscode.window.showErrorMessage(`커밋 추천 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// function readConvirc(): string|null {
//   const workspaceFolders = vscode.workspace.workspaceFolders;
  
//   if(!workspaceFolders || workspaceFolders.length === 0) {
//     return null;
//   }

//   const fsPath = workspaceFolders[0].uri.fsPath;
//   const convircPath = path.join(fsPath, ".convirc");
//   if(!fs.existsSync(convircPath)) {
//     vscode.window.showWarningMessage(`.convirc가 없습니다. root 디렉토리에 .convirc를 추가하면, 규칙에 맞게 추천해드립니다.`);
//     return null;
//   }

//   const content = fs.readFileSync(convircPath, 'utf-8');

//   return content;
// }

/**
 * Ollama LLM API 호출 함수
 * @param diff Git diff 문자열
 * @param modelName 사용할 모델 이름
 * @returns 추천 커밋 메시지 배열
 */
async function fetchOllamaRecommendation(diff: string, modelName: string): Promise<string[]> {
  // diff 길이가 너무 길면 짧게 줄이기 (필요 시)
  const truncatedDiff = diff.length > 2000 ? diff.substring(0, 2000) + '...(truncated)' : diff;

  // 타임아웃 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃
  const config = vscode.workspace.getConfiguration('commitBuddy');
  const regex = config.get<string>('regex') || '<type>: <description>';
  const prompt = createPrompt(regex, diff);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
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
    // const numberedPattern = /^\s*(\d+)\.\s*([a-z]+(\([a-z-]+\))?:.+)$/gm;
    // let match;
    // const numberedMatches = [];
    
    // while ((match = numberedPattern.exec(responseText)) !== null) {
    //   numberedMatches.push(match[2].trim());
    // }
    // console.log("numberedMatches", numberedMatches);

    // if (numberedMatches.length > 0) {
    //   suggestions = numberedMatches;
    // } else {
      // 패턴 2: 각 줄이 <type>: <subject> 형식인지 확인
    const lines = responseText.split(/\d\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // const typePattern = /^[a-z]+(\([a-z-]+\))?:.+$/;
    // suggestions = lines.filter(line => typePattern.test(line));
    // }
    lines.splice(0,1);
    suggestions = lines;
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

async function fetchGPTRecommendation(diff: string, modelName: string, modelKey: string): Promise<string[]> {
  const client = new OpenAI({apiKey: modelKey});

  // diff 길이가 너무 길면 짧게 줄이기 (필요 시)
  const truncatedDiff = diff.length > 2000 ? diff.substring(0, 2000) + '...(truncated)' : diff;
  
  // 타임아웃 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃
  const config = vscode.workspace.getConfiguration('commitBuddy');
  const regex = config.get<string>('regex') || '<type>: <description>';
  const prompt = createPrompt(regex, diff);

  try {
    const response = await client.responses.create({
        model: modelName,
        input: prompt,
    });
    
    clearTimeout(timeoutId);
    const data = response;
    console.log('LLM 응답:', data);

    const responseText = response.output_text;
    let suggestions: string[] = [];
    
    const lines = responseText.split(/\d\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    suggestions = lines;
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

type LLMConfig = {
  provider: string,
  modelName: string,
  modelKey: string
}

function getLLMConfig(): LLMConfig {
  const config = vscode.workspace.getConfiguration('commitBuddy');
  const provider = config.get<string>("LLM") || 'Ollama';
  
  var modelName = '';
  var modelKey = '';
  
  if(provider === "OpenAI") {
    modelKey = config.get<string>('openAI.ModelKey') || '';
    if(modelKey.length === 0) {
      vscode.window.showErrorMessage("OpenAI Key값이 비어있습니다.");
    }
    modelName = config.get<string>('openAI.ModelName') || 'gpt-4.1';
  } else{
    modelName = config.get<string>('ollama.ModelName') || 'llama3.2:latest';
  }

  return {provider, modelName, modelKey} ;
}

// 플러그인 비활성화 시 호출
export function deactivate() {}

function createPrompt(convirc: string, diff: string) {
  return `Please suggest 3 good commit messages based on the Git diff below and follow example format.

          Rules:
            - Write exactly 3 commit messages
            - Each message must be on a new line, prefixed with a number (1., 2., 3.)
            - Use imperative mood (e.g., Add, Fix, Update)
            - Keep each message under 50 characters
            - Use the conventional commit format (feat, fix, docs, style, refactor, test, chore)
            - Write in English
            - follow example format below

          Example regex:
            ${convirc}

          Git diff:
            ${diff}`;
}