"use client";
import Link from "next/link";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTUPCID } from "@/app/Provider";

function Login() {
  const [message, setMessage] = useState("");
  const [showPassword, setShowpassword] = useState(false);
  const {setTUPCID} = useTUPCID();

  const router = useRouter();
  const RegExpId = /TUPC-\d{2}-\d{4}$|\d{2}-\d{3,4}|ADMIN-\d{4}$/;
  const schema = yup.object().shape({
    Tupcid: yup
      .string()
      .matches(RegExpId, "Invalid TUPC-ID or ID!")
      .required("Required!"),
    Password: yup.string().required("Required!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    try {
      console.log(data);
      const response = await axios.post("https://capstone-server-production-ddc7.up.railway.app/Login", data);
      setMessage("");
      setTUPCID(response.data.Uid.toString());
      if (response.data.accountType === "admin"){
        router.push("/Admin_Page/Admin")
      }else{
        const accountType = response.data.accountType.charAt(0).toUpperCase() + response.data.accountType.slice(1);
        router.push(`/${accountType}`)
      }
      
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log(err.response.data.message);
        setMessage(err.response.data.message);
      } else {
        throw err;
      }
    }
  };


  
  return (
    <main className="vh-100 d-flex justify-content-center align-items-center ">
      <section className="container col-xl-4 col-lg-6 col-md-7 col-11 d-flex flex-column border border-dark rounded px-0 pt-5 pb-4 gap-2 ">
        <form
          className="container row text-center align-self-center justify-content-center gap-1 p-0"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="row justify-content-center gap-1">
            <p className="m-0">TUPC ID</p>
            <input
              type="text"
              className="col-sm-8 col-11 px-3 py-1 rounded border-dark border text-center"
              {...register("Tupcid")}
            />
            <small className="text-center text-danger">
              {errors.Tupcid?.message}
            </small>
          </div>
          <div className="row justify-content-center gap-1">
            <p className="m-0">PASSWORD</p>
            <div className="row col-sm-8 col-11 p-0 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="col-12 px-3 py-1 rounded border-dark border text-center"
                {...register("Password")}
              />
              {showPassword ? (
                <i
                onClick={() => setShowpassword(!showPassword)}
                  className="bi bi-eye-slash custom-black-color fs-4 position-absolute"
                  style={{ width: "36px", right: "10px" }}
                ></i>
              ) : (
                <i
                  onClick={() => setShowpassword(!showPassword)}
                  className="bi bi-eye custom-black-color fs-4 position-absolute"
                  style={{ width: "36px", right: "10px" }}
                ></i>
              )}
            </div>
            <small className="text-center text-danger">
              {errors.Password?.message}
            </small>
            <small className="text-center text-danger">{message}</small>
          </div>
          <div className="mt-2 p-0">
            <button
              type="submit"
              className="align-self-center col-sm-3 col-4 btn btn-outline-dark rounded"
            >
              Login
            </button>
          </div>
        </form>
        <Link
          href="/Login/Password/ForgetPassword"
          className="text-decoration-none align-self-center"
        >
          <p className="m-0">Forget Password?</p>
        </Link>
        <p className="align-self-center text-center">
          Don't have an account yet?&nbsp;
          <span>
            <Link href="/Login/Registration" className="text-decoration-none ">
              Register now
            </Link>
          </span>
        </p>
      </section>
    </main>
  );
}
export default Login;
