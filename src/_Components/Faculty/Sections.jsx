import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClipboardJS from "clipboard";

function Sections({ setClicked, clicked }) {
  const { TUPCID } = useTUPCID();
  const [sectionList, setSectionList] = useState([]);
  const [copyClick, setCopyClick] = useState(false);
  const [section, setSection] = useState("");
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [sectionComboList, setSectionComboList] = useState([]);

  const initialOption = "Choose..."; // Define initial dropdown option text

  const resetDropdowns = () => {
    setSection(initialOption);
    setYear(initialOption);
    setCourse(initialOption);
    setSubject("");
    setUid("");
  };

  const add = async () => {
    const New = {
      UidProf: TUPCID,
      UidSection: uid,
      SectionName: course + "-" + year + "-" + section,
      Subject: subject,
      Section: section,
      Course: course,
      Year: year,
    };
    if (
      uid !== "" &&
      section !== "" &&
      subject !== "" &&
      course !== "" &&
      year !== ""
    ) {
      setMessage("");
      try {
        const response = await axios.put(
          "https://capstone-server-production-ddc7.up.railway.app/Faculty_sections",
          New
        );
        if (response.status === 200) {
          fetchingSections();
          resetDropdowns(); // Reset dropdown values to initial "Choose..." option
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setMessage("Required to Fill up");
    }
  };

  const fetchingSections = async () => {
    try {
      const response = await axios.get(
        `https://capstone-server-production-ddc7.up.railway.app/Faculty_sections?UidProf=${TUPCID}`
      );
      setSectionList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const copy = (uid) => {
    const updatedSections = sectionList.map((section) => {
      if (section.Uid_Section === uid) {
        section.copyClick = !section.copyClick;
        ClipboardJS.copy(section.Uid_Section);
      }
      return section;
    });
    setSectionList(updatedSections);
  };

  const fetchingYear = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Year");
      setYearList(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const filterYear = yearList.filter((years) => years.Year !== null)
  const fetchingCourse = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Course");
      setCourseList(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchingSection = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Section");
      setSectionComboList(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const filterSection = sectionComboList.filter((section) => section.Section!== null)
  useEffect(() => {
    const changings = setInterval(() => {
      setCopyClick(false);
      fetchingSections();
      fetchingCourse();
      fetchingSection();
      fetchingYear();
    }, 2000);
    return () => {
      clearInterval(changings);
    };
  }, [TUPCID, copyClick]);

  const generate = () => {
    const randoms = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var generated = "";
    for (let i = 0; i < 6; i++) {
      const generating = randoms[Math.floor(Math.random() * randoms.length)];
      generated = generated + generating;
    }
    setUid(generated);
  };

  const handleclick = () => {
    setClicked(!clicked);
  };
  return (
    <main className="w-100 min-vh-100 overflow-auto">
      <section className="contatiner col-12 text-sm-start text-center d-flex flex-column align-items-start p-2">
        <div className="d-flex gap-2 align-items-center mb-3 w-100">
          <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
          <h2
            className="m-0 w-100 text-sm-start text-center pe-3"
            onClick={() => console.log(sectionList.length)}
          >
            FACULTY
          </h2>
        </div>
        <div className="d-flex justify-content-between w-100 ">
          <div className="d-flex gap-3">
            <h4
              className="text-decoration-underline"
              onClick={() => console.log(sectionList.length > 0)}
            >
              SECTIONS
            </h4>
            {sectionList.length > 0 ? (
              <Link
                href={{
                  pathname: "/Faculty/ListOfTest",
                }}
                className="text-decoration-none link-dark"
              >
                <h4>TESTS</h4>
              </Link>
            ) : (
              <h4 className="link-secondary custom-cursor">TESTS</h4>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-between w-100 position-relative">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark"
              data-bs-toggle="modal"
              data-bs-target="#Addtest"
            >
              + CREATE SECTION
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
                      CREATE SECTION
                    </h1>
                    <button
                      type="button"
                      className="btn-close m-0 position-absolute end-0 pe-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body px-5">
                    <label className="m-0">SUBJECT</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      type="text"
                      className="px-3 py-1 rounded border border-dark col-12"
                    />
                    <div className="row m-0">
                      <label htmlFor="#Year" className="col-4">
                        YEAR
                      </label>
                      <label htmlFor="#Course" className="col-4">
                        Course
                      </label>
                      <label htmlFor="#Section" className="col-4">
                        Section
                      </label>
                    </div>

                    <div className="row m-0 gap-2">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        name="Year"
                        id="Year"
                        className="py-1 px-3 rounded border border-dark col-4"
                      >
                        {" "}
                        <option value="">{initialOption}</option>
                        {filterYear.map((years, index) => (
                          <option value={years.Year} key={index}>{years.Year}</option>
                        ))}
                      </select>
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        name="Course"
                        id="Course"
                        className="py-1 px-3 rounded border border-dark col-4"
                      >
                        <option value="">{initialOption}</option>
                        {courseList.map((courses, index) => (
                          <option value={courses.Course_Acronym} key={index}>
                            {courses.Course_Acronym}
                          </option>
                        ))}
                      </select>
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        name="Section"
                        id="Section"
                        className="py-1 px-3 rounded border border-dark col-3"
                      >
                        <option value="">{initialOption}</option>
                        {filterSection.map((sections, index) => (
                          <option value={sections.Section} key={index}>
                            {sections.Section}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="m-0 text-start col-12">JOIN CODE</label>
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
                      data-bs-dismiss="modal"
                      onClick={add}
                    >
                      CREATE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Modal for Add test */}
          </div>
        </div>
        <div className="row justify-content-center m-0 mt-4 col-12 gap-1">
          {sectionList.map((section, index) => (
            <div
              className="d-flex justify-content-center gap-1 p-0"
              key={index}
            >
              <div className="col-lg-10 col-md-9 col-sm-8 col-7 text-center border border-dark rounded py-2 px-3 ">
                <Link
                  className="link-dark text-decoration-none"
                  href={{
                    pathname: "/Faculty/SectionStudents",
                    query: `Section=${section.Section_Name}&Uid_Section=${section.Uid_Section}`,
                  }}
                >
                  <span>
                    {section.Section_Name} {section.Subject}
                  </span>
                </Link>
              </div>
              <div className="d-flex border border-dark rounded col-lg-2 col-md-3 col-sm-4 col-5 justify-content-between align-items-center">
                <span className="px-3">{section.Uid_Section}</span>
                {section.copyClick ? (
                  <i className="bi bi-check px-2 border-start border-secondary"></i>
                ) : (
                  <i
                    className="bi bi-copy px-2 border-start border-secondary"
                    onClick={() => copy(section.Uid_Section)}
                  ></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default Sections;
