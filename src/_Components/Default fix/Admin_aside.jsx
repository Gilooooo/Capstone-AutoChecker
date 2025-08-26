"use client";
import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

function AdminAside({ clicked, setClicked }) {
  const path = usePathname();
  const { setTUPCID, TUPCID } = useTUPCID();
  const [information, setInformation] = useState([]);
  const asideRef = useRef(null);
  const params = useSearchParams();
  const UserName = params.get("Username");
  const handleclick = () => {
    setClicked(!clicked);
  };

  const fetchingAdmin = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/AdminAside?Uid_Account=${TUPCID}`
      );
      setInformation(response.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOutsideClick = (e) => {
    if (clicked && asideRef.current && !asideRef.current.contains(e.target)) {
      setClicked(false);
    }
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      fetchingAdmin();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, [TUPCID]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [clicked]);
  return (
    <>
      <aside className="min-vh-100 custom-red position-relative">
        <div className="h-100 d-sm-flex d-none flex-column justify-content-between align-items-center custom-red py-2 px-2">
          <div className="pb-5 pt-1">
            <i
              className="bi bi-list fs-3 pe-auto custom-hover"
              onClick={handleclick}
            ></i>
          </div>
          <div className="d-flex flex-column h-50 justify-content-center gap-2 border-top border-bottom border-danger ">
            <Link
              href={{ pathname: "/Admin_Page/Admin" }}
              className="link-dark text-decoration-none"
            >
              {path == "/Admin_Page/Admin" ? (
                <i className="bi bi-house-fill fs-3"></i>
              ) : (
                <i className="bi bi-house fs-3 custom-hover"></i>
              )}
            </Link>
            <Link
              href={{
                pathname: "/Admin_Page/Student_Page",
              }}
              className="link-dark text-decoration-none"
            >
              {path == "/Admin_Page/Student_Page" ? (
                <i className="bi bi-person-fill fs-3"></i>
              ) : (
                <i className="bi bi-person fs-3 custom-hover"></i>
              )}
            </Link>
            <Link
              href={{ pathname: "/Admin_Page/Faculty_Page" }}
              className="link-dark text-decoration-none"
            >
              <i className="bi bi-journals fs-3 custom-hover"></i>
            </Link>
          </div>
          <div className="d-flex flex-column gap-2">
            <Link
              href={{ pathname: "/Admin_Page/Admin/Combobox" }}
              className="link-dark text-decoration-none"
            >
              <i className="bi bi-arrow-bar-down fs-3"></i>
            </Link>
            <Link
              href={{ pathname: "/Admin_Page/ReportProblem" }}
              className="link-dark text-decoration-none"
            >
              <i className="bi bi-exclamation-triangle fs-3 custom-hover"></i>
            </Link>
            <Link
              href={{ pathname: "/Login" }}
              className="text-decoration-none link-dark"
              onClick={() => setTUPCID("")}
            >
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
        <div className="h-100 d-flex flex-column justify-content-between align-items-center py-2">
          <div className="d-flex flex-column text-center">
            <h5 className="m-0 text-wrap pb-5">{information.Username}</h5>
          </div>
          <div className="d-flex flex-column justify-content-center align-self-start gap-2 h-50 border-top border-bottom border-dark w-100">
            <Link
              className="text-decoration-none link-dark"
              href={{
                pathname: "/Admin_Page/Admin",
              }}
            >
              {path == "/Admin_Page/Admin" ? (
                <div className="d-flex align-items-center gap-1">
                  <i className="bi bi-house-fill fs-3"></i>
                  <span className="fs-5 fw-bold">DASHBOARD</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-house fs-3"></i>
                  <span className="fs-5">DASHBOARD</span>
                </div>
              )}
            </Link>

            <Link
              className="text-decoration-none link-dark "
              href={{
                pathname: "/Admin_Page/Student_Page",
              }}
            >
              {path == "/Admin_Page/Student_Page" ? (
                <div className="d-flex align-items-center gap-1 ">
                  <i className="bi bi-person-fill fs-3"></i>
                  <span className="fs-5 fw-bold">STUDENTS</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-person fs-3"></i>
                  <span className="fs-5">STUDENTS</span>
                </div>
              )}
            </Link>
            <Link
              className="text-decoration-none link-dark"
              href={{
                pathname: "/Admin_Page/Faculty_Page",
              }}
            >
              {path == "/Admin_Page/Faculty_Page" ? (
                <div className="d-flex align-items-center gap-1 ">
                  <i className="bi bi-journals fs-3"></i>
                  <span className="fs-5 fw-bold">FACULTY</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1 custom-hover">
                  <i className="bi bi-journals fs-3"></i>
                  <span className="fs-5">FACULTY</span>
                </div>
              )}
            </Link>
          </div>
          <div className="d-flex flex-column custom-black-color align-self-start gap-2">
            <Link
              href={{ pathname: "/Admin_Page/Admin/Combobox" }}
              className="link-dark text-decoration-none"
            >
              <div className="d-flex align-items-center gap-1 custom-hover">
                <i className="bi bi-arrow-bar-down fs-3"></i>
                <span className="fs-5">COMBO BOX</span>
              </div>
            </Link>
            <Link
              href={{ pathname: "/Admin_Page/ReportProblem" }}
              className="link-dark text-decoration-none"
            >
              <div className="d-flex align-items-center gap-1 custom-hover">
                <i className="bi bi-exclamation-triangle fs-3"></i>
                <span className="fs-5">REPORT PROBLEM</span>
              </div>
            </Link>
            <Link
              href={{ pathname: "/Login" }}
              className="text-decoration-none link-dark"
              onClick={() => setTUPCID("")}
            >
              <div className="d-flex align-items-center gap-1 custom-hover">
                <i className="bi bi-power fs-3"></i>
                <span className="fs-5">LOGOUT</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
export default AdminAside;
