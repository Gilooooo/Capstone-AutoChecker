"use client";

function OptionPosition({ faculty, student }) {
  return (
    <main className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h2>I AM A</h2>
      <section className="row gap-4 justify-content-center">
        <div
          data-bs-toggle="modal"
          data-bs-target="#StudentProfile"
          className="card col-5 text-center p-sm-5 py-5 px-0"
        >
          <div className="card-body px-1 px-sm-2">
            <h5>STUDENT PROFILE</h5>
          </div>
        </div>
        {/* Start of Modal student */}
        <div
          className="modal fade"
          id="StudentProfile"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="StudentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="StudentModalLabel">
                  STUDENT
                </h1>
              </div>
              <div className="modal-body text-center">
                Did you select your position correctly?
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  No
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={student}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End of Modal */}
        <div
          data-bs-toggle="modal"
          data-bs-target="#FacultyProfile"
          className="card col-5 text-center p-sm-5 py-5 px-0"
        >
          <div className="card-body px-1 px-sm-2">
            <h5>FACULTY PROFILE</h5>
          </div>
        </div>
        {/* Start of Modal faculty */}
        <div
          className="modal fade"
          id="FacultyProfile"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="FacultyModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="FacultyModalLabel">
                  FACULTY
                </h1>
              </div>
              <div className="modal-body text-center">
                Did you select your position correctly?
              </div>
              <div className="modal-footer d-flex justify-content-center ">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  No
                </button>
                <button
                  data-bs-dismiss="modal"
                  type="button"
                  className="btn btn-primary"
                  onClick={faculty}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End of Modal */}
      </section>
    </main>
  );
}
export default OptionPosition;
