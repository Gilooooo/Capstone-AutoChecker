"use client";

import AdminAside from "@/_Components/Default fix/Admin_aside";
import Warning from "@/_Components/Default fix/warning";
import AdminReport from "@/_Components/Report Problem/AdminReportProblem";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function AdminReportProblem() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div className="d-flex">
        <AdminAside clicked={clicked} setClicked={setClicked} />
        <AdminReport clicked={clicked} setClicked={setClicked} />
      </div>
      <Warning/>
    </>
  );
}
export default Authenticate(AdminReportProblem);
