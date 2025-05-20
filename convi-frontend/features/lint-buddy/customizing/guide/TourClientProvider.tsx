"use client";

import {StepType, TourProvider} from "@reactour/tour";
import { ReactNode } from "react";

const steps : StepType[] = [
    {
        selector: "#intro",
        content: "반갑습니다. Lint-Buddy를 처음 써보시는 군요. 친절히 안내해드릴게요",
    },
    {
        selector: "#step-1",
        content: "여기 영역에는 commit Message를 이루는 다양한 요소들이 있어요.",
    },
    {
        selector: "#step-2",
        content: "여기는 위 커밋 요소로 Commit Message 규칙을 만드는 곳이에요.",
    },
    {
        selector: ".step-3",
        content: "컨벤션 규칙에 맞는 실제 커밋 메시지 예시를 볼 수 있어요.",
    },
    {
        selector: "#step-4",
        content: "여기는 자주 쓰이는 컨벤션들을 미리 만들어서 제공합니다.",
    },
    {
        selector: ".step-5",
        position: [100, 100],
        content: (
          <div className="flex flex-col items-center text-center">
              <p className="mb-2 font-semibold">위 Core 하위 Type을 클릭 혹은 아래로 드래그 해보세요.</p>
              <img
                src="/tutorial/toturial.gif" //
                alt="드래그 예시"
                className="w-64 h-auto rounded shadow"
              />
          </div>
        ),
    },
    {
        selector: ".step-6",
        content: (
          <div className="flex flex-col items-center text-center">
              <p className="mb-2 font-semibold">여기 표시된 요소들은 클릭해서 제거할 수 있으며, 드래그로 이동할 수 있어요.</p>
              <img
                src="/tutorial/toturial2.gif" //
                alt="드래그 예시"
                className="w-64 h-auto rounded shadow"
              />
          </div>
        ),
    },
    {
        selector: "#step-7",
        content: "컨벤션에 대한 정규식을 바로 복사할 수 있어요.",
    },
    {
        selector: "#step-8",
        content: ".git 디렉토리와 .convirc 파일을 다운로드 받을 수 있어요. ",
    },
    {
        selector: "#step-8",
        content: "다운로드한 파일을 압축해제 후, 프로젝트 디렉토리에 옮겨주시면 바로 사용할 수 있어요.",
    },
    {
        selector: ".outro",
        content: "고생하셨습니다! 이제 자유롭게 Lint-Buddy를 이용해주세요!",
    },
];

export default function TourClientProvider({ children }: { children: ReactNode }) {
    return (
        <TourProvider steps={steps} startAt={0}>
            {children}
        </TourProvider>
    );
}