import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

function Admin_Faculty({ clicked, setClicked }) {
  const [faculty, setFaculty] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const fetchFaculty = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Admin_Faculty");
      setFaculty(response.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      fetchFaculty();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, []);

  const handleclick = () => {
    setClicked(!clicked);
  };

  const newFacultyList = faculty.filter((faculties) =>
  faculties.FIRSTNAME.toLowerCase().includes(searchValue.toLowerCase())
);


const generateAuditLog = async () => {
  try {
    const response = await axios.get('https://capstone-server-production-ddc7.up.railway.app/generatefacultylog', {
      responseType: 'blob',
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', 'FACULTY_AUDITLOG.xlsx');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log('Audit log Excel file download initiated');
    } else {
      console.error('Failed to initiate Audit log Excel file download');
    }
  } catch (error) {
    console.error('Error while initiating Audit log Excel file download:', error);
  }
};



  return (
    <main className="w-100 p-0 vh-100">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex w-100 align-items-center">
          <div className="border-bottom border-dark py-1 ps-sm-0 ps-3">
            <i
              className="d-block d-sm-none bi bi-list fs-5 custom-red px-2 rounded "
              onClick={handleclick}
            ></i>
          </div>
          <h2 className="px-2 w-100 border-bottom border-dark py-1 m-0 pe-sm-0 pe-3">
            FACULTY
          </h2>
        </div>
        <section className="container-fluid col-12">
          <div className="row p-0 pt-2">
            <div className="col-12 d-flex gap-3">
              <h3 className="text-decoration-underline">FACULTY LIST</h3>
              <Link href={"/Admin_Page/Faculty_Page/Test_List"} className="text-decoration-none link-dark">
                <h3>TEST LIST</h3>
              </Link>
            </div>
            <div className="d-flex gap-2 justify-content-end align-items-center px-sm-5 px-xl-2 px-2">
              <div className="d-flex">
                <input
                  type="text"
                  placeholder="FirstName Search"
                  className="px-3 py-1 rounded border border-dark"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="btn btn-dark" onClick={generateAuditLog}>AUDIT LOG</button>
              </div>
            </div>
            <div className="pe-2 table-responsive mt-2">
              <table className="table-secondary table table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">ACCOUNT NO.</th>
                    <th scope="col">FIRSTNAME</th>
                    <th scope="col"> MIDDLENAME</th>
                    <th scope="col"> SURNAME</th>
                    <th scope="col"> SUBJECT DEPARTMENT</th>
                    <th scope="col"> GSFE ACCOUNT</th>
                    <th scope="col"> REGISTERED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {newFacultyList.slice(0, 6).map((faculties, index) => (
                    <tr key={index}>
                      <td scope="col">{faculties.TUPCID}</td>
                      <td scope="col">{faculties.FIRSTNAME}</td>
                      <td scope="col"> {faculties.MIDDLENAME}</td>
                      <td scope="col"> {faculties.SURNAME}</td>
                      <td scope="col"> {faculties.SUBJECTDEPT}</td>
                      <td scope="col"> {faculties.GSFEACC}</td>
                      <td scope="col"> {faculties.REGISTEREDDATE}</td>
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
export default Admin_Faculty;
