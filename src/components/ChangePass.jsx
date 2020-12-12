import React, { useState } from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import { useAlert } from "react-alert";
import axios from "axios";
import joi from "joi";
import ip from "../ipadd/ip";
import jwtDecode from "jwt-decode";

function ChangePass(props) {
  const [emailorPhone, setemailorPhone] = useState("+923");
  const [PhoneOK, setPhoneOk] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordOk, setPasswordOk] = useState(true);

  const [newpassword, setNewPassword] = useState("");
  const [newpasswordOk, setNewPasswordOk] = useState(true);

  const [newpassword2, setNewPassword2] = useState("");
  const [newpassword2Ok, setNewPassword2Ok] = useState(true);

  const [isShowed2, setIsShowed2] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState("");

  const validateInput = (data) => {
    // validating phone
    data = data.toString();
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
      // console.log(error.error.details[0].message);
      setPhoneOk(false);
      setErrors(error.error.details[0].message);
      return false;
    } else {
      // console.log("ok");
      setPhoneOk(true);
      return true;
    }
  };

  const validatePassword = (data, i) => {
    // validating password
    var schema = joi.object({
      Password: joi.string().min(8).max(200).required(),
    });
    const error = schema.validate({ Password: data });
    // return error.error.details[0].message;
    if (error.error) {
      // console.log(error.error.details[0].message);
      setErrors(error.error.details[0].message);

      if (i === 1) setPasswordOk(false);
      else if (i === 2) {
        setNewPasswordOk(false);
      } else if (i === 3) {
        setNewPassword2Ok(false);
      }
      return false;
    } else {
      console.log("ok");
      if (i === 1) {
        setPasswordOk(true);
        setErrors("");

        return true;
      } else if (i === 2) {
        setNewPasswordOk(true);
        setErrors("");

        return true;
      } else if (i === 3) {
        setNewPassword2Ok(true);
        setErrors("");

        return true;
      }
    }
  };

  const validateEquality = () => {
    if (newpassword === newpassword2) {
      setErrors("");
      return true;
    } else {
      setNewPasswordOk(false);
      setNewPassword2Ok(false);
      setErrors("Password Not Matched Correctly, re-type same passwords!");
      return false;
    }
  };

  const alert = useAlert();

  const updatePassword = async () => {
    var obj = {
      phoneNumber: emailorPhone,
      oldPassword: password,
      newPassword: newpassword,
    };

     console.log(obj);

    try {
      const value = localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.put(
         ip + '/api/saloon/updateSaloonPassword',
        obj,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      //console.log("res: ",responseJson);
      // console.log('response: ', responseJson);
      //  const responseJson=response.data;

      if (!responseJson) {
        // do nothing
        alert.show(
          "Information cannot be updated, please be sure the following\n1- Have active internet connection\n2- Correct Updation data \n3- Logged into your account"
        );
      } else {
        alert.show("Thank you for updating your information.");
        window.location.href = "/settings/1";
      }
    } catch (ex) {
      setErrors(ex.response.data);
      // setErrors(ex.response.data);
    }
  };

  const setCustomerMobileNum = async () => {
    try{
    const value = localStorage.getItem("loginkeysasa");
    // console.log('value is: ', value);
    if (value) {
      const customer = jwtDecode(value);
      setemailorPhone(customer.phoneNumber);
    } else {
      window.location.href = "/login/3";
    }
    setLoading(false);
  }catch(ex){
    console.log(ex);
  }
  };

  {
    if (!isShowed2) {
      setCustomerMobileNum();
      setIsShowed2(true);
    }
  }

  const changepassword = () => {
    if (
      validateInput(emailorPhone) &&
      validatePassword(password, 1) &&
      validatePassword(newpassword, 2) &&
      validatePassword(newpassword2, 3) &&
      validateEquality()
    ) {
      // query for signing in and recieving promise
      updatePassword();
    } else {
      console.log("no ok");
    }
  };

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
            <a class="navbar-brand">Change Passwords</a>
          </nav>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Mobile Number
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="+923910000000"
              onChange={(n) => {
                //console.log(n.target.value);
                setemailorPhone(n.target.value);
                validateInput(n.target.value);
              }}
              value={emailorPhone}
              maxLength={13}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: PhoneOK ? "black" : "red",
              }}
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
              Old Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(n) => {
                setPassword(n.target.value);
                validatePassword(n.target.value, 1);
              }}
              maxLength={50}
              style={{
                borderWidth: 1,
                marginLeft: "4%",
                borderRadius: 20,
                width: "75%",
                borderColor: passwordOk ? "black" : "red",
              }}
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
              New Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Enter New Password here..."
              value={newpassword}
              onChange={(n) => {
                setNewPassword(n.target.value);
                validatePassword(n.target.value, 2);
              }}
              maxLength={50}
              style={{
                borderWidth: 1,
                marginLeft: "4%",
                borderRadius: 20,
                width: "75%",
                borderColor: newpasswordOk ? "black" : "red",
              }}
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
              Re-type New Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Re-type New Password here..."
              value={newpassword2}
              onChange={(n) => {
                setNewPassword2(n.target.value);
                validatePassword(n.target.value, 3);
              }}
              maxLength={50}
              style={{
                borderWidth: 1,
                marginLeft: "4%",
                borderRadius: 20,
                width: "75%",
                borderColor: newpassword2Ok ? "black" : "red",
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
              marginTop: "2%",
            }}
            onClick={() => {
              changepassword();
            }}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePass;
