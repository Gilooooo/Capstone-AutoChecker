import axios from "axios";
import { useEffect, useState } from "react";

function AdminCombo({ setCLicked, clicked }) {
  const [warning, setWarning] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [subdeptList, setSubdeptList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [options, setOptions] = useState("");
  const [types, setTypes] = useState("");
  const [subdept_Acro, setSubDept_Acro] = useState("");
  const [subdept, setSubDept] = useState("");
  const [course_Acro, setCourse_Acro] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");
  const [semester, setSemester] = useState("");

  const fetchData = async () => {
    try {
      const [
        courseResponse,
        subjectDeptResponse,
        sectionResponse,
        yearResponse,
        semesterResponse,
        periodResponse,
      ] = await Promise.all([
        axios.get(`http://localhost:3001/Course?`),
        axios.get("http://localhost:3001/SubjectDept"),
        axios.get("http://localhost:3001/Section"),
        axios.get("http://localhost:3001/Year"),
        axios.get("http://localhost:3001/Semester"),
        axios.get("http://localhost:3001/Period"),
      ]);

      setCourseList(courseResponse.data);
      setSubdeptList(subjectDeptResponse.data);
      setSectionList(sectionResponse.data);
      setYearList(yearResponse.data);
      setSemesterList(semesterResponse.data);
      setPeriodList(periodResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  let info = {};
  if (types === "COURSE" && options === "ADD") {
    info = {
      Course: course,
      Course_Acronym: course_Acro,
    };
  } else if (types === "COURSE" && options === "DELETE") {
    info = {
      Course_Acronym: course_Acro,
    };
  } else if (types === "SUBDEPT" && options === "ADD") {
    info = {
      SubjectDepartment: subdept,
      SubjectDepartment_Acronym: subdept_Acro,
    };
  } else if (types === "SUBDEPT" && options === "DELETE") {
    info = {
      SubjectDepartment_Acronym: subdept_Acro,
    };
  } else if (
    types === "SECTION" &&
    (options === "ADD" || options === "DELETE")
  ) {
    info = {
      Section: section,
    };
  } else if (types === "YEAR" && (options === "ADD" || options === "DELETE")) {
    info = {
      Year: year,
    };
  } else if (
    types === "PERIOD" &&
    (options === "ADD" || options === "DELETE")
  ) {
    info = {
      Period: period,
    };
  } else if (
    types === "SEMESTER" &&
    (options === "ADD" || options === "DELETE")
  ) {
    info = {
      Semester: semester,
    };
  }
  const addCombo = async () => {
    console.log(info);
    try {
      const response = await axios.post(
        `http://localhost:3001/AddCombo?types=${types}`,
        info
      );
      console.log(response.data);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteCombo = async () => {
    console.log(info);
    try {
      const response = await axios.post(
        `http://localhost:3001/DeleteCombo?types=${types}`,
        info
      );
      console.log(response.data);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleclick = () => {
    setClicked(!clicked);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main className="w-100 p-0 min-vh-100">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex w-100 align-items-center">
          <div className="border-bottom border-dark py-1 ps-sm-0 ps-3">
            <i
              className="d-block d-sm-none bi bi-list fs-5 custom-red px-2 rounded "
              onClick={handleclick}
            ></i>
          </div>
          <h2 className="px-2 w-100 border-bottom border-dark py-1 m-0 pe-sm-0 pe-3">
            COMBOBOXES
          </h2>
        </div>
        <section className="container-fluid col-12">
          <button
            className="btn btn-outline-dark mt-2"
            data-bs-toggle="modal"
            data-bs-target="#Change"
          >
            Change
          </button>
          {/* Modal */}
          <div
            className="modal fade"
            id="Change"
            tabIndex="-1"
            aria-labelledby="ChangeLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header position-relative justify-content-center">
                  <h1 className="modal-title fs-5" id="ChangeLabel">
                    CHANGE COMBO BOX
                  </h1>
                  <button
                    type="button"
                    className="btn-close m-0 position-absolute end-0 pe-4"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body px-5">
                  <label className="m-0">Option</label>
                  <select
                    className="col-12 py-1 px-3 border border-dark rounded"
                    onChange={(e) => setOptions(e.target.value)}
                  >
                    <option value="" hidden selected>
                      Choose..
                    </option>
                    <option value="ADD">ADD</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <label className="m-0">TYPE</label>
                  <select
                    className="col-12 py-1 px-3 border border-dark rounded"
                    onChange={(e) => setTypes(e.target.value)}
                  >
                    <option value="" hidden selected>
                      Choose..
                    </option>
                    <option value="COURSE">COURSE</option>
                    <option value="SUBDEPT">SUBJECT DEPARTMENT</option>
                    <option value="SECTION">SECTION</option>
                    <option value="YEAR">YEAR</option>
                    <option value="PERIOD">PERIOD</option>
                    <option value="SEMESTER">SEMESTER</option>
                  </select>
                  {types === "COURSE" && options === "ADD" ? (
                    <div>
                      <label>Course Acronym</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setCourse_Acro(e.target.value)}
                      />
                      <label>Course</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setCourse(e.target.value)}
                      />
                    </div>
                  ) : types === "COURSE" && options === "DELETE" ? (
                    <div>
                      <label>Course Acronym</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setCourse_Acro(e.target.value)}
                      />
                    </div>
                  ) : types === "SUBDEPT" && options === "ADD" ? (
                    <div>
                      <label>Subject Department Acronym</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setSubDept_Acro(e.target.value)}
                      />
                      <label>SubjectDepartment</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setSubDept(e.target.value)}
                      />
                    </div>
                  ) : types === "SUBDEPT" && options === "DELETE" ? (
                    <div>
                      <label>Subject Department Acronym</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setSubDept_Acro(e.target.value)}
                      />
                    </div>
                  ) : types === "SECTION" &&
                    (options === "DELETE" || options === "ADD") ? (
                    <>
                      <label>Section</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setSection(e.target.value)}
                      />
                    </>
                  ) : types === "YEAR" &&
                    (options === "DELETE" || options === "ADD") ? (
                    <>
                      <label>Year</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setYear(e.target.value)}
                      />
                    </>
                  ) : types === "PERIOD" &&
                    (options === "DELETE" || options === "ADD") ? (
                    <>
                      <label>Period</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setPeriod(e.target.value)}
                      />
                    </>
                  ) : types === "SEMESTER" &&
                    (options === "DELETE" || options === "ADD") ? (
                    <>
                      <label>Semester</label>
                      <input
                        type="text"
                        className="py-1 px-3 border border-dark rounded col-12"
                        onChange={(e) => setSemester(e.target.value)}
                      />
                    </>
                  ) : (
                    <label></label>
                  )}
                </div>
                <div className="modal-footer justify-content-center w-100">
                  <small className="text-danger col-12 text-center"></small>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss={
                      options === "ADD"
                        ? "modal"
                        : options === "DELETE"
                        ? ""
                        : ""
                    }
                    onClick={
                      options === "ADD"
                        ? addCombo
                        : options === "DELETE"
                        ? () => setWarning(true)
                        : null
                    }
                  >
                    SAVE
                  </button>
                  {/* Modal for Warning */}
                  {warning && (
                    <div
                      className="d-block modal bg-opacity-50 bg-dark m-0"
                      tabIndex="-1"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-danger ">
                          <div className="modal-header">
                            <h5 className="modal-title">WARNING!</h5>
                          </div>
                          <div className="modal-body">
                            <p>ARE YOU SURE TO DELETE THIS ROW?!</p>
                          </div>
                          <div className="modal-footer align-self-center">
                            <button
                              type="button"
                              className="btn btn-success"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                setWarning(!warning);
                                deleteCombo();
                              }}
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              data-bs-dismiss="modal"
                              onClick={() => setWarning(!warning)}
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* End of modal */}
                </div>
              </div>
            </div>
          </div>
          {/* Modal */}
          <div className="row p-0 pt-1 justify-content-center">
            <div className="pe-2 table-responsive mt-2 row">
              <table className="table-secondary table table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col">Course Acronym</th>
                  </tr>
                </thead>
                <tbody>
                  {courseList.map((courses, index) => (
                    <tr key={index}>
                      <td scope="col">{courses.Course}</td>
                      <td scope="col">{courses.Course_Acronym}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="table-secondary table table-bordered border-secondary">
                <thead>
                  <tr>
                    <th scope="col">Subject Department</th>
                    <th scope="col">Subject Department Acronym</th>
                  </tr>
                </thead>
                <tbody>
                  {subdeptList.map((subdept, index) => (
                    <tr key={index}>
                      <td scope="col">{subdept.SubjectDepartment}</td>
                      <td scope="col">{subdept.SubjectDepartment_Acronym}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="col-6 p-0">
                <table className="table-secondary table table-bordered border-secondary">
                  <thead>
                    <tr>
                      <th scope="col">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionList.map((sections, index) => (
                      <tr key={index}>
                        <td scope="col">{sections.Section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-6 p-0">
                <table className="table-secondary table table-bordered border-secondary">
                  <thead>
                    <tr>
                      <th scope="col">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearList.map((years, index) => (
                      <tr key={index}>
                        <td scope="col">{years.Year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-6 p-0">
                <table className="table-secondary table table-bordered border-secondary">
                  <thead>
                    <tr>
                      <th scope="col">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periodList.map((period, index) => (
                      <tr key={index}>
                        <td scope="col">{period.Period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-6 p-0">
                <table className="table-secondary table table-bordered border-secondary">
                  <thead>
                    <tr>
                      <th scope="col">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterList.map((sem, index) => (
                      <tr key={index}>
                        <td scope="col">{sem.Semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
export default AdminCombo;
