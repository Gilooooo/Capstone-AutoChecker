"use client";
import Aside_Student from "@/_Components/Default fix/Aside_Student";
import StudentTestList from "@/_Components/Student/StudentTestList";
import { useState } from "react";
import Authenticate from "../Authentication";
function StudentPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Student clicked={clicked} setClicked={setClicked} />
        <StudentTestList clicked={clicked} setClicked={setClicked} />
      </div>
    </>
  );
}
export default Authenticate(StudentPage);
