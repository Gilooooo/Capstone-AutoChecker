import { useTUPCID } from "@/app/Provider";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function FacultySettings({clicked, setClicked}) {
  const {TUPCID} = useTUPCID();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [Tupcid, setTupcid] = useState("");
  const [surName, setSurName] = useState("");
  const [gsfeacc, setGsfeacc] = useState("");
  const [subjectdept, setSubjectdept] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [initialFacultyInfo, setInitialInfo] = useState({});
  const [warning, setWarning] = useState(false)
  const departments = {
    DIT:"Department of Industrial Technology",
    DED:"Department of Industrial Education",
    DES:"Department of Engineering Sciences",
    DLA:"Department of Liberal Arts",
    DMS:"Department of Mathematics and Sciences"
}

  useEffect(() => {
    const fetchFacultyInfo = async () => {
      try {
        const response = await axios.get(
          `https://capstone-server-production-ddc7.up.railway.app/facultyinfos?TUPCID=${TUPCID}`
        );
        const {
          FIRSTNAME,
          MIDDLENAME,
          SURNAME,
          GSFEACC,
          SUBJECTDEPT,
        } = response.data;

        // Store initial faculty information
        const initialFacultyInfo = {
          FIRSTNAME,
          MIDDLENAME,
          SURNAME,
          GSFEACC,
          SUBJECTDEPT,  
        };
        // Set state with fetched data
        setTupcid(response.data.Tupcid);
        setFirstName(FIRSTNAME);
        setMiddleName(MIDDLENAME);
        setSurName(SURNAME);
        setGsfeacc(GSFEACC);
        setSubjectdept(SUBJECTDEPT);
        // Set initial faculty information
        setInitialInfo(initialFacultyInfo);
      } catch (error) {
        console.error(error);
      }
    };
    // Call the function to fetch data
    fetchFacultyInfo();
  }, [TUPCID, ]);

  const handleclick = () => {
    setClicked(!clicked);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        FIRSTNAME: firstName,
        MIDDLENAME: middleName,
        SURNAME: surName,
        GSFEACC: gsfeacc,
        SUBJECTDEPT: subjectdept,
      };
     
      await updateFacultyDataOnServer(TUPCID , updatedData);
      window.location.reload();
      // Update initial faculty information
      setInitialInfo(updatedData);
      // Update shared state or context with the new information
      updateFacultyInfoContext(updatedData);
      // Exit editing mode
      setIsEditing(false);
      
    } catch (error) {
      console.error(error);
    }
  };
  

  const updateFacultyDataOnServer = async (TUPCID, updatedData) => {
    try {
      await axios.put(
        `https://capstone-server-production-ddc7.up.railway.app/updatefacultyinfos/${TUPCID}`,
        updatedData
      );
      // Update state with new values
      setFirstName(updatedData.FIRSTNAME);
      setMiddleName(updatedData.MIDDLENAME);
      setSurName(updatedData.SURNAME);
      setGsfeacc(updatedData.GSFEACC);
      setSubjectdept(updatedData.SUBJECTDEPT);
      // Password is not updated here since it might be hashed
    } catch (error) {
      console.error("Error updating faculty data:", error);
    }
  };

  return (
    <main className="w-100 min-vh-100">
      <section className="container-fluid col-12 p-2 d-flex flex-column">
        <div className="d-flex align-items-center">
        <i
            className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
            onClick={handleclick}
          ></i>
        <Link href={{ pathname: "/Faculty" }}>
            <i className="bi bi-arrow-left fs-3 custom-black-color d-sm-block d-none"></i>
          </Link>
          <h2 className="m-0 w-100 text-center text-sm-start pe-sm-0 pe-2">Settings</h2>
        </div>
        <h3 className="text-center pt-3 m-0 ">UPDATE PERSONAL INFO</h3>
        <div className="d-flex justify-content-center flex-column container col-md-10 col-lg-5 rounded border border-dark bg-lightgray">
          <div className="text-end pt-2">
            <span
              className="align-self-end"
              onClick={() => {
                if (isEditing) {
                  setFirstName(initialFacultyInfo.FIRSTNAME);
                  setMiddleName(initialFacultyInfo.MIDDLENAME);
                  setSurName(initialFacultyInfo.SURNAME);
                  setGsfeacc(initialFacultyInfo.GSFEACC);
                  setSubjectdept(initialFacultyInfo.SUBJECTDEPT);
                }
                setIsEditing((prevEditing) => !prevEditing);
              }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </span>
          </div>

          <fo rm
            className="p-3 pt-0 col-sm-10 text-sm-start text-center align-self-center"
            onSubmit={handleSave}
          >
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">TUPC ID</p>
              <input
                type="text"
                value={Tupcid}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">FIRST NAME</p>
              <input
                type="text"
                value={firstName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">MIDDLE NAME</p>
              <input
                type="text"
                value={middleName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">SURNAME</p>
              <input
                type="text"
                value={surName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setSurName(e.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">GSFE ACCOUNT</p>
              <input
                type="text"
                value={gsfeacc}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setGsfeacc(e.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">
                SUBJECT DEPARTMENT
              </p>
              <select
                type="text"
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={(e) => setSubjectdept(e.target.value)}
              >
                <option value={subjectdept} selected disabled hidden>
                  {departments[subjectdept]}
                </option>
                <option value="DIT">Department of Industrial Technology</option>
                <option value="DED">Department of Industrial Education</option>
                <option value="DES">Department of Engineering Sciences</option>
                <option value="DLA">Department of Liberal Arts</option>
                <option value="DMS">Department of Mathematics and Sciences</option>
              </select>
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">
                PASSWORD:     
              </p>
              <a className="col-sm-6 p-0 m-0 text-decoration-underline link-primary" onClick={() => setWarning(!warning)}>Update Password</a>
            </div>
            {isEditing && (
              <div className="pt-3 text-center col-12">
                <button
                  type="button"
                  className="btn btn-light col-md-5 col-lg-2 border border-dark rounded text-center"
                  onClick={() => {
                    handleSave();
                    // Optionally, you can reset the form to a non-editing state here
                    setIsEditing(false);
                  }}
                >
                  SAVE
                </button>
              </div>
            )}
          </fo>
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
                <p className="text-center">This will lead you to the forget password page and you need to re-login again. Are you sure you want to do this?</p>
              </div>
              <div className="modal-footer align-self-center">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => setWarning(!warning)}>Cancel</button>
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
