import Link from "next/link";

function HeaderLanding(){
    return(
        <header className="navbar navbar-expand-lg position-relative w-100 p-0">
            <div className="d-flex flex-column custom-red w-100 py-3 px-4">
                <div className="d-flex justify-content-between custom-shadow position-absolute">
                    <img src="/TUPC.svg" alt="TUPC"/>
                </div>   
                <div className="d-flex flex-column align-self-end">
                        <Link href={"/Login/Registration"} className="custom-white-color text-end text-decoration-none" ><span >Register Now</span></Link>
                        <span className="custom-black-color fw-bold">Have an Account? <Link href={"/Login"} className="custom-white-color fw-normal text-decoration-none"><span >Login Here</span></Link></span>
                    </div>
                
            </div>
        </header>
    )
}
export default HeaderLanding;