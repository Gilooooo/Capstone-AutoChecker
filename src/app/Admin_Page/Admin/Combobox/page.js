"use client";
import AdminCombo from "@/_Components/Admin Page/Admin_Combobox";
import AdminAside from "@/_Components/Default fix/Admin_aside";
import Warning from "@/_Components/Default fix/warning";
import Authenticate from "@/app/Authentication";
import { useState } from "react";

function ComboBox(){
    const [clicked, setClicked] = useState(false);

    return (
      <>
        <div className="d-flex">
          <AdminAside clicked={clicked} setClicked={setClicked} />
          <AdminCombo clicked={clicked} setClicked={setClicked} />
        </div>
        <Warning />
      </>
    )
}

export default Authenticate(ComboBox);
