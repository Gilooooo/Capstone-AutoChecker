import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

function ListOfTest({ setClicked, clicked }) {
  const { TUPCID } = useTUPCID();
  const [published, setPublished] = useState(false);
  const [TestName, setTestName] = useState("");
  const [semList, setSemList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [Subject, setSubject] = useState("");
  const [uid, setUid] = useState("");
  const [section, setSection] = useState("");
  const [List, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [semester, setSemester] = useState("");
  const [exam, setExam] = useState("");
  const [sectionSubjectName, setSectionSubjectName] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [publishedTest, setPublishedTest] = useState([]);
  const [sectionUid, setSectionUid] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [warning, setWarning] = useState(false);

  const add = async () => {
    const New = {
      TestName: TestName,
      Subject: selectedSubject,
      UidTest: uid,
      SectionName: section,
      UidProf: TUPCID,
      Semester: semester + ":" + exam,
      Uid_section: sectionUid,
    };
    if (
      TestName !== "" &&
      selectedSubject !== "" && // Use selectedSubject here
      section !== "" &&
      uid !== "" &&
      semester !== "" &&
      exam !== ""
    ) {
      setMessage("");
      try {
        const response = await axios.get(
          `http://localhost:3001/CheckTestName`,
          {
            params: {
              TestName: TestName,
              Subject: selectedSubject,
              SectionName: section,
              Semester: semester + ":" + exam,
            },
          }
        );
        if (response.status === 200) {
          const response1 = await axios.post(
            "http://localhost:3001/TestList",
            New
          );
          if (response1.status === 200) {
            fetchingTestList();
            setSemester("");
            setExam("");
          }

          setTestName("");
          setSubject("");
          setSection("");
          setUid("");
          setSelectedSubject(""); // Reset the selected subject
          setFilteredSections([]);
          // Reset the filtered sections
        }
      } catch (err) {
        setMessage(err.response.data.message);
      }
    } else {
      setMessage("Required to Fill up");
    }
  };
  const testNameSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.TestName.localeCompare(b.TestName)
    );
    setSorted(true);
    setList(sortedList);
  };
  const subjectSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.Subject.localeCompare(b.Subject)
    );
    setSorted(true);
    setList(sortedList);
  };
  const sectionSort = () => {
    const sortedList = [...List].sort((a, b) =>
      a.Section_Name.localeCompare(b.Section_Name)
    );
    setSorted(true);
    setList(sortedList);
  };
  const yearSort = () => {
    const sortedList = [...List].sort(
      (a, b) => new Date(a.date_created) - new Date(b.date_created)
    );
    setSorted(true);
    setList(sortedList);
  };

  const removeTest = async (data) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/TestList?UidTest=${data}`
      );
      if (response.status === 200) {
        fetchingTestList();
      }
    } catch (err) {
      console.error("Problem on removing test");
    }
  };

  const publish = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/PublishTest?Uid_Prof=${TUPCID}`,
        data
      );
      if (response.status === 200) {
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setPublished(true);
      } else {
        console.error(err);
      }
    }
  };
  const Uidtest = [List.map((Uids) => Uids.Uid_Test)];
  const checkingPublish = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/CheckPublish`,
        Uidtest
      );
      setPublishedTest(response.data.existingItems);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchingSectionName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/TestListSectionName?UidProf=${TUPCID}`
      );
      setSectionSubjectName(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchingTestList = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/TestList?UidProf=${TUPCID}`
      );
      if (response.status === 200) {
        setList(response.data);
      }
    } catch (err) {
      console.error("Fetching failed");
    }
  };
  const fetchSem = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Semester");
      setSemList(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPeriod = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Period");
      setPeriodList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generate = () => {
    const randoms = "ABCDEFGHIJKLMNOPRSTUVWXYZ";
    var generated = "";
    for (let i = 0; i < 5; i++) {
      const generating = randoms[Math.floor(Math.random() * randoms.length)];
      generated = generated + generating;
    }
    setUid(generated);
  };
  const handleclick = () => {
    setClicked(!clicked);
  };

  const sectionName = (selectedSection) => {
    const [sectionName, sectionUid] = selectedSection.split(",");
    setSection(sectionName);
    setSectionUid(sectionUid);
  };

  const handleSubjectChange = (selectedSubject) => {
    // Filter sections based on the selected subject
    const sectionsForSubject = sectionSubjectName.filter(
      (section) => section.Subject === selectedSubject
    );
    setFilteredSections(sectionsForSubject);

    // Update only the selectedSubject state here
    setSelectedSubject(selectedSubject);
  };

  useEffect(() => {
    const fetching = setInterval(() => {
      if (sorted) {
        return;
      }
      fetchPeriod();
      fetchSem();
      checkingPublish();
      fetchingTestList();
      fetchingSectionName();
    }, 2000);
    return () => {
      clearInterval(fetching);
    };
  }, [TUPCID, sorted, Uidtest]);
  return (
    <main className="w-100 min-vh-100">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-start p-2">
        <div className="d-flex gap-2 align-items-center mb-3 justify-content-between w-100">
          <div className="d-flex align-items-center gap-3 w-100">
            <i
              className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
              onClick={handleclick}
            ></i>
            <div className="d-flex align-items-center gap-2 w-100">
              <Link
                href={{ pathname: "/Faculty" }}
                className="d-sm-block d-none"
              >
                <i className="bi bi-arrow-left fs-3 custom-black-color "></i>
              </Link>
              <h2
                className="m-0 text-sm-start text-center w-100 pe-3"
                onClick={() => console.log(publishedTest)}
              >
                FACULTY
              </h2>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 ">
          <div className="d-flex gap-3">
            <Link
              href={{
                pathname: "/Faculty",
              }}
              className="text-decoration-none link-dark"
            >
              <h4>SECTIONS</h4>
            </Link>
            <h4 className="text-decoration-underline">TESTS</h4>
          </div>
          <div className="align-self-end">
            <small onClick={() => console.log(List)}>Sort by:</small>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 position-relative">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark"
              data-bs-toggle="modal"
              data-bs-target="#Addtest"
            >
              + ADD TEST
            </button>
            {/* Start Modal Add Test */}
            <div
              className="modal fade"
              id="Addtest"
              tabIndex="-1"
              aria-labelledby="AddtestLabel"
              aria-hidden="true"
              data-bs-backdrop="static"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header position-relative justify-content-center">
                    <h1 className="modal-title fs-5" id="AddtestLabel">
                      ADD TEST
                    </h1>
                    <button
                      type="button"
                      className="btn-close m-0 position-absolute end-0 pe-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body px-5">
                    <p className="m-0">TEST NAME</p>
                    <input
                      value={TestName}
                      onChange={(e) => setTestName(e.target.value)}
                      type="text"
                      className="px-3 py-1 rounded border border-dark col-12"
                    />
                    <p className="m-0">SUBJECT</p>
                    <select
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="px-3 py-1 rounded border border-dark col-12"
                      value={selectedSubject} // Ensure the value is set to selectedSubject
                    >
                      <option value="" disabled>
                        Choose...
                      </option>
                      {sectionSubjectName.map((subject, index) => (
                        <option value={subject.Subject} key={index}>
                          {subject.Subject}
                        </option>
                      ))}
                    </select>

                    <label htmlFor="#SectionName">SECTION NAME</label>
                    <div className="row col-12 m-0 gap-sm-4 gap-3">
                      <select
                        name="SectionName"
                        id="SectionName"
                        className="py-1 px-3 rounded border border-dark"
                        onChange={(e) => sectionName(e.target.value)}
                        value={section}
                      >
                        <option value="" disabled>
                          {selectedSubject
                            ? "Choose..."
                            : "Select a subject first"}
                        </option>
                        {filteredSections.map((section, index) => (
                          <option
                            value={[section.Section_Name, section.Uid_Section]}
                            key={index}
                          >
                            {section.Section_Name}, {section.Uid_Section}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="m-0">SEMESTER</p>
                    <select
                      className="px-3 py-1 border border-dark rounded col-12"
                      onChange={(e) => setSemester(e.target.value)}
                      value={semester || ""}
                    >
                      <option value="" disabled>
                        Choose...
                      </option>
                      {semList.map((semes, index) => (
                        <option value={semes.Semester} key={index}>
                          {semes.Semester}
                        </option>
                      ))}
                    </select>
                    <p className="m-0">PERIOD</p>
                    <select
                      className="px-3 py-1 border border-dark rounded col-12"
                      onChange={(e) => setExam(e.target.value)}
                      value={exam || ""}
                    >
                      <option value="" disabled>
                        Choose...
                      </option>
                      {periodList.map((period, index) => (
                        <option value={period.Period} key={index}>
                          {period.Period}
                        </option>
                      ))}
                    </select>

                    <p className="m-0">UID</p>
                    <div className="row m-0 gap-sm-3 gap-2">
                      <input
                        value={uid}
                        type="text"
                        className="px-3 py-1 rounded border border-dark col-7"
                        disabled
                      />
                      <button
                        className="btn btn-outline-dark col-4"
                        onClick={generate}
                      >
                        GENERATE
                      </button>
                    </div>
                  </div>

                  <div className="modal-footer justify-content-center w-100">
                    <small className="text-danger col-12 text-center">
                      {message}
                    </small>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss={
                        message === "Required to Fill up" ? "" : "modal"
                      }
                      onClick={add}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Modal for Add test */}
          </div>
          <div className="dropdown align-self-center">
            <i
              className="bi bi-arrow-down-up d-md-none d-flex fs-4"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></i>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" onClick={testNameSort}>
                  TESTNAME
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={subjectSort}>
                  SUBJECT
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={yearSort}>
                  YEAR
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={sectionSort}>
                  SECTION / COURSE
                </a>
              </li>
            </ul>
          </div>

          <div className="d-md-flex d-none gap-md-2 gap-1 position-absolute end-0 align-self-end">
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={testNameSort}
            >
              TEST NAME
            </button>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={subjectSort}
            >
              SUBJECT
            </button>
            <button className="btn btn-outline-dark btn-sm" onClick={yearSort}>
              YEAR
            </button>
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={sectionSort}
            >
              SECTION / COURSE
            </button>
          </div>
        </div>
        <div className="row m-0 mt-4 col-12 gap-1">
          {List.map((test, index) => (
            <div
              className="px-3 py-2 border border-dark rounded col-12"
              key={index}
            >
              <div className="d-flex justify-content-between">
                <span>
                  <Link
                    href={{
                      pathname: "/Faculty/Test/Question_Answer",
                      query: {
                        testname: test.TestName,
                        uid: test.Uid_Test,
                        sectionname: test.Section_Name,
                        semester: test.Semester,
                        subject: test.Subject,
                      },
                    }}
                    className="link-dark text-decoration-none
                    "
                  >
                    {test.TestName} {test.Subject} {test.Section_Name}&nbsp;
                    {test.Uid_Test}
                  </Link>
                </span>
                <div className="btn-group gap-2" key={index}>
                  {publishedTest.includes(test.Uid_Test) ? (
                    <span className="text-success">Published</span>
                  ) : (
                    <span className="text-danger">Not Publish</span>
                  )}
                  <i className="bi bi-three-dots" data-bs-toggle="dropdown"></i>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target={`#Deleting${index}`}
                      >
                        Remove
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target={`#Publishing${index}`}
                      >
                        Publish
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Modal */}
              <div
                className="modal fade"
                tabIndex="-1"
                id={`Publishing${index}`}
                aria-labelledby={`publishing${index}`}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border border-dark">
                    <div className="modal-header">
                      <h5 className="modal-title" id="publishing">
                        Publishing Test
                      </h5>
                    </div>
                    <div className="modal-body">
                      <p className="text-center">
                        Are you sure to publish this test?
                      </p>
                    </div>
                    <div className="modal-footer align-self-center">
                      <button
                        type="button"
                        className="btn btn-success"
                        data-bs-dismiss="modal"
                        onClick={() =>
                          publish({
                            TestName: test.TestName,
                            UidTest: test.Uid_Test,
                            Subject: test.Subject,
                            SectionName: test.Section_Name,
                            Semester: test.Semester,
                            SectionUid: test.Uid_Section,
                          })
                        }
                      >
                        YES
                      </button>
                      <button
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* end modal */}
              {/* Modal */}
              <div
                className="modal fade"
                tabIndex="-1"
                id={`Deleting${index}`}
                aria-labelledby={`deleting${index}`}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border border-dark">
                    <div className="modal-header">
                      <h5 className="modal-title" id="deleting">
                        Delete Test
                      </h5>
                    </div>
                    <div className="modal-body">
                      <p className="text-center">
                        Are you sure you want to delete this test?
                      </p>
                    </div>
                    <div className="modal-footer align-self-center">
                      <button
                        type="button"
                        className="btn btn-success"
                        data-bs-dismiss="modal"
                        onClick={() => removeTest(test.Uid_Test)}
                      >
                        YES
                      </button>
                      <button
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* end modal */}
            </div>
          ))}
        </div>
      </section>
      {/* Modal */}
      {published && (
        <div className="d-block modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-dark">
              <div className="modal-header">
                <h5 className="modal-title">Warning</h5>
              </div>
              <div className="modal-body">
                <p className="text-center">This Test is already published </p>
              </div>
              <div className="modal-footer align-self-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                  onClick={() => setPublished(!published)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* end modal */}
    </main>
  );
}
export default ListOfTest;
