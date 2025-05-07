'use client';

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const SettingsPopupContent = () => {
  const [limitType, setLimitType] = useState(false);
  const [limitScope, setLimitScope] = useState(false);

  const handleApply = () => {
    // TODO: useSignatureStore 같은 global store에 적용
    console.log("Applied settings:", { limitType, limitScope });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox checked={limitType} onCheckedChange={() => setLimitType(!limitType)} />
        <span>Type 제한 두기</span>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox checked={limitScope} onCheckedChange={() => setLimitScope(!limitScope)} />
        <span>Scope 제한 두기</span>
      </div>
      <button
        onClick={handleApply}
        className="px-4 py-2 bg-[#9bd3ce] rounded text-black hover:bg-[#7fbfb4]"
      >
        적용하기
      </button>
    </div>
  );
};

export default SettingsPopupContent;