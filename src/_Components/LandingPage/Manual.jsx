import Link from "next/link";

function Manual() {
  return (
    <main className="container-fluid p-0 overflow-auto h-100">
      <section className="custom-h-landing-2 custom-black-color overflow-hidden">
        <div className="d-md-flex row justify-content-center h-100 align-items-center ">
          <div className="col-md-6 px-sm-4 px-md-5 px-4 d-flex flex-column gap-3">
            <h1>HOW TO START?</h1>
            <p className="d-flex align-items-center gap-2 fs-3 m-0">
              <i className="bi bi-1-circle display-4 pt-1"></i>Click{" "}
              <span>
                <Link
                  href={"/Login/Registration"}
                  className="text-decoration-none"
                >
                  Register Now
                </Link>
              </span>
            </p>
            <p className="d-flex align-items-center gap-2 fs-3 m-0">
              <i className="bi bi-2-circle display-4 pt-1"></i>Choose a school
              position and fill up the important details
            </p>
            <p className="d-flex align-items-center gap-2 fs-3 m-0">
              <i className="bi bi-3-circle display-4 pt-1"></i>After a
              successful registration, you can now login to your account
            </p>
          </div>
          <div className="col-md-6 h-sm-100 h-50 d-flex justify-content-center align-items-center">
            <video
              src="/Manual.mp4"
              className="img-fluid h-100 px-sm-2 px-2"
              preload="auto"
              muted
              loop="loop"
              autoPlay="autoPlay"
              controls
            ></video>
          </div>
        </div>
      </section>
    </main>
  );
}
export default Manual;
