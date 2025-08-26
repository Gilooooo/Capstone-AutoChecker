"use client"
import Aside_Student from "@/_Components/Default fix/Aside_Student";
import StudentSettings from "@/_Components/Settings/Student_Settings";
import Authenticate from "@/app/Authentication";
import { useState } from "react";
function StudentsSettingsPage() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <Aside_Student setClicked={setClicked} clicked={clicked}/>
        <StudentSettings setClicked={setClicked} clicked={clicked}/>
      </div>
    </>
  );
}
export default Authenticate(StudentsSettingsPage);
