"use client";
import Aside_Student from "@/_Components/Default fix/Aside_Student";
import StudentResult from "@/_Components/Student/StudentResult";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function ResultPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Student clicked={clicked} setClicked={setClicked} />
        <StudentResult clicked={clicked} setClicked={setClicked} />
      </div>
    </>
  );
}
export default Authenticate(ResultPage);
