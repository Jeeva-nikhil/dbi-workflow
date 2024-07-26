import React from "react";
function Footer(){
    return(
        <>
        <footer className="footer">
          <div className="container">
            <div className="row align-items-center flex-row-reverse">
              <div className="col-md-12 col-sm-12 text-center">
                Copyright © <span id="year" />{" "}
                <a href="#">DIETARY BUSINESS INTELLIGENCE LLC</a>.
                All rights reserved.
              </div>
            </div>
          </div>
        </footer>
        </>
    );
}
export default Footer;