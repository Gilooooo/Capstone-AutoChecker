"use client";
import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import ListOfTest from "@/_Components/Faculty/ListofTest";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function ListOfTestPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Faculty clicked={clicked} setClicked={setClicked}/>
        <ListOfTest clicked={clicked} setClicked={setClicked}/>
      </div>
    </>
  );
}
export default Authenticate(ListOfTestPage);
