"use client";

import Aside_Faculty from "@/_Components/Default fix/Aside_Faculty";
import Warning from "@/_Components/Default fix/warning";
import Authenticate from "@/app/Authentication";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTUPCID } from "@/app/Provider";
import QA from "@/_Components/TestPaper/TestPaper";
import OptionTest from "@/_Components/TestPaper/OptionTest";
import Premade from "@/_Components/TestPaper/Premade";

function DashboardPage() {
  const [clicked, setClicked] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const { TUPCID } = useTUPCID();
  const searchparams = useSearchParams();
  const testname = searchparams.get("testname");
  const sectionname = searchparams.get("sectionname");
  const uid = searchparams.get("uid");
  const subject = searchparams.get("subject");
  const semester = searchparams.get("semester");
  const [errorMessage, setErrorMessage] = useState("");
  const [optionTest, setOptionTest] = useState("");

  const localStorageKey = `optionTest_${TUPCID}_${sectionname}_${uid}`
  const setPremade = () => {
    setOptionTest("Premade");
    localStorage.setItem(localStorageKey, "Premade")
  };
  const setManual = () => {
    setOptionTest("Manual");
    localStorage.setItem(localStorageKey, "Manual")
  };
  const setBack = () => {
    setOptionTest("");
    localStorage.removeItem(localStorageKey) 
  }
  useEffect(() => {
    setOptionTest(localStorage.getItem(localStorageKey))
  },[])

  return (
    <>
      <div className="d-flex">
        <Aside_Faculty clicked={clicked} setClicked={setClicked} />
        <main className="position-relative w-100 min-vh-100 overflow-hidden p-2">
          <section>
            <div className="d-flex align-items-center">
              <Link href="/Faculty/ListOfTest">
                <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
              </Link>
              &nbsp;
              <h3 className="m-0">
                {sectionname}: {subject} - {semester}: {testname} UID: {uid}
              </h3>
            </div>
            <ul className="d-flex flex-wrap justify-content-around mt-3 list-unstyled">
              <li className="m-0 fs-5 text-decoration-underline">TEST PAPER</li>
              <Link
                href={{
                  pathname: "/Faculty/Test/AnswerSheet",
                  query: {
                    testname: testname,
                    uid: uid,
                    sectionname: sectionname,
                    semester: semester,
                    subject: subject,
                  },
                }}
                className="text-decoration-none link-dark"
              >
                <li className="m-0 fs-5">ANSWER SHEET</li>
              </Link>
              <Link
                href={{
                  pathname: "/Faculty/Test/AnswerKey",
                  query: {
                    testname: testname,
                    uid: uid,
                    sectionname: sectionname,
                    semester: semester,
                    subject: subject,
                  },
                }}
                className="text-decoration-none link-dark"
              >
                <li className="m-0 fs-5">ANSWER KEY</li>
              </Link>
              <Link
                href={{
                  pathname: "/Faculty/Test/Records",
                  query: {
                    testname: testname,
                    uid: uid,
                    sectionname: sectionname,
                    semester: semester,
                    subject: subject,
                  },
                }}
                className="text-decoration-none link-dark"
              >
                <li className="m-0 fs-5">RECORDS</li>
              </Link>
            </ul>
            <div className="position-relative">
            {optionTest == "Manual" ? (
              <QA setBack={setBack} />
            ) : optionTest == "Premade" ? (
              <Premade setBack={setBack}/>
            ) : (
              <OptionTest setManual={setManual} setPremade={setPremade}/>
            )}
            </div>
            {errorMessage && <div className="text-danger">{errorMessage}</div>}
          </section>
        </main>
      </div>
      <Warning />
    </>
  );
}

export default Authenticate(DashboardPage);
