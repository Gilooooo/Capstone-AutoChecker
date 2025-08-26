"use client"
import Admin_Student from "@/_Components/Admin Page/Admin_Student";
import AdminAside from "@/_Components/Default fix/Admin_aside";
import Warning from "@/_Components/Default fix/warning";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function Student_Page(){
    const [clicked, setClicked] = useState(false);
    return(
        <>
            <div className="d-flex">
                <AdminAside clicked={clicked} setClicked={setClicked}/>
                <Admin_Student clicked={clicked} setClicked={setClicked}/>
            </div>
            <Warning/>
        </>
    )
};
export default Authenticate(Student_Page);
