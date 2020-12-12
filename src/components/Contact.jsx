import React, { useState } from "react";
import { FormText } from "react-bootstrap";
import SideMenu from "./side_menu";
import "../index.css";
import MainGui from "./MainGui";
import ip from "../ipadd/ip";
import axios from "axios";
function Contact(props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [isShowed, setisShowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(true);

  const getContactInfo = async () => {
    try {
      const { data: responseJson } = await axios.get(
        ip + "/api/category/getHelpData"
      );
      if (responseJson === 0 || responseJson === undefined) {
        setPhoneNumber("");
        setEmail("");
      } else {
        console.log(responseJson);
        setPhoneNumber(responseJson.helpNo);
        setEmail(responseJson.helpEmail);
      }
    } catch (ex) {
      console.error(ex);
    }
    setRef(false);
  };

  if (!isShowed) {
    // query for getting number and email from db
    getContactInfo();
    setisShowed(true);
    setLoading(false);
  }

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "1%" }}>
          <nav
            className="navbar navbar-expand-lg navbar-dark bg-dark"
            style={{ marginBottom: "1.5%", paddingLeft: "4%" }}
          >
            <div className="navbar-text text-white">
              <h5>Contact Us</h5>
            </div>
          </nav>
          <div style={{marginLeft:"4%",padding:"3%"}} className="bg-light">

            <h3 style={{marginBottom:"1%"}}>Contact us on following number: </h3>
            <br/>

            <h5 style={{color:"blue"}}>{phoneNumber}</h5>
            <br/>
          </div>
          <div style={{marginLeft:"4%",padding:"3%"}} className="bg-light">

            <h3 style={{marginBottom:"1%"}}>Contact us via email at: </h3>
            <br/>

            <h5 style={{color:"blue"}}>{Email}</h5>
            <br/>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Contact;
