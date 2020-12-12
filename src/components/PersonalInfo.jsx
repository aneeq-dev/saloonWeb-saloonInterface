import React, { useEffect, useState } from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import store2 from "../redux/store2";
import axios from "axios";
import joi from "joi";
import ip from "../ipadd/ip";
import { useAlert } from "react-alert";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

function PersonalInfo(props) {
  const screenNumber = props.match.params.screenNumber;

  const [firstName, setFirstName] = useState("");
  const [firstNameOk, setFirstNameOk] = useState(true);

  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("+923");
  const [phoneOk, setPhoneOk] = useState(true);

  const [gender, setGender] = useState("male");

  const [emailID, setEmailID] = useState("");
  const [emailIDok, setEmailIDok] = useState(true);

  const [password, setPass] = useState("");
  const [passwordOk, setPassOk] = useState(true);

  const [isShowed, setIsShowed] = useState(false);
  const [isShowed2, setIsShowed2] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState("");

  const [PersonalInfo, setPersonalInfo] = useState([]);

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
      setErrors(error.error.details[0].message);
      setPhoneOk(false);
      return false;
    } else {
      // console.log("ok");
      setErrors("");
      setPhoneOk(true);
      return true;
    }
  };

  const validateInputEmail = (data) => {
    // validating phone
    if (data === "") {
      setEmailIDok(true);
      return true;
    } else {
      var schema = joi.object({
        email: joi
          .string()
          .regex(
            /^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
          ),
      });
      const error = schema.validate({ email: data });

      if (error.error) {
        console.log(error.error.details[0].message);
        setEmailIDok(false);
        setErrors("Email not correct!");
        return false;
      } else {
        console.log("email ok");
        setErrors("");
        setEmailIDok(true);
        return true;
      }
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
      setErrors(error.error.details[0].message);
      setFirstNameOk(false);
      return false;
    } else {
      console.log("ok");
      setErrors("");
      setFirstNameOk(true);
      return true;
    }
  };


  const validatePassword = data => {
    // validating password
    var schema = joi.object({
      Password: joi
        .string()
        .min(8)
        .max(200)
        .required(),
    });
    const error = schema.validate({Password: data});
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);
      setPassOk(false);
      return false;
    } else {
      setErrors("");
      console.log('ok');
      setPassOk(true);
      return true;
    }
  };

  const populate = () => {
    console.log('personal info', PersonalInfo);
    if (PersonalInfo.length === 0) {
    } else {
      setFirstName(PersonalInfo[0].saloonName);
      setPhoneNum(PersonalInfo[0].phoneNumber);
      setEmailID(PersonalInfo[0].email);
      setGender(PersonalInfo[0].saloonGender);
      setPass('dummypassword');
    }
    //  setIsShowed2(true)
  };

  useEffect(() => {
    //console.log(PersonalInfo);
    populate();
  }, [PersonalInfo]);

  const getSaloonData = async () => {
    setLoading(true);
    try {
      const value = await localStorage.getItem('loginkeysasa');

      const {data: responseJson} = await axios.get(
         ip + '/api/saloon/getSaloonDataForChange',
        {
          headers: {
            'x-auth-token': value,
          },
        },
      );
      if (!responseJson) {
        // do nothing
        //console.log("s: ",responseJson)
      } else {
        console.log('rec:', responseJson);
        setPersonalInfo([responseJson]);
      }
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  {
    if (screenNumber == 1 && !isShowed2) {
      getSaloonData();
      setIsShowed2(true);
    } else if (!isShowed2) {
      setLoading(false);
      setIsShowed2(true);
    }
  }

  const updateUser = async () => {
    // update query and on recieving promise
    //setPass("11111111");
    if (
      validateInput(phoneNum) &&
      validateInputEmail(emailID) &&
      validateInputName(firstName) &&
      validatePassword('password')
    ) {
      var obj = {
        saloonName: firstName,
        saloonGender: gender,
        phoneNumber: phoneNum,
        email: emailID,
        saloonPassword: password,
      };

      try {
        const value = await localStorage.getItem('loginkeysasa');

        const response = await axios.put(
           ip + '/api/saloon/updateBasicSaloon',
          obj,
          {
            headers: {
              'x-auth-token': value,
            },
          },
        );
        //console.log("res: ",responseJson);
        //console.log('response: ', response);
        const responseJson = response.data;

        if (!responseJson) {
          // do nothing
          alert.show("Information Not Updated!");
        
        } else {
          console.log('res: ', responseJson);

          const header = response.headers['x-auth-token'];
          // console.log("header: ",header);
          try {
            await localStorage.setItem('loginkeysasa', header);
          } catch (error) {
            console.log('AsyncStorage Error: ' + error);
          }

          alert.show("Information Updated Successfully!");
         
          window.location.href="/settings/1";
        }
      } catch (ex) {
        //console.log(ex.response.data);
        setErrors(ex.response.data);
      }
    } else {
      console.log('not ok');
    }
  };

  const signUpUser = async () => {
    //console.log(validateInput(phoneNum));
    //console.log("Sign Up query");
    // sign up query and on recieving promise
    if (
      validateInput(phoneNum) &&
      validateInputEmail(emailID) &&
      validateInputName(firstName) &&
      validatePassword(password)
    ) {
      var obj = {
        saloonName: firstName,
        saloonGender: gender,
        phoneNumber: phoneNum,
        email: emailID,
        saloonPassword: password,
      };

      try {
        const response = await axios.post(
           ip + '/api/saloon/saveSaloon',
          obj,
        );
        //console.log();
        if (!response.data) {
          alert.show("Sign up Unsuccessful!");
       
        } else {
          //console.log("Appointment registered: ",responseJson);
          try {
            await localStorage.setItem(
              'loginkeysasa',
              response.headers['x-auth-token'],
            );
          } catch (error) {
            console.log('AsyncStorage Error: ' + error);
          }
          alert.show("Sign Up Successful!");
          window.location.href="/login/2";
          
        }
      } catch (ex) {
        //console.log(ex.response.data);
        setErrors(ex.response.data);
      }
    } else {
      console.log('not ok');
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
            <a class="navbar-brand">
              {screenNumber == 1 ? "Change Personal Info" : "Sign Up"}
            </a>
          </nav>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
            Saloon Name *
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Full Name here..."
              onChange={(n) => {
                //console.log(n.target.value);
                setFirstName(n.target.value);
                validateInputName(n.target.value);
              }}
              value={firstName}
              maxLength={200}
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
            Saloon Phone Number *
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="+923910000000"
              onChange={(n) => {
                //console.log(n.target.value);
                setPhoneNum(n.target.value);
                validateInput(n.target.value);
              }}
              value={phoneNum}
              maxLength={13}
              disabled={screenNumber == 1 ? "disabled" : null}
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
            <label  style={{ marginLeft: "4%" }}>
              Email ID
            </label>
            <input
              class="form-control"
              type="email"
              placeholder="john@example.com"
              onChange={(n) => {
                //console.log(n.target.value);
                setEmailID(n.target.value);
                validateInputEmail(n.target.value);
              }}
              value={emailID}
              maxLength={90}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: emailIDok ? "black" : "red",
              }}
            />
          </div>
          <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
            Saloon Gender
          </label>
          <div
            className="bg-dark form-group"
            style={{
              paddingLeft: "2em",

              borderWidth: 3,
              textAlign: "center",
              borderRadius: 50,
              borderColor: "black",
              marginLeft: "4%",
              width: "75%",
            }}
          >
            <DropdownButton id="dropdown-basic-button" title={gender}>
              <Dropdown.Item
                onClick={() => {
                  setGender("male");
                }}
              >
                Male
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setGender("female");
                }}
              >
                Female
              </Dropdown.Item>
            </DropdownButton>
          </div>
          {screenNumber == 2 ? ( //if screen is sign up then show
            <div class="form-group">
              <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Enter Password"
                value={password}
                onChange={(n) => {
                  setPass(n.target.value);
                  validatePassword(n.target.value);
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
          ) : null}

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
                updateUser();
              } else {
                signUpUser();
              }
            }}
          >
            {screenNumber == 1 ? "Update " : "Sign Up"}
          </button>

          <span style={{ margin: "24em" }}></span>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
