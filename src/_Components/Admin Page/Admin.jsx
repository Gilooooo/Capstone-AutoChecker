"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function AdminDashboard({ clicked, setClicked }) {
  const [facultiesOnline, setFaculties] = useState([]);
  const [studentsOnline, setStudents] = useState([]);
  const [login, setlogin] = useState([]);
  const [apiKey, setApiKey] = useState([]);
  const [changings, setChanging] = useState(false);
  const [apiChange, setApiChange] = useState("");

  const handleclick = () => {
    setClicked(!clicked);
  };

  const fetchData = async () => {
    try {
      const facultiesResponse = await axios.get(
        "https://capstone-server-production-ddc7.up.railway.app/getfacultyrecords"
      );
      setFaculties(facultiesResponse.data.reverse()); // Reverse faculty records

      const studentsResponse = await axios.get(
        "https://capstone-server-production-ddc7.up.railway.app/getstudentrecords"
      );
      setStudents(studentsResponse.data.reverse()); // Reverse student records

      const loginResponse = await axios.get("https://capstone-server-production-ddc7.up.railway.app/getlogin");
      setlogin(loginResponse.data.reverse()); // Reverse login records

      const apiresponse = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Getting");
      setApiKey(apiresponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const ChangedApi = async() => {
    try {
      const response = await axios.post("https://capstone-server-production-ddc7.up.railway.app/Change", {secret : apiChange});
      if(response.status === 200){
        setChanging(false)
        fetchData();
      }
    } catch (error) {
      console.error(error)
    }  
  }

  const generateloginaudit = async () => {
    try {
      const response = await axios.get(
        "https://capstone-server-production-ddc7.up.railway.app/generateloginaudit",
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute("download", "LOGIN AND LOGOUT_AUDITLOG.xlsx");
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log("Student list audit log Excel file download initiated");
      } else {
        console.error(
          "Failed to initiate Student list audit log Excel file download"
        );
      }
    } catch (error) {
      console.error(
        "Error while initiating Student list audit log Excel file download:",
        error
      );
    }
  };

  return (
    <main
      className="p-0 
    Min-vh-100  w-100 position-relative"
    >
      <section className="contatiner col-12 text-start  d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex w-100 align-items-center">
          <div className="border-bottom border-dark py-1 ps-sm-0 ps-3">
            <i
              className="d-block d-sm-none bi bi-list fs-5 custom-red px-2 rounded "
              onClick={handleclick}
            ></i>
          </div>
          <h2 className="px-2 w-100 border-bottom border-dark py-1 m-0 pe-sm-0 pe-3 text-center text-sm-start">
            ADMIN DASHBOARD
          </h2>
        </div>
        <section className="container-fluid col-12">
          <div className="row p-0 mt-2">
            <div className="col-12">
              <h2>WELCOME!</h2>
            </div>
            <div className="col-6 d-flex flex-column gap-3 align-self-center ps-1 mb-2 h-100">
              <h3>Api Key</h3>
              <div className="col-6">
                <input
                  type="text"
                  {...(changings ? { value: apiChange.slice(-3).padStart(apiChange.length, "*") } : { value: apiKey })}
                  className="form-control mb-2"
                  onChange={(e) => setApiChange(e.target.value)}
                  disabled={!changings}
                  placeholder={apiKey}
                />

                {changings ? (
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-success" onClick={ChangedApi}>Save</button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setChanging(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setChanging(true)}
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            <div className="col-6 rounded ps-3 p-0 table-responsive custom-table-h">
              <span className="d-flex justify-content-between align-items-center bg-secondary rounded py-1 px-3 ">
                RECENTLY REGISTERED
                <Link href="/Admin_Page/Student_Page">
                  <button className="btn btn-outline-light btn-sm border-secondary custom-black-color">
                    GO TO STUDENT
                  </button>
                </Link>
              </span>

              <table className="table-secondary table table-bordered border-secondary overflow-auto">
                <thead>
                  <tr>
                    <th scope="col">STUDENT ID</th>
                    <th scope="col">GSFE ACCOUNT</th>
                    <th scope="col">ACCOUNT TYPE</th>
                    <th scope="col">REGISTERED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsOnline.slice(0, 3).map((student, index) => (
                    <tr key={index}>
                      <td>{student.TUPCID}</td>
                      <td>{student.GSFEACC}</td>
                      <td>STUDENT</td>
                      <td>{student.REGISTEREDDATE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-6 ps-1 table-responsive custom-table-h">
              <span className="d-flex justify-content-between align-items-center bg-secondary rounded py-2 px-3">
                RECENTLY LOGGED IN/OUT
              </span>
              <table className="table table-secondary table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">ID ACCOUNT</th>
                    <th scope="col">LOGIN TIME</th>
                    <th scope="col">LOGOUT TIME</th>
                    <th scope="col">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {login.slice(0, 10).map((log, index) => (
                    <tr key={index}>
                      <td>{log.TUPCID}</td>
                      <td>{log.loginTime}</td>
                      <td>{log.logoutTime}</td>
                      <td>{log.loginDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-6 p-0 ps-3 custom-table-h overflow-auto">
              <span className="d-flex justify-content-between align-items-center bg-secondary rounded py-1 px-3">
                RECENTLY REGISTERED
                <Link href="/Admin_Page/Faculty_Page">
                  <button className="btn btn-outline-light btn-sm border-secondary custom-black-color">
                    GO TO FACULTY
                  </button>
                </Link>
              </span>
              <table className="table-secondary table table-bordered border-secondary overflow-auto">
                <thead>
                  <tr>
                    <th scope="col">PROFESSOR ID</th>
                    <th scope="col">GSFE ACCOUNT</th>
                    <th scope="col">ACCOUNT TYPE</th>
                    <th scope="col">REGISTERED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {facultiesOnline.slice(0, 3).map((faculty, index) => (
                    <tr key={index}>
                      <td>{faculty.TUPCID}</td>
                      <td>{faculty.GSFEACC}</td>
                      <td>FACULTY</td>
                      <td>{faculty.REGISTEREDDATE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <section className="position-fixed bottom-0 end-0 mb-3 me-3 text-end">
            <button
              className="btn btn-dark btn-lg"
              onClick={generateloginaudit}
            >
              Download Login and Out Audit
            </button>
          </section>
        </section>
      </section>
    </main>
  );
}
export default AdminDashboard;
