import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTUPCID } from "@/app/Provider";
import ClipboardJS from "clipboard";

function StudentsList({ clicked, setClicked }) {
  const { TUPCID } = useTUPCID();
  const [copyClick, setCopyClick] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const params = useSearchParams();
  const Uid_Section = params.get("Uid_Section");
  const Section = params.get("Section");
  const [warning, setWarning] = useState(false)

  const firstName = () => {
    const sortedList = [...students].sort((a, b) =>
      a.Student_FirstName.localeCompare(b.Student_FirstName)
    );
    setStudents(sortedList);
  };

  const surName = () => {
    const sortedList = [...students].sort((a, b) =>
      a.Student_LastName.localeCompare(b.Student_LastName)
    );
    setStudents(sortedList);
  };

  const AZName = () => {
    const sortedList = [...students].sort((a, b) =>
      a.Student_FirstName.localeCompare(b.Student_FirstName)
    );
    setStudents(sortedList);
  };

  const ZAName = () => {
    const sortedList = [...students].sort((a, b) =>
      b.Student_FirstName.localeCompare(a.Student_FirstName)
    );
    setStudents(sortedList);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/Faculty_StudentList?Uid_Section=${Uid_Section}&Section=${Section}`
      );
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const changings = setInterval(() => {
      setCopyClick(false);
    }, 2000);
    return () => {
      clearInterval(changings);
    };
  }, [copyClick]);

  useEffect(() => {
    fetchStudents();
  }, [TUPCID]);

  const handleclick = () => {
    setClicked(!clicked);
  };

  const checkChange = (e) => {
    const studentTUPCID = e.target.value;
    if (selectedStudents.includes(studentTUPCID)) {
      setSelectedStudents(
        selectedStudents.filter((item) => item !== studentTUPCID)
      );
    } else {
      setSelectedStudents([...selectedStudents, studentTUPCID]);
    }
  };

  const handleRemove = async () => {
    const data = {
      selected: selectedStudents,
    };
    
    try {
      const response = await axios.delete(
        `http://localhost:3001/Faculty_Students?Uid_Section=${Uid_Section}&Professor_Uid=${TUPCID}&Section=${Section}`,
        { data }
      );
      if(response.status == 200){
        setWarning(!warning)
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copy = (e) => {
    setCopyClick(!copyClick);
    ClipboardJS.copy(e)
  };

  const checkAll = () => {
    const allStudentTUPCIDs = students.map((student) => student.Student_TUPCID);
    setSelectedStudents(allStudentTUPCIDs);
  };

  const uncheckAll = () => {
    setSelectedStudents([]);
  };

  return (
    <main className="w-100 min-vh-100 d-flex justify-content-center">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-start p-2">
        <div className="d-flex gap-2 align-items-center mb-3 w-100">
          <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
          <Link className="d-none d-sm-block" href={{ pathname: "/Faculty" }}>
            <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
          </Link>
          <h2 className="m-0 w-100 text-sm-start text-center pe-3">
            {Section}
          </h2>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100 px-1">
          <span className="m-0 border border-dark px-2 py-1 rounded fs-4">
            <span className="pe-2">{Uid_Section}</span>
            {copyClick ? (
              <i className="bi bi-check px-2 border-start border-secondary"></i>
            ) : (
              <i
                className="bi bi-copy px-2 border-start border-secondary"
                onClick={() => copy(Uid_Section)}
              ></i>
            )}
          </span>
          <div className="d-flex flex-column align-self-end">
            <small className="text-end">Sort by:</small>
            <div className="d-md-flex d-none gap-md-2 gap-1 align-self-end">
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={firstName}
              >
                FIRSTNAME
              </button>
              <button className="btn btn-outline-dark btn-sm" onClick={surName}>
                SURNAME
              </button>
              <button className="btn btn-outline-dark btn-sm" onClick={AZName}>
                A-Z
              </button>
              <button className="btn btn-outline-dark btn-sm" onClick={ZAName}>
                Z-A
              </button>
            </div>
            <div
              className={
                selectedStudents.length > 0
                  ? "d-md-flex d-none gap-md-2 gap-1 align-self-end mt-2"
                  : "d-none"
              }
            >
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={() => setWarning(!warning)}
              >
                REMOVE
              </button>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={checkAll}
              >
                CHECK ALL
              </button>
              <button
                className="btn btn-outline-dark btn-sm"
                onClick={uncheckAll}
              >
                UNCHECK ALL
              </button>
            </div>
          </div>
        </div>
        {students.map((items, index) => (
          <div className="row m-0 mt-2 col-12" key={index}>
            <div className="d-flex gap-2 px-1">
              <div className="border border-dark rounded px-2 py-1 w-100">
                <span>
                  {items.Student_TUPCID}, {items.Student_FirstName}{" "}
                  {items.Student_MiddleName} {items.Student_LastName}
                </span>
              </div>
              <input
                type="checkbox"
                value={items.Student_TUPCID}
                onChange={checkChange}
                checked={selectedStudents.includes(items.Student_TUPCID)}
              />
            </div>
          </div>
        ))}
        {/* Modal */}
        {warning && (
          <div className="d-block modal bg-secondary" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Warning</h5>
                </div>
                <div className="modal-body">
                  <p className="text-center">
                  The selected student/s will be remove in your class. Do you want to continue?
                  </p>
                </div>
                <div className="modal-footer align-self-center">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => setWarning(!warning)}
                  >
                    Cancel
                  </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={handleRemove}
                    >
                      Ok
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* end modal */}
      </section>
    </main>
  );
}

export default StudentsList;