"use client";
import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import Warning from "@/_Components/Default fix/warning";
import Records from "@/_Components/TestPaper/Records";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function RecordsPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Faculty clicked={clicked} setClicked={setClicked} />
        <Records />
      </div>
      <Warning />
    </>
  );
}
export default Authenticate(RecordsPage);
