"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import Link from "next/link";

function StudentRegistration() {
  const [showError, setShowerror] = useState(false);
  const [showSuccessfull, setShowsuccessfull] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const [coursesList, setCoursesList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [email, setEmail] = useState("");
  // RegExp
  const gsfeRegExp = /@gsfe.tupcavite.edu.ph/;
  const tupcRegExp = /TUPC-\d{2}-\d{4}$/;

  const schema = yup.object().shape({
    TUPCID: yup.string().matches(tupcRegExp, "Invalid TUPC-ID!"),
    SURNAME: yup.string().required("Surname is Needed!"),
    FIRSTNAME: yup.string().required("Firstname is Needed!"),
    MIDDLENAME: yup.string().min(2).required("Middle name is Needed! "),
    GSFEACC: yup
      .string()
      .transform((value) => {
        if (!value.includes("@gsfe.tupcavite.edu.ph") && value !== "") {
          return `${value}@gsfe.tupcavite.edu.ph`;
        }
        return value;
      })
      .matches(gsfeRegExp, "Invalid gsfe account!"),
    COURSE: yup.string().required("Please Choose!"),
    SECTION: yup.string().required("Please Choose!"),
    YEAR: yup.string().required("Please Choose!"),
    STATUS: yup.string().required("Please Choose!"),
    PASSWORD: yup
    .string()
    .min(6)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must be a combination of an uppercase letter, a lowercase letter, characters, and a number"
    )
    .required("Password Needed!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    try {
      const response = await axios.post(
        "https://capstone-server-production-ddc7.up.railway.app/StudentRegister",
        data
      );
      if (response.status === 200) {
        //prompt modal
        setShowsuccessfull(true);
      } else {
        //prompt modal
        alert("aww");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        //prompt modal
        setShowerror(true);
      } else {
        alert("Problem");
        throw err;
      }
    }
  };
  const courses = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Course");
      setCoursesList(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const section = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Section");
      setSectionList(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const sectionFilter = sectionList.filter(
    (sections) => sections.Section !== null
  );
  const year = async () => {
    try {
      const response = await axios.get("https://capstone-server-production-ddc7.up.railway.app/Year");
      setYearList(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const yearFilter = yearList.filter((years) => years.Year !== null);
  useEffect(() => {
    courses();
    section();
    year();
  }, []);

  return (
    <main className="custom-h d-flex justify-content-center align-items-center">
      <section className="contatiner col-sm-11 col-md-9 col-xl-7 col-11 text-sm-start text-center d-flex flex-column align-items-center justify-content-center">
        <h2>STUDENT REGISTRATION</h2>
        <form
          className="container col-lg-9 col-xl-8 col-md-11 border border-dark row justify-content-center rounded gap-2 py-3"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">TUPC ID</p>
            <input
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              type="text"
              placeholder="TUPC-XX-XXXX"
              {...register("TUPCID")}
            />
            <small className="text-sm-end text-center text-danger">
              {errors.TUPCID?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">SURNAME</p>
            <input
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              type="text"
              {...register("SURNAME")}
            />
            <small className="text-sm-end text-center text-danger">
              {errors.SURNAME?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">FIRSTNAME</p>
            <input
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              type="text"
              {...register("FIRSTNAME")}
            />
            <small className="text-sm-end text-center text-danger">
              {errors.FIRSTNAME?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">MIDDLENAME</p>
            <input
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              type="text"
              {...register("MIDDLENAME")}
            />
            <small className="text-sm-end text-center text-danger">
              {errors.MIDDLENAME?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">GSFE ACCOUNT</p>
            <div className="d-flex col-sm-7 p-0 gap-2">
              <input
                className="col-7 px-3 py-1 rounded border border-dark"
                type="text"
                {...register("GSFEACC")}
              />
              <small className="col-4 m-0 align-self-end custom-fontsize">@gsfe.tupcavite.edu.ph</small>
            </div>
            <small className="text-sm-end text-center text-danger">
              {errors.GSFEACC?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">COURSE</p>
            <select
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              {...register("COURSE")}
            >
              <option value="" selected hidden disabled>
                Choose...
              </option>
              {coursesList.map((course, index) => (
                <option value={course.Course_Acronym} key={index}>
                  {course.Course_Acronym}
                </option>
              ))}
            </select>
            <small className="text-sm-end text-center text-danger">
              {errors.COURSE?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">SECTION</p>
            <select
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              {...register("SECTION")}
            >
              <option value="" selected hidden disabled>
                Choose...
              </option>
              {sectionFilter.map((sections, index) => (
                <option key={index} value={sections.Section}>
                  {sections.Section}
                </option>
              ))}
            </select>
            <small className="text-sm-end text-center text-danger">
              {errors.SECTION?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">YEAR</p>
            <select
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              {...register("YEAR")}
            >
              <option selected hidden disabled>
                Choose...
              </option>
              {yearFilter.map((year, index) => (
                <option value={year.Year} key={index}>
                  {year.Year}
                </option>
              ))}
            </select>
            <small className="text-sm-end text-center text-danger">
              {errors.YEAR?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">STUDENT STATUS</p>
            <select
              className="col-sm-7 px-3 py-1 rounded border border-dark"
              {...register("STATUS")}
            >
              <option selected hidden disabled>
                Choose...
              </option>
              <option value="REGULAR">REGULAR</option>
              <option value="IRREGULAR">IRREGULAR</option>
            </select>
            <small className="text-sm-end text-center text-danger">
              {errors.STATUS?.message}
            </small>
          </div>
          <div className="row">
            <p className="col-sm-5 m-0 align-self-center">PASSWORD</p>
            <div className="position-relative col-sm-7 p-0">
              <input
                className="col-12 px-3 py-1 rounded border border-dark"
                type={showPassword ? "text" : "password"}
                {...register("PASSWORD")}
              />
              {showPassword ? (
                <i
                  onClick={() => setShowpassword(!showPassword)}
                  className="bi bi-eye-slash custom-black-color fs-4 position-absolute"
                  style={{ width: "36px", right: "0px" }}
                ></i>
              ) : (
                <i
                  onClick={() => setShowpassword(!showPassword)}
                  className="bi bi-eye custom-black-color fs-4 position-absolute"
                  style={{ width: "36px", right: "0px" }}
                ></i>
              )}
            </div>
            <small className="text-sm-end text-center text-danger">
              {errors.PASSWORD?.message}
            </small>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-outline-dark">
              REGISTER
            </button>
          </div>
        </form>
      </section>
      {/* Modal for successfull register */}
      {showSuccessfull && (
        <div className="d-block modal bg-opacity-50 bg-dark m-0" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-success">
              <div className="modal-header">
                <h5 className="modal-title">SUCCESSFUL</h5>
              </div>
              <div className="modal-body">
                <p>Your account is successfully registered</p>
              </div>
              <div className="modal-footer align-self-center">
                <Link href="/Login">
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
      {/* End of Modal */}
      {/* Modal for already registered */}
      {showError && (
        <div className="d-block modal bg-opacity-50 bg-dark m-0" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-danger">
              <div className="modal-header">
                <h5 className="modal-title">Already registered</h5>
              </div>
              <div className="modal-body">
                <p>You are already registered</p>
              </div>
              <div className="modal-footer align-self-center">
                <Link href="/Login">
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
      {/* End of modal */}
    </main>
  );
}
export default StudentRegistration;
