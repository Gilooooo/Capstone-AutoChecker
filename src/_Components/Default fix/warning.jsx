"use client";

import React, { useState } from "react";
function Warning() {
  const [warning, setWarning] = useState(false);
  React.useEffect(() => {
    const trys = () => {
      if (window.innerWidth <= 530) {
        setWarning(true);
      } else {
        setWarning(false);
      }
    };
    trys();
    window.addEventListener("resize", trys);
    return () => {
      window.removeEventListener("resize", trys);
    };
  }, []);

  return (
    <>
      {warning && (
        <div className="d-block modal bg-danger" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle"></i> Warning{" "}
                </h5>
              </div>
              <div className="modal-body">
                <p className="text-center">Restricted for Mobile view!</p>
              </div>
              <div className="d-flex justify-content-center modal-footer w-100"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Warning;
