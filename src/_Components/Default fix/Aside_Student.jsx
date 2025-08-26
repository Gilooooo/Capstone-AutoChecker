"use client";
import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

function Aside_Student({ clicked, setClicked }) {
  const { TUPCID, setTUPCID } = useTUPCID();
  const asideRef = useRef(null);
  const [information, setInfo] = useState([]);
  const path = usePathname();

  const handleclick = () => {
    setClicked(!clicked);
  };
  const handleOutsideClick = (e) => {
    if (clicked && asideRef.current && !asideRef.current.contains(e.target)) {
      setClicked(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [clicked]);

  const fetchAside = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/StudentAside?TUPCID=${TUPCID}`
      );
      response.data.map((info) => {
        setInfo({
          FullName: info.FIRSTNAME + " " + info.MIDDLENAME + " " + info.SURNAME,
          Tupcid: info.TUPCID,
          CourseSection: info.COURSE + "-" + info.YEAR + "-" + info.SECTION,
        });
      });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetching = setInterval(() => {
      fetchAside();
    }, 1000);
    return () => {
      clearInterval(fetching);
    };
  }, [TUPCID]);

  const submitForm = async () => {
    try {
      const data = {
        TUPCID,
        PROFILE: "student",
        STATUS: "OFFLINE",
      };

      const logoutResponse = await axios.post(
        "https://capstone-server-production-ddc7.up.railway.app/studentlogout",
        data
      );

      if (logoutResponse.status === 200) {
      } else {
        console.error("Logout unsuccessful");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      if (err.response && err.response.status === 404) {
        // Handle specific error status code or error response
        console.error(err.response.data.message);
      } else {
        // Handle other errors
        throw err;
      }
    }
  };

  return (
    <>
      <aside className="min-vh-100 custom-red position-relative">
        <div className="h-100 d-sm-flex d-none flex-column justify-content-between align-items-center custom-red py-1 px-2">
          <div>
            <i
              className="bi bi-list fs-3 pe-auto custom-hover"
              onClick={handleclick}
            ></i>
          </div>
          <div className="d-flex flex-column">
            <Link
              href={{ pathname: "/Student/Settings" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Student/Settings" ? (
                <i className="bi bi-gear-fill fs-3"></i>
              ) : (
                <i className="bi bi-gear fs-3 custom-hover"></i>
              )}
            </Link>
            <Link
              href={{ pathname: "/Student/ReportProblem" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Student/ReportProblem" ? (
                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
              ) : (
                <i className="bi bi-exclamation-triangle fs-3 custom-hover"></i>
              )}
            </Link>
            <Link
              href={{ pathname: "/Login" }}
              className="text-decoration-none link-dark"
              onClick={() => setTUPCID("")}
            >
              {" "}
              <i className="bi bi-power fs-3 custom-hover"></i>
            </Link>
          </div>
        </div>
      </aside>
      <aside
        ref={asideRef}
        className={`
        ${
          clicked ? "custom-aside-admin2 px-2" : "custom-aside-admin1"
        } vh-100 position-fixed  custom-red
          `}
      >
        <div className="h-100 d-flex flex-column justify-content-between align-items-center py-1">
          <div className="d-flex align-items-center">
            <img
              src="/TUPC.svg"
              alt="TUPC"
              height={70}
              width={70}
              className="custom-shadow-2"
            />
            <div className="d-flex flex-column custom-black-color ps-2">
              <small className="text-wrap">{information.FullName}</small>
              <small>{information.Tupcid}</small>
              <small>{information.CourseSection}</small>
            </div>
          </div>
          <div className="d-flex flex-column text-light align-self-start custom-black-color">
            <Link
              href={{ pathname: "/Student/Settings" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Student/Settings" ? (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-gear-fill fs-3"></i>
                  <span className="fs-5 fw-bold">SETTINGS</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-gear fs-3"></i>
                  <span className="fs-5">SETTINGS</span>
                </div>
              )}
            </Link>

            <Link
              href={{ pathname: "/Student/ReportProblem" }}
              className="text-decoration-none link-dark"
            >
              {path == "/Student/ReportProblem" ? (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                  <span className="fs-5 fw-bold">REPORT PROBLEM</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-exclamation-triangle fs-3"></i>

                  <span className="fs-5">REPORT PROBLEM</span>
                </div>
              )}
            </Link>
            <Link
              href={{ pathname: "/Login" }}
              className="text-decoration-none link-dark"
              onClick={() => setTUPCID("")}
            >
              <div className="d-flex align-items-center gap-1 custom-hover">
                <i className="bi bi-power fs-3"></i>
                <span className="fs-5" onClick={submitForm}>
                  LOGOUT
                </span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Aside_Student;
