import React, { useState, useEffect } from "react";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import joi from "joi";

function AddStylist(props) {
  const [phone, setphone] = useState("+923");
  const [phoneOk, setPhoneOk] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [firstNameOk, setFirstNameOk] = useState(true);

  const [loading, setLoading] = useState(true);
  const [StylistInfo, setStylistInfo] = useState([]);
  const [d, setD] = useState(false);

  const stylistID = props.match.params.stylistID;
  const screenNumber = props.match.params.screenNumber;
  const [errors, setErrors] = useState("");
  const alert = useAlert();

  const validateInput = (data) => {
    // validating phone
    var schema = joi.object({
      Phone: joi
        .string()
        .min(13)
        .max(13)
        .required()
        .regex(/[+]923[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}/),
    });
    const error = schema.validate({ Phone: data });
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      console.log(error.error.details[0].message);
      setPhoneOk(false);
      setErrors(error.error.details[0].message);

      return false;
    } else {
      setErrors("");
      console.log("ok");
      setPhoneOk(true);
      return true;
    }
  };

  const validateInputName = (data) => {
    // validating phone
    var schema = joi.object({
      name: joi.string().min(4).max(50).required(),
    });
    const error = schema.validate({ name: data });
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      //console.log(error.error.details[0].message);
      setFirstNameOk(false);
      setErrors(error.error.details[0].message);
      return false;
    } else {
      console.log("ok");
      setFirstNameOk(true);
      setErrors("");

      return true;
    }
  };

  const addStylist = async () => {
    if (validateInput(phone) && validateInputName(firstName)) {
      let obj = { stylistName: firstName, phoneNumber: phone };
      try {
        const value = await localStorage.getItem("loginkeysasa");

        const { data: responseJson } = await axios.post(
          ip + "/api/stylist/saveStylist",
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //console.log("res",responseJson);
        if (!responseJson) {
          // do nothing
          alert.show("Stylist Addition was Unsuccessful!");
        } else {
          alert.show("Stylist Added Successfully!");
          window.location.href = "/saloonStylists";
        }
      } catch (ex) {
        setErrors(ex.response.data);

        //console.log(ex);
      }
    }
    setLoading(false);
  };

  const updateStylist = async () => {
    if (validateInput(phone) && validateInputName(firstName)) {
      let obj = { stylistName: firstName, phoneNumber: phone };
      try {
        const value = await localStorage.getItem("loginkeysasa");

        const { data: responseJson } = await axios.put(
          ip +
            "/api/stylist/updateStylist?stylistID=" +
            props.match.params.stylistID,
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show("Stylist Updated was Unsuccessful!");
        } else {
          alert.show("Stylist Updated Successfully!");
          window.location.href = "/saloonStylists";
        }
      } catch (ex) {
        setErrors(ex.response.data);
      }
    }
    setLoading(false);
  };

  const getStylistInfo = async () => {
    setLoading(true);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/stylist/getStylistInfo?stylistID=" +
          props.match.params.stylistID,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      if (!responseJson) {
      } else {
        setStylistInfo(responseJson);
      }
    } catch (ex) {
      console.error(ex);
    }
    setLoading(false);
  };

  if (loading && !d) {
    if (localStorage.getItem("loginkeysasa")) {
      if (props.match.params.screenNumber == 2) {
        getStylistInfo();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
      window.location.href = "/login/4";
    }

    setD(true);
  }

  const populate = () => {
    if(!localStorage.getItem("loginkeysasa")){
      window.location.href="/login/4";
    }
    //console.log('personal info', PersonalInfo);
    if (StylistInfo.length === 0) {
    } else {
      setFirstName(StylistInfo[0].stylistName);
      setphone(StylistInfo[0].phoneNumber);
    }
    //  setIsShowed2(true)
  };

  useEffect(() => {
    // console.log(StylistInfo);
    populate();
  }, [StylistInfo]);

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10" style={{ marginLeft: "2.5%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">
              {screenNumber == 1 ? "Add Stylist" : "Update Stylist"}{" "}
            </a>
          </nav>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Stylist Name:
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Stylist Name here..."
              onChange={(n) => {
                //console.log(n.target.value);
                setFirstName(n.target.value);
                validateInputName(n.target.value);
              }}
              value={firstName}
              maxLength={13}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: firstNameOk ? "black" : "red",
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Stylist Phone Number
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="+923910000000"
              onChange={(n) => {
                //console.log(n.target.value);
                setphone(n.target.value);
                validateInput(n.target.value);
              }}
              value={phone}
              maxLength={13}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: phoneOk ? "black" : "red",
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
              borderRadius: 50,
              padding:"1%",
              paddingLeft:"3%",
              paddingRight:"3%",
              marginTop: "2%",
            }}
            onClick={() => {
              if (screenNumber == 1) {
                addStylist();
              } else if (screenNumber == 2) {
                updateStylist();
              }
            }}
          >
            {screenNumber == 1 ? "Add Stylist" : "Update Stylist"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStylist;
