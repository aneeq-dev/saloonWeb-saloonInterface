import React, { useState, useEffect } from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import store2 from "../redux/store2";
import NavBar from "./navbar";
import { Button } from "react-bootstrap";
import axios from "axios";
import PersonalInfo from "./PersonalInfo";
import ip from "../ipadd/ip";
function Settings(props) {
  const [accountSettingsDisplay, setAccountSettingsDisplay] = useState(false);
  const [accountSettingsDisplay2, setAccountSettingsDisplay2] = useState(false);
  const [accountSettingsDisplay3, setAccountSettingsDisplay3] = useState(false);
  const [logiN, setLogiN] = useState(false);
  const [signUP, setSignUP] = useState(false);
  const [switchoff, setSwitchOff] = useState(false);
  const [showed, setShowed] = useState(false);
  const [i, seti] = useState(1);
  const screenNumber = props.match.params.screenNumber;

  const [status, setStatus] = useState(null);

  const saloonInitialData = async () => {
    // let storestate = store.getState();
    //console.log("mkm ",id);
    if (localStorage.getItem("loginkeysasa")) {
      try {
        const { data: responseJson } = await axios.get(
          ip + "/api/customers/getCustomerDataForChange2",
          {
            headers: {
              "x-auth-token": localStorage.getItem("loginkeysasa"),
            },
          }
        );
        if (!responseJson) {
          console.log("no saloon data found");
        } else {
          setStatus(responseJson.saloonStatus);
        }
      } catch (ex) {
        console.log(ex);
      }
    } else {
      //do no
    }
    //console.log(responseJson);
    // setLoading(false);
  };

  useEffect(
    () => {
      //getRating();
      saloonInitialData();
    }
    //  query for fetching category 2 server data
  );

  useEffect(() => {
    if (store2.getState.length === 0 || store2.getState()[0].logged) {
      setSwitchOff(true);
      setShowed(true);
    } else {
      setSwitchOff(false);
      setShowed(true);
    }
  });
  // window.location.href = "/reviews/"+1;

  const signUp = () => {
    window.location.href = "/personalinfo/" + 2;
    /* props.navigation.navigate('Personal Info', {
      screenNumber: 2,
    });*/
  };

  const login = () => {
    window.location.href = "/login/" + 2;

    /*  props.navigation.navigate('Login', {
      screenNumber: 2, // actual login selecting from menu
    });*/
  };
  const login2 = () => {
    window.location.href = "/login/" + 1;
    /*
    props.navigation.navigate('Login', {
      screenNumber: 1, // login while sign up
    });*/
  };

  const logout = async () => {
    console.log("Logout pressed");

    try {
      // const value = localStorage.getItem("token");
      await localStorage.setItem("loginkeysasa", "");

      //const customer = jwtDecode(value);
      store2.dispatch({
        type: "LOGGED IN",
        payload: {
          logged: false,
        },
      });

      window.location.href = "/login/" + 2;
      alert.show("Logged out!");
      setSwitchOff(false);
    } catch (err) {
      console.error(err);
    }
  };

  const check = () => {
    try {
      const value = localStorage.getItem("loginkeysasa");
      if (value) return true;
      else return false;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const personalinfo = () => {
    window.location.href = "/personalinfo/" + 1;

    /* props.navigation.navigate('Personal Info', {
      screenNumber: 1,
    });*/
  };

  const changepass = () => {
    if (!logiN) {
      window.location.href = "/login/" + 3;
      // window.location.href = "/passwords";

      /*props.navigation.navigate("Login", {
        screenNumber: 3, // login while change password
      });*/
    } else {
      window.location.href = "/passwords";

      //props.navigation.navigate("Passwords");
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
          {screenNumber == 1 ? (
            <div class="pos-f-t">
              <div class="" id="navbarToggleExternalContent">
                <div class="bg-dark p-4">
                  <button
                    class=" col-sm-12 bg-light "
                    style={{
                      backgroundColor: "#e3f2fd",
                      padding: "1.3%",
                      marginBottom: "1%",
                    }}
                    onClick={() => {
                      if (!logiN) {
                        login2();
                      } else {
                        personalinfo();
                      }
                    }}
                  >
                    Change Personal Info
                  </button>
                  {status === null ? null : status === "nan" ||
                    status === "rejected" ? (
                    <button
                      class=" col-sm-12 bg-light "
                      style={{ backgroundColor: "#e3f2fd", padding: "1.3%" }}
                      onClick={() => {
                        if (localStorage.getItem("loginkeysasa")) {
                          window.location.href = "/applyforconf";
                        } else {
                          login2();
                        }
                      }}
                    >
                      Apply For Confimation
                    </button>
                  ) : (
                    <div className="alert alert-primary">
                      {status === "confirming"
                        ? " Profile already confirming! No need to apply again. If needed, we will come back to you, to re-apply. For now, wait until the upper status says to re apply."
                        : "Profile confirmed!"}
                    </div>
                  )}
                </div>
              </div>
              <nav
                class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0"
                style={{ marginBottom: "2.5%" }}
              >
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarToggleExternalContent"
                  aria-controls="navbarToggleExternalContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <h5
                  className="mr-auto mt-2 mt-lg-0"
                  style={{ paddingLeft: "2%", color: "white" }}
                >
                  Account Settings
                </h5>
              </nav>
            </div>
          ) : null}

          {screenNumber == 2 ? (
            <div class="pos-f-t">
              <div class="" id="navbarToggleExternalContent2">
                <div class="bg-dark p-4">
                  {!check() ? (
                    <button
                      class=" col-sm-12 bg-light "
                      style={{
                        backgroundColor: "#e3f2fd",
                        padding: "1.3%",
                        marginBottom: "1.5%",
                      }}
                      onClick={() => signUp()}
                    >
                      Sign Up
                    </button>
                  ) : null}

                  {!check() ? (
                    <button
                      class=" col-sm-12 bg-light "
                      style={{
                        backgroundColor: "#e3f2fd",
                        padding: "1.3%",
                        marginBottom: "1.5%",
                      }}
                      onClick={() => login()}
                    >
                      Login
                    </button>
                  ) : null}

                  {check() ? (
                    <button
                      class=" col-sm-12 bg-light "
                      style={{
                        backgroundColor: "#e3f2fd",
                        padding: "1.3%",
                        marginBottom: "1.5%",
                      }}
                      onClick={() => logout()}
                    >
                      Logout
                    </button>
                  ) : null}

                  <button
                    class=" col-sm-12 bg-light "
                    style={{
                      backgroundColor: "#e3f2fd",
                      padding: "1.3%",
                      marginBottom: "1.5%",
                    }}
                    onClick={() => changepass()}
                  >
                    Change Passwords
                  </button>
                </div>
              </div>
              <nav
                class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0"
                style={{ marginBottom: "2.5%" }}
              >
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarToggleExternalContent2"
                  aria-controls="navbarToggleExternalContent2"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <h5
                  className="mr-auto mt-2 mt-lg-0"
                  style={{ paddingLeft: "2%", color: "white" }}
                >
                  Security and Login
                </h5>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Settings;
