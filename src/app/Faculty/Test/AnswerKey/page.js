"use client";
import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import Warning from "@/_Components/Default fix/warning";
import AnswerKey from "@/_Components/TestPaper/AnswerKey";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function AnswerSheetPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Faculty clicked={clicked} setClicked={setClicked} />
        <AnswerKey />
      </div>
      <Warning />
    </>
  );
}
export default Authenticate(AnswerSheetPage);
