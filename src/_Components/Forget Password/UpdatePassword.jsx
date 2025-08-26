"use client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UpdatePassword() {
  const [showmodal, setShowmodal] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const params = useSearchParams();
  const Tupcid = params.get("TUPCID");

  const schema = yup.object().shape({
      NewPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must be a combination of an uppercase letter, a lowercase letter, characters, and a number"
      )
      .required("Required!"),
    ConfirmPassword: yup
      .string()
      .oneOf([yup.ref("NewPassword"), null], "Password must match the new password")
      .required("Required!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/UpdatePassword?TUPCID=${Tupcid}`,
        data
      );
      if (response.status === 200) {
        setShowmodal(true);
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <main className="d-flex justify-content-center align-items-center container vh-100">
      <section className="container col-xl-5 col-lg-6 col-md-7 col-sm-10 d-flex flex-column justify-content-center align-items-center border border-dark rounded py-5">
        <h3 className="mb-2">UPDATE PASSWORD</h3>
        <form
          className="row justify-content-center gap-2"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="row col-9 p-0">
            <input
              type="password"
              className="col-9 text-center form-control border border-dark rounded"
              placeholder="New Password"
              {...register("NewPassword")}
            />
          </div>
          <small className="text-danger text-center">
            {errors.NewPassword?.message}
          </small>
          <div className="row col-9 position-relative p-0">
            <input
              type={showPassword ? "text" : "password"}
              className=" text-center form-control border border-dark rounded"
              placeholder="Confirm Password"
              {...register("ConfirmPassword")}
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
          <small className="text-danger text-center">
            {errors.ConfirmPassword?.message}
          </small>
          <button type="submit" className="btn btn-outline-dark col-3">
            Submit
          </button>
        </form>
      </section>
      {showmodal && (
        <div className="d-block modal bg-secondary" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Successfull</h5>
              </div>
              <div className="modal-body">
                <p>Your password is successfully changed</p>
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
    </main>
  );
}
export default UpdatePassword;
