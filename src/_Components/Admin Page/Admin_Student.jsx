"use client";
import axios from "axios";
import { useEffect, useState } from "react";

function Admin_Student({ clicked, setClicked }) {
  const [student, setStudent] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchStudent = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Admin_Students");
      setStudent(response.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      fetchStudent();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, []);

  const handleclick = () => {
    setClicked(!clicked);
  };
  const newStudentList = student.filter((lists) =>
    lists.FIRSTNAME.toLowerCase().includes(searchValue.toLowerCase())
  );


  const generatestudentlist = async () => {
    try {
      const response = await axios.get('https://capstone-server-production-ddc7.up.railway.app/generatestudentlistlog', {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.setAttribute('download', 'STUDENTLIST_AUDITLOG.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('Student list audit log Excel file download initiated');
      } else {
        console.error('Failed to initiate Student list audit log Excel file download');
      }
    } catch (error) {
      console.error('Error while initiating Student list audit log Excel file download:', error);
    }
  };


  return (
    <main className="w-100 p-0 vh-100 align-items-start">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex w-100 align-items-center ">
          <div className="border-bottom border-dark py-1 ps-sm-0 ps-3">
            <i
              className="d-block d-sm-none bi bi-list fs-5 custom-red px-2 rounded "
              onClick={handleclick}
            ></i>
          </div>
          <h2 className="px-2 w-100 border-bottom border-dark py-1 m-0 pe-sm-0 pe-3">
            STUDENT
          </h2>
        </div>
        <div className="d-flex gap-2 justify-content-end align-items-center px-sm-5 px-xl-2 px-2 w-100 mt-2">
          <div className="d-flex">
            <input
              type="text"
              placeholder="FirstName Search"
              className="px-3 py-1 rounded border border-dark"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="btn btn-dark" onClick={generatestudentlist}>AUDIT LOG</button>
          </div>
        </div>
        <section className="container-fluid col-12">
          <div className="row p-0 pt-2">
            <div className="col-12 rounded pe-1 table-responsive">
              <table className="table-secondary table table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">ACCOUNT NO.</th>
                    <th scope="col">FIRSTNAME</th>
                    <th scope="col"> MIDDLENAME</th>
                    <th scope="col"> SURNAME</th>
                    <th scope="col"> COURSE, SECTION & YEAR</th>
                    <th scope="col"> GSFE ACCOUNT</th>
                    <th scope="col"> REGISTERED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {newStudentList.slice(0, 6).map((students, index) => (
                    <tr key={index}>
                      <td scope="col">{students.TUPCID}</td>
                      <td scope="col">{students.FIRSTNAME}</td>
                      <td scope="col"> {students.MIDDLENAME}</td>
                      <td scope="col"> {students.SURNAME}</td>
                      <td scope="col">
                        {" "}
                        {students.COURSE}-{students.SECTION}-{students.YEAR}
                      </td>
                      <td scope="col"> {students.GSFEACC}</td>
                      <td scope="col"> {students.REGISTEREDDATE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
export default Admin_Student;
