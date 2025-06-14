'use client';

import CommitSignatures from "@/features/lint-buddy/customizing/board/CommitSignatures_temp";
import CommitSignatureButton from "@/features/lint-buddy/customizing/board/CommitSignatureButton";
import { useDrop } from "react-dnd";
import CommitSignatureType from "@/features/lint-buddy/customizing/board/CommitSignatureType";
import CommitSignatureSampleButton from "@/features/lint-buddy/customizing/board/CommitSignatureSampleButton";
import { useSignatureStore } from "@/store/lintBuddy/signature-store";
import { Button } from "@/components/ui/button";
import CommitHookDownloader from "@/features/lint-buddy/customizing/board/githooksDownloader/CommitHookDownloader";
import PopupModal from "@/features/lint-buddy/customizing/popup/PopupModal";
import TestingPopupContent from "@/features/lint-buddy/customizing/popup/TestingPopupContent";
import SettingsPopupContent from "@/features/lint-buddy/customizing/popup/SettingsPopupCentent";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CommitRegexCopyButton from "@/features/lint-buddy/customizing/board/CommitRegexCopyButton";
import {useTour} from "@reactour/tour";

const ConventionCustomizeBoard = () => {
  const {isOpen, setIsOpen} = useTour()
  const { signatureList, addSignature, removeAll } = useSignatureStore();
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const combinedRegexPattern = signatureList.map(item => item.regex).join("");
  const combinedRegexExample = signatureList.map(item => item.sample).join("");
  const [, drop] = useDrop({
    accept: 'signature',
    drop: (item: CommitSignatureType, monitor) => {
      if (monitor.didDrop()) return;
      addSignature(signatureList.length, item);
    },
  });

  return (
<div className="flex flex-col w-full h-full overflow-x-hidden .second-step step-5">
  <div className="w-full h-2/5 overflow-y-auto space-y-4 p-2" id={'step-1'}>
    {Object.entries(CommitSignatures).map(([category, list]) => (
      <div key={category} className="space-y-2">
        <div className="flex items-center justify-between min-w-0">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {category}
          </h3>
          <Separator className="flex-grow ml-2 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2 min-w-0">
          {list.map((item, key) => {
            return <CommitSignatureButton
              key={`${category}-${key}`}
              name={item.name}
              sample={item.sample}
              tooltip={item.tooltip}
              regex={item.regex}/>
            })}
        </div>
      </div>
    ))}
  </div>
      <div
        className="border-1 border-r-0 border-gray-200 w-full h-3/5 p-3 step-3 step-6"
        id={'step-2'}
        ref={(node) => { drop(node); }}
      >
        {signatureList.length === 0 &&
          <p className={"text-gray-300 font-bold"}>
            위 버튼을 클릭하거나 여기로 드래그하면, 미리보기가 보입니다.
          </p>
        }
        {signatureList.flatMap((item, key) =>
          item.name === "blank line" ?
            [<CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key} />, <br key={"br-" + key} />]
            :
            item.name === "body no -" || item.name === "body -" ?
              [<br key={"br-" + key} />, <CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key} />]
              :
              <CommitSignatureSampleButton key={key} name={item.name} sample={item.sample} k={key} />
        )}
      </div>

      <div className="flex flex-row justify-between border-t-1 border-l-1 border-gray-200 w-full px-1">
        <div className="flex flex-row">
          {/*<Button*/}
          {/*  className={"mx-1 border-1 text-black bg-white border-[#9bd3ce] hover:bg-[#9bd3ce] my-1"}*/}
          {/*  onClick={() => setIsSettingsOpen(true)}*/}
          {/*>*/}
          {/*  설정*/}
          {/*</Button>*/}
          <Button
            className={"mx-1 border-1 text-black bg-white border-[#9bd3ce] hover:bg-[#9bd3ce] my-1"}
            onClick={() => setIsTestOpen(true)}
          >
            린트 테스트
          </Button>
          <Button
            className={"m-1"}
            onClick={() => setIsOpen(true)}>도움말</Button>
        </div>
        <div className="flex flex-row place-items-center">
          <Button className={"mx-1 border-1 text-black bg-white border-[#9bd3ce] hover:bg-[#9bd3ce] my-1"} onClick={() => removeAll()}> 모두 지우기 </Button>
          <CommitRegexCopyButton disable={signatureList.length === 0} text={"정규식 복사하기"} />
          <CommitHookDownloader disable={signatureList.length === 0} text={"다운로드"} />
        </div>
      </div>

        {/* Test Modal */}
        <PopupModal
            title="정규식 테스트"
            description="아래 예제들을 넣고, 정규식이 잘 매칭되는지 확인해보세요."
            open={isTestOpen}
            onOpenChange={setIsTestOpen}
            >
        <TestingPopupContent regexPattern={combinedRegexPattern} regexExample ={combinedRegexExample}/>
        </PopupModal>

        <PopupModal
        title="Settings Popup"
        description="type과 scope 제한을 설정합니다."
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        >
        <SettingsPopupContent />
        </PopupModal>
    </div>
  );
};

export default ConventionCustomizeBoard