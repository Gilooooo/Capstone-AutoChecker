import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

function StudentSettings({ clicked, setClicked }) {
  const { TUPCID } = useTUPCID();
  const [Tupcid, setTupcid] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [MiddleName, setMiddleName] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [gsfeacc, setGsfeacc] = useState("");
  const [initialStudentInfo, setInitialInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const fetchstudentdate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/studinfos?TUPCID=${TUPCID}`
        );
        const {
          FIRSTNAME,
          SURNAME,
          MIDDLENAME,
          COURSE,
          SECTION,
          YEAR,
          STATUS,
          GSFEACC,
        } = response.data;

        // Store initial faculty information
        const initialStudentInfo = {
          FIRSTNAME,
          MIDDLENAME,
          SURNAME,
          COURSE,
          SECTION,
          YEAR,
          STATUS,
          GSFEACC,
        };

        // Set state with fetched data
        setTupcid(response.data.Tupcid);
        setFirstName(FIRSTNAME);
        setMiddleName(MIDDLENAME);
        setSurName(SURNAME);
        setCourse(COURSE);
        setSection(SECTION);
        setYear(YEAR);
        setStatus(STATUS);
        setGsfeacc(GSFEACC);
        setInitialInfo(initialStudentInfo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchstudentdate();
  }, [TUPCID]);

  const handleSave = async () => {
    try {
      const updatedData = {
        FIRSTNAME: firstName,
        SURNAME: surName,
        MIDDLENAME: MiddleName,
        COURSE: course,
        SECTION: section,
        YEAR: year,
        STATUS: status,
        GSFEACC: gsfeacc,
      };
      await updateStudentDataOnServer(TUPCID, updatedData);
      // window.location.reload();
      // Update initial faculty information
      setInitialInfo(updatedData);
      // Update shared state or context with the new information
      updateStudentInfoContext(updatedData);
      // Exit editing mode
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudentDataOnServer = async (TUPCID, updatedData) => {
    try {
      await axios.put(
        `http://localhost:3001/updatestudentinfos?TUPCID=${TUPCID}`,
        updatedData
      );
      setFirstName(updatedData.FIRSTNAME);
      setMiddleName(updatedData.MIDDLENAME);
      setSurName(updatedData.SURNAME);
      setGsfeacc(updatedData.GSFEACC);
      setCourse(updatedData.COURSE);
      setSection(updatedData.SECTION);
      setYear(updatedData.yeaYEAR);
      setStatus(updatedData.STATUS);
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };
  const handleclick = () => {
    setClicked(!clicked);
  };
  return (
    <main className="w-100 min-vh-100">
      <section className="container-fluid col-12 p-2 d-flex flex-column ">
        <div className="d-flex align-items-center">
          <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
          <Link href={{ pathname: "/Student" }}>
            <i className="bi bi-arrow-left fs-3 custom-black-color d-sm-block d-none"></i>
          </Link>
          <h2 className="m-0 w-100 text-center text-sm-start pe-2">Settings</h2>
        </div>
        <h3 className="text-center pt-3 m-0 ">UPDATE PERSONAL INFO</h3>
        <div className="d-flex justify-content-center flex-column container col-md-9 col-xl-5 col-lg-7 rounded border border-dark py-2">
          <span
            className="text-end"
            onClick={() => {
              if (isEditing) {
                setFirstName(initialStudentInfo.FIRSTNAME);
                setMiddleName(initialStudentInfo.MIDDLENAME);
                setSurName(initialStudentInfo.SURNAME);
                setCourse(initialStudentInfo.COURSE);
                setSection(initialStudentInfo.SECTION);
                setYear(initialStudentInfo.YEAR);
                setStatus(initialStudentInfo.STATUS);
                setGsfeacc(initialStudentInfo.GSFEACC);
              }
              setIsEditing((prevEditing) => !prevEditing);
            }}
          >
            {isEditing ? "Cancel" : "EDIT"}
          </span>
          <form
            onSubmit={handleSave}
            className="row p-3 pt-0 col-11 text-sm-start text-center align-self-center"
          >
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">TUPC ID</p>
              <input
                type="text"
                value={Tupcid}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled
              />
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">GSFE ACCOUNT</p>
              <input
                type="text"
                value={gsfeacc}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setGsfeacc(e.target.value)}
              />
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">FIRST NAME</p>
              <input
                type="text"
                value={firstName}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">COURSE</p>
              <select
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
              >
                <option value="BSCE">BSCE</option>
                <option value="BSEE">BSEE</option>
                <option value="BSME">BSME</option>
                <option value="BSIE ICT">BSIE ICT</option>
                <option value="BSIE IA">BSIE IA</option>
                <option value="BSIE HE">BSIE HE</option>
                <option value="BTTE CP">BTTE CP</option>
                <option value="BTTE EL">BTTE EL</option>
                <option value="BET AT">BET AT</option>
                <option value="BET CT">BET CT</option>
                <option value="BET COET">BET COET</option>
                <option value="BET ET">BET ET</option>
                <option value="BET ESET">BET ESET</option>
                <option value="BET MT">BET MT</option>
                <option value="BET PPT">BET PPT</option>
              </select>
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">MIDDLE NAME</p>
              <input
                type="text"
                value={MiddleName}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">YEAR</p>
              <select
                type="text"
                value={year}
                className="col-12 rounded py-1 px-3 border border-dark"
                onChange={(e) => setYear(e.target.value)}
                disabled={!isEditing}
              >
                <option value={year}hidden>{year}</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">SURNAME</p>
              <input
                type="text"
                value={surName}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setSurName(e.target.value)}
              />
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">SECTION</p>
              <select
                type="text"
                value={section}
                className="col-12 rounded py-1 px-3 border border-dark"
                onChange={(e) => setSection(e.target.value)}
                disabled={!isEditing}
              >
                <option value={section} hidden>{section}</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="col-sm-6 p-2">
              <p className="p-0 m-0">STATUS</p>
              <select
                type="text"
                value={status}
                className="col-12 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value={status} hidden>{status}</option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            <div className="col-sm-6 p-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">PASSWORD:</p>
              <a
                className="col-sm-6 p-0 m-0 text-decoration-underline link-primary"
                onClick={() => setWarning(!warning)}
              >
                Update Password
              </a>
            </div>
            {isEditing && (
              <div className="pt-3 text-center col-12">
                <button
                  type="button"
                  className="btn btn-light col-md-5 col-lg-2 border border-dark rounded text-center"
                  onClick={() => {
                    handleSave();
                    setIsEditing(false);
                  }}
                >
                  SAVE
                </button>
              </div>
            )}
          </form>
        </div>
        {/* Modal */}
        {warning && (
          <div className="d-block modal bg-secondary" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">WARNING!</h5>
                </div>
                <div className="modal-body">
                  <p className="text-center">
                    This will lead you to the forget password page and you need to re-login again. Are you sure you want to do this?
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
                  <Link href="/Login/Password/ForgetPassword">
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Ok
                    </button>
                  </Link>
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
export default StudentSettings;