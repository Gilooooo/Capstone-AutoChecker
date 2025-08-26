"use client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";


function ForgetPassword() {
  const [message, setMessage] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const router = useRouter();
  const gsfeRegExp = /@gsfe.tupcavite.edu.ph/;
  const tupcRegExp = /TUPC-\d{2}-\d{4}$|\d{2}-\d{3,4}$/;
  const schema = yup.object().shape({
    Tupcid: yup
      .string()
      .matches(tupcRegExp, "Invalid TUPC-ID!")
      .required("Required!"),
    Gsfeacc: yup
      .string()
      .matches(gsfeRegExp, "Invalid Gsfe account")
      .required("Required!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    const { Tupcid, Gsfeacc } = data;
    try {
      const response = await axios.post(
        `http://localhost:3001/ForgetPassword?TUPCID=${Tupcid}&GSFEACC=${Gsfeacc}`
      );
      if (response.status === 200) {
        setMessage(response.data.message)
        router.push(`/Login/Password/MatchCode?TUPCID=${Tupcid}&GSFE=${Gsfeacc}`)
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setErrorMessage(err.response.data.message)
      } else {
        setErrorMessage(err.response.data.message)
      }
    }
  };
  return (
    <main className="d-flex justify-content-center align-items-center container vh-100">
      <section className="container col-xl-5 col-lg-6 col-md-7 col-sm-10 d-flex flex-column justify-content-center align-items-center border border-dark rounded py-5">
        <h3 className="mb-0">FORGET PASSWORD</h3>
        <small className="text-secondary mb-2">
          Enter your GSFE account to reset your password
        </small>
        <form
          className="row justify-content-center gap-2"
          onSubmit={handleSubmit(submitForm)}
        >
          <input
            type="text"
            className="col-9 text-center py-1 px-3 border border-dark rounded"
            placeholder="TUPC ID"
            {...register("Tupcid")}
          />
          <small className="text-danger text-center">
            {errors.Tupcid?.message}
          </small>
          <input
            type="text"
            className="col-9 text-center py-1 px-3 border border-dark rounded"
            placeholder="GSFE ACCOUNT"
            {...register("Gsfeacc")}
          />
          <small className="text-danger text-center">
            {errors.Gsfeacc?.message}
          </small>
          {message || errormessage ? <small className={`${message ? "text-success":"text-danger"} text-center`}>{message || errormessage}</small>:<></>}
          <button className="btn btn-outline-dark col-3">Submit</button>
        </form>
      </section>
    </main>
  );
}
export default ForgetPassword;
