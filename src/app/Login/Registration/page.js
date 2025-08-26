"use client";
import Footer from "@/_Components/Default fix/Footer";
import Header from "@/_Components/Default fix/Header";
import FacultyRegistration from "@/_Components/Register/FacultyRegistration";
import OptionPosition from "@/_Components/Register/OptionPosition";
import StudentRegistration from "@/_Components/Register/StudentRegistration";
import { useState } from "react";
function RegisterPage() {
  const [position, setPosition] = useState("");

  const studentposition = () => {
    setPosition("STUDENT");
  };
  const facultyposition = () => {
    setPosition("FACULTY");
  };
  return (
    <>
      <Header />
      <div>
        {position == "STUDENT" ? (
          <StudentRegistration />
        ) : position == "FACULTY" ? (
          <FacultyRegistration />
        ) : (
          <OptionPosition student={studentposition} faculty={facultyposition} />
        )}
      </div>
      <Footer />
    </>
  );
}
export default RegisterPage;
