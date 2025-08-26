import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";

function FacultyTestList({ clicked, setClicked }) {
  const [testlist, setTestlist] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const fetchTestlist = async () => {
    try {
      const response = await axios.get(
        "https://capstone-server-production-ddc7.up.railway.app/Admin_FacultyTestList"
      );

      setTestlist(response.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      fetchTestlist();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, []);

  const handleclick = () => {
    setClicked(!clicked);
  };

  const newTestList = testlist.filter((test) =>
  test.Professor_FirstName.toLowerCase().includes(searchValue.toLowerCase())
);


const generatetestlist = async () => {
  try {
    const response = await axios.get('https://capstone-server-production-ddc7.up.railway.app/generatetestlistlog', {
      responseType: 'blob',
    });

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', 'FACULTY_TESTLISTLOG.xlsx');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      console.log('Test List Audit log Excel file download initiated');
    } else {
      console.error('Failed to initiate Test List Audit log Excel file download');
    }
  } catch (error) {
    console.error('Error while initiating Test List Audit log Excel file download:', error);
  }
};


  return (
    <main className="w-100 p-0 vh-100">
      <section className="contatiner col-12 pe-2 text-sm-start text-center d-flex flex-column align-items-center justify-content-center">
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
              <Link
                href={"/Admin_Page/Faculty_Page"}
                className="text-decoration-none link-dark"
              >
                <h3>FACULTY LIST</h3>
              </Link>
              <h3 className="text-decoration-underline">TEST LIST</h3>
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
                <button className="btn btn-dark"onClick={generatetestlist}>AUDIT LOG</button>
              </div>
            </div>
            <div className="pe-2 table-responsive mt-2">
              <table className="table-secondary table table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">ID NO.</th>
                    <th scope="col"> FIRSTNAME</th>
                    <th scope="col"> MIDDLENAME</th>
                    <th scope="col"> SURNAME</th>
                    <th scope="col"> SUBJECT DEPARTMENT</th>
                    <th scope="col"> PROFESSOR ID</th>
                    <th scope="col"> SUBJECT</th>
                    <th scope="col"> SECTION NAME</th>
                    <th scope="col"> TEST NAME</th>
                    <th scope="col"> UID TEST</th>
                  </tr>
                </thead>
                <tbody>
                  {newTestList.slice(0, 6).map((tests, index) => (
                    <tr key={index}>
                      <td scope="col">{index+1}</td>
                      <td scope="col"> {tests.Professor_FirstName}</td>
                      <td scope="col"> {tests.Professor_MiddleName}</td>
                      <td scope="col"> {tests.Professor_LastName}</td>
                      <td scope="col"> {tests.Professor_SubjectDept}</td>
                      <td scope="col"> {tests.Professor_ID}</td>
                      <td scope="col"> {tests.Subject}</td>
                      <td scope="col"> {tests.Section_Name}</td>
                      <td scope="col"> {tests.TestName}</td>
                      <td scope="col"> {tests.Uid_Test}</td>
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

export default FacultyTestList;
