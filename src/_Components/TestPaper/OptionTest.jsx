function OptionTest({setManual, setPremade}){
return(
    <main className="text-center">
        <h2>CREATE TESTPAPER</h2>
        <section className="d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-dark p-4" onClick={setPremade}>Upload Excel</button>
            <button className="btn btn-outline-dark p-4" onClick={setManual}>Manual Create</button>
        </section>
    </main>
)
}
export default OptionTest;