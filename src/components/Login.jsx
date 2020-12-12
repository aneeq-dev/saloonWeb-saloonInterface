import React, { useState } from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import joi from "joi";
import ip from "../ipadd/ip";
import { useAlert } from "react-alert";
import SaloonProfile from "./SaloonProfile";
import NavBar from "./navbar";
import store2 from "../redux/store2";
import axios from "axios";

function Login(props) {
  const [phone, setphone] = useState("+923");
  const [password, setPassword] = useState("");
  const [phoneOk, setPhoneOk] = useState(false);
  const [passwordOk, setPasswordOk] = useState(false);
  const [errors, setErrors] = useState("");

  const screenNumber = props.match.params.screenNumber;

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
      //console.log(error.error.details[0].message);
      setPhoneOk(false);
      setErrors(error.error.details[0].message);
      return false;
    } else {
      console.log("ok");
      setPhoneOk(true);
      setErrors("");
      return true;
    }
  };

  const validateInput2 = (data) => {
    // validating password
    var schema = joi.object({
      Password: joi.string().min(8).max(200).required(),
    });
    const error = schema.validate({ Password: data });
    // return error.error.details[0].message;
    if (error.error) {
      //console.log(error.error.details[0].message);
      setErrors(error.error.details[0].message);
      setPasswordOk(false);
      return false;
    } else {
      console.log("ok");
      setPasswordOk(true);
      setErrors("");

      return true;
    }
  };

  const signin = async () => {
    //console.log('store stata: ', store.getState());
    // console.log('store stata: ', store2.getState());

    if (validateInput(phone) && validateInput2(password)) {
      console.log("yes its ok");

      // query for signing in and recieving promise
      var obj = {
        phoneNumber: phone,
        password: password,
      };

      try {
        const { data: responseJson } = await axios.post(
          ip + "/api/auth/loginSaloons",
          obj
        );
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show(
            "Sign up was not successful, please be sure the following \n1- Have active internet\n2- Correct Registration data"
          );
        } else {
          console.log("fff: ", responseJson);
          try {
            await localStorage.setItem("loginkeysasa", responseJson);

           // NavBar.updateMe(responseJson);

            store2.dispatch({
              type: "LOGGED IN",
              payload: {
                logged: true,
              },
            });
          } catch (error) {
            // console.log('AsyncStorage Error: ' + error.message);
          }
          

          console.log("screen: ",screenNumber);
          if (screenNumber == 1) {
            // changing personal info

            alert.show("You can proceed to Update Personal Info!");
            window.location.href = "/personalinfo/" + 1;
            /* props.navigation.navigate("Personal Info", {
              screenNumber: 1,
            });*/
          } else if (screenNumber == 2) {
            // actual login
            console.log("here")
            // query for signing in + on recieving promise
            alert.show("You can proceed to use the application ");
            window.location.href = "/";

            /* props.navigation.navigate("      ", {
              screenNumber: 1,
            });*/
          } else if (screenNumber == 3) {
            // actual login
            // query for signing in + on recieving promise
            alert.show("You can proceed to Change Passwords ");
            window.location.href = "/passwords";

            // props.navigation.navigate("Passwords");
          } else if (screenNumber == 4) {
            // actual login
            // query for signing in + on recieving promise
            alert.show("You can proceed to use the application");

            window.location.href = "/";

          }
          else if(screenNumber==5){
            alert.show("You can now proceed to your appointments");
            window.location.href ="/appointments/1"
          }
          else{
              console.log("no screen");
          }
        }
      } catch (ex) {
        //console.log(ex.response.data);
        if (ex.response === undefined) {
          console.log(ex);
        } else {
          setErrors(ex.response.data);
        }
      }

      console.log("sign in pressed");
    } else {
      console.log("no its not");
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
            <a class="navbar-brand">Login </a>
          </nav>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Phone Number
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
          <div class="form-group">
            <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(n) => {
                setPassword(n.target.value);
                validateInput2(n.target.value);
              }}
              maxLength={200}
              style={{
                borderWidth: 1,
                marginLeft: "4%",
                borderRadius: 20,
                width: "75%",
                borderColor: passwordOk ? "black" : "red",
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
            class="btn btn-primary"
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
              signin();
            }}
          >
            Sign In
          </button>

          <span style={{ margin: "24em" }}></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
