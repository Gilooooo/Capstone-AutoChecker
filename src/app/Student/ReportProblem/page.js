"use client";
import Aside_Student from "@/_Components/Default fix/Aside_Student";
import StudentReportProblem from "@/_Components/Report Problem/StudentReportProblem";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function StudentReportProblemPage() {
    const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Student clicked={clicked} setClicked={setClicked}/>
        <StudentReportProblem clicked={clicked} setClicked={setClicked}/>
      </div>
    </>
  );
}
export default Authenticate(StudentReportProblemPage);
