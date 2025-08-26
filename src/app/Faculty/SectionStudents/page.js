"use client";
import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import StudentsList from "@/_Components/Faculty/StudentsList";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function SectionStudents(){
    const [clicked, setClicked] = useState(false);
    return(
        <>
        <div className="d-flex">
            <Aside_Faculty clicked={clicked} setClicked={setClicked}/>
            <StudentsList setClicked={setClicked} clicked={clicked}/>
        </div>
        </>
    )
};
export default Authenticate(SectionStudents);
