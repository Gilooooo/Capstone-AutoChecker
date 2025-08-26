import axios from "axios";
import { useState } from "react";

function Contact({ scrollToTop }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const emailReq = "@gsfe.tupcavite.edu.ph";
  const sendProblem = async () => {
    const sendInfor = {
      GSFEACC: email,
      MESSAGE: message,
    };
    try {
      if (email.trim !== "" && email.includes(emailReq) && message.trim !== "") {
        const response = await axios.post(
          "https://capstone-server-production-ddc7.up.railway.app/ReportProblem",
          sendInfor
        );
        if (response.status === 200) {
          alert("SEND SUCCESSFULLY");
          setMessage("");
        } else {
          alert("TRY AGAIN LATER");
        }
      } else {
        alert("Required a Message and Email!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="d-flex position-relative justify-content-center align-items-center container-fluid p-0 min-vh-100 custom-red custom-white-color">
      <section className="d-flex flex-column justify-content-center col-sm-8 col-md-9 col-xl-6 col-11">
        <h1>FOUND A BUG?</h1>
        <p className="m-0 fs-sm-3 fs-4 fw-light">
          SUBMIT A REPORT OR EMAIL US ON{" "}
          <span className="link-primary">eosteam22@gmail.com</span>
        </p>
        <form className="d-flex flex-column gap-2">
          <input
            type="text"
            className="form-control bg-transparent border-2 border-dark text-light"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            cols="30"
            rows="15"
            placeholder="Message"
            className="form-control bg-transparent border-2 border-dark text-light"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className="align-self-end">
            <button
              className="custom-button"
              type="button"
              onClick={sendProblem}
            >
              Submit
            </button>
          </div>
        </form>
        <i
          className="bi bi-arrow-up-square-fill position-absolute fs-1 custom-arrow d-sm-block d-none"
          onClick={scrollToTop}
        ></i>
      </section>
    </main>
  );
}
export default Contact;
