"use client"
import { useSearchParams } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function MatchCode() {
  const [message, setMessage] = useState("");
  const params = useSearchParams();
  const Tupcid = params.get("TUPCID");
  const GsfeAcc = params.get("GSFE");
  const router = useRouter();


  const schema = yup.object().shape({
    Code: yup.string().length(6, "Invalid 6-Digit Code").required("Invalid 6-Digit Code")
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    try{
      const response = await axios.post(`http://localhost:3001/MatchCode`, data)
      if(response.status === 200){
        router.push(`/Login/Password/UpdatePassword?TUPCID=${Tupcid}&GSFEACC=${GsfeAcc}`)
      }
    }catch(err){
      setMessage(err.response.data.message)
    }
  }


  return (
    <main className="d-flex justify-content-center align-items-center container vh-100">
      <section className="container col-xl-5 col-lg-6 col-md-7 col-sm-10 d-flex flex-column justify-content-center align-items-center border border-dark rounded py-5">
        <h3 className="mb-0">MATCH CODE</h3>
        <small className="text-secondary mb-2">
          Enter the 6-digit sent to your GSFE Account
        </small>
        <form className="row justify-content-center gap-1" onSubmit={handleSubmit(submitForm)}>
          <input
            type="text"
            className="col-10 text-center py-1 px-3 border border-dark rounded"
            placeholder="6-Digit Code"
            maxLength="6"
            {...register("Code")}
          />
          <small className="text-danger text-center">
            {errors.Code?.message}
          </small>
          <small className="text-danger text-center">
            {message}
          </small>
          <button className="btn btn-outline-dark col-3" type="submit">Submit</button>
        </form>
      </section>
    </main>
  );
}
export default MatchCode;
