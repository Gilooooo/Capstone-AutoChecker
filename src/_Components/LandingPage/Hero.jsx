function Hero() {
  return (
    <main className="container-fluid p-0">
      <section className="d-flex justify-content-center align-items-center custom-h-landing ">
        <div className="col-sm-10 col-md-11 col-lg-9 px-md-3 px-1 position-absolute text-center opacity-100 custom-shadow-2">
          <h1 className="custom-white-color custom-display fw-bold text-break">
            ONLINE
            TEST PAPER
            <br/>
            CHECKER
          </h1>
          <span className="fs-4 custom-white-color fw-light">
             Simple and Compact.
          </span>
        </div>
        <img
          src="/HEROweb.jpg"
          alt="IMAGE"
          className="image-fluid p-0 custom-h-image"
        />
      </section>
    </main>
  );
}
export default Hero;
