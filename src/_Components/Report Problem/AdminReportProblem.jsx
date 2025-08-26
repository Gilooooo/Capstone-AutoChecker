import axios from "axios";
import Link from "next/link";
import { useState } from "react";

function AdminReport({clicked, setClicked}){
    const [email, setEmail] = useState("Admin");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const sendProblem = async () => {
      const Information = {
        GSFEACC: email,
        MESSAGE: message,
      };
      try {
        const response = await axios.post(
          "http://localhost:3001/ReportProblem",
          Information
        );
        if (response.status === 200) {
          setSuccess(!success);
          setMessage("");
        } else {
          alert("There is a problem, try again later");
        }
      } catch (err) {
        console.error(err);
      }
    };
    const handleclick = () => {
      setClicked(!clicked);
    };
    return (
      <main className="w-100 min-vh-100">
        <section className="container-fluid col-12 p-2 d-flex flex-column">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i
              className="d-block d-sm-none bi bi-list fs-5 pe-auto custom-red px-2 rounded"
              onClick={handleclick}
            ></i>
            <h2 className="m-0 w-100 text-sm-start text-center pe-3">
              REPORT PROBLEM
            </h2>
          </div>
          <form className="container border border-dark rounded d-flex flex-column col-xl-4 col-lg-5 col-md-6 col-sm-8 align-self-center align-items-center p-2 gap-2">
            <input
              value={email}
              className="rounded border border-dark form-control"
              type="text"
              placeholder="Gsfe Account"
              disabled
              readOnly
            />
            <textarea
            value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded border border-dark form-control"
              placeholder="Message"
              rows={10}
            ></textarea>
            <button
              type="button"
              className="btn btn-outline-dark "
              onClick={sendProblem}
            >
              SEND
            </button>
          </form>
          {/* Modal */}
          {success && (
            <div className="d-block modal" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border border-dark">
                  <div className="modal-header">
                    <h5 className="modal-title">Success</h5>
                  </div>
                  <div className="modal-body">
                    <p className="text-center">
                      Your report will help the developer to find and fix the bug.
                    </p>
                  </div>
                  <div className="modal-footer align-self-center">
                    <button
                      type="button"
                      className="btn btn-success"
                      data-bs-dismiss="modal"
                      onClick={() => setSuccess(!success)}
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* end modal */}
        </section>
      </main>
    )
};
export default AdminReport;