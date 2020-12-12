import React, { useEffect, useState } from "react";

import { useAlert } from "react-alert";
import ip from "../ipadd/ip";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import joi from "joi";
import { Button } from "react-bootstrap";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";

function EntertainApp(props) {
  const [code, setcode] = useState(0);
  const [codeOk, setcodeok] = useState(true);
  const [errors, setErrors] = useState("");

  const app_ID = props.match.params.app_ID;

  const alert = useAlert();

  const validateInput = (data) => {
    // validating phone
    var schema = joi.object({
      code: joi.string().min(2).max(2).required(),
    });
    const error = schema.validate({ code: data });
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      console.log(error.error.details[0].message);
      setcodeok(false);
      return false;
    } else {
      console.log("ok");
      setcodeok(true);
      return true;
    }
  };

  const check = async () => {
    setErrors("");
    if (validateInput(code)) {
      console.log("yes its ok");

      // query for signing in and recieving promise

      let obj = { code: code, date: Date.now };
      console.log(obj);
      try {
        const value = await localStorage.getItem("loginkeysasa");
        console.log(value);

        const { data: responseJson } = await axios.put(
          ip +
            "/api/appointments/checkCodeAndCompleteAppointment?app_ID=" +
            app_ID,
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        console.log(responseJson);
        //console.log("res",responseJson);
        if (!responseJson) {
          // do nothing
          alert.show("Code Validation Unsuccessful!");
        } else {
          alert.show("Code Validated Successfully!");

          window.location.href = "/appointments/2";
        }
      } catch (ex) {
        setErrors(ex.response.data);

        console.log(ex);
      }
    }
  };

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "2%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">Entertain Appointment</a>
          </nav>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Enter Code Number told by Customer
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter code here..."
              onChange={(n) => {
                //console.log(n.target.value);
                setcode(n.target.value);
                validateInput(n.target.value);
              }}
              value={code}
              maxLength={13}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: codeOk ? "black" : "red",
              }}
            />
          </div>

          {errors ? (
            <div
              class="alert alert-danger"
              role="alert"
              style={{ width: "75%", marginLeft: "4%", borderRadius: 50 }}
            >
              {errors}
            </div>
          ) : null}

          <button
            class="btn btn-dark"
            style={{
              marginLeft: "4%",
              marginBottom: "4%",
              padding: "1%",
              paddingRight: "3%",
              paddingLeft: "3%",
              borderRadius: 50,
              marginTop: "2%",
            }}
            onClick={() => {
              check();
            }}
          >
            Entertain Appointment
          </button>

          <span style={{ margin: "24em" }}></span>
        </div>
      </div>
    </div>
  );
}

export default EntertainApp;
