function About() {
  return (
    <main className="container-fluid p-0 overflow-auto h-100 custom-red">
      <section className="d-md-flex custom-h-landing-3 align-items-center custom-red custom-white-color">
        <h1 className="fw-bold custom-display-2 col-md-6 px-sm-4 pe-sm-5 px-md-5 ps-1 py-1 m-0">
          CHECKING MADE EASY WITH&nbsp;
          <span className="custom-black-color">OCR</span>
        </h1>
        <div className="d-sm-flex d-block flex-column  justify-content-center col-md-6 px-md-5 px-sm-4 px-1">
          <div className="position-relative text-break fw-light custom-fs m-0 text-md-start text-end py-sm-1">
            Built using JavaScript and Python to process things
            behind-the-scene.
            <br />
            <br />
            With a simple scan of a web camera, checking of test papers are
            automatically recorded into the system.
            <p className="d-md-flex gap-2 py-md-5">
              <span className="lines1 "></span>
              <span className="lines2 "></span>
              <span className="lines3 "></span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
export default About;
