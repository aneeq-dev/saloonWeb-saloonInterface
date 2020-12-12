import React, { useEffect, useState } from "react";
import { Button, FormText } from "react-bootstrap";
import ip from "../ipadd/ip";
import { useAlert } from "react-alert";
import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import { Alert } from "bootstrap";

function Appointments(props) {
  const [loading, setLoading] = useState(true);
  const [ref, setRef] = useState(true);
  const [d, setD] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [keyCh, setkeyCh] = useState(1);
  const [history, setHistory] = useState(false);
  const [RegisteredAppointments, setRegisteredAppointments] = useState([]);
  const [HistoryAppointments, setHistoryAppointments] = useState([]);
  const [m, setm] = useState([]);
  const screenNumber = props.match.params.screenNumber;

  const alert = useAlert();

  // will sort items wrt active or not
  function compare(a) {
    // console.log(a);
    if (a.status === "Completed") return 1;
    if (a.status === "Confirming" || a.status === "Confirmed") return -1;
    return 0;
  }

  if (
    !(
      HistoryAppointments.length === 0 ||
      HistoryAppointments.length === undefined
    ) &&
    !loading
  ) {
    HistoryAppointments.sort(compare);
  } else if (HistoryAppointments.length === undefined) {
    setHistoryAppointments([]);
  }

  useEffect(() => {
    _onRefresh();
  }, [props.match.params.screenNumber]);

  const registeredQuery = async () => {
    setLoading(true);
    setRef(true);
    // frst clear out the array to zero item
    // here goes your query, fetching the registered appointments wrt to users id, registered are those which are
    // confirming and confirmed appointments,
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getRegAppointmentsSaloon",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      //console.log("njn: ",responseJson);
      if (responseJson === 0 || responseJson === undefined) {
        alert.show(
          "We didn't find any registered appointments for your account..."
        );
        setRegisteredAppointments([]);
        // do nothing
      } else {
        setRegisteredAppointments(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }
    setHistory(false);
    setRegistered(true);
    setRef(false);
    setLoading(false);
    //  console.log("presses")
  };

  /* useEffect(()=>{
    if (localStorage.getItem("loginkeysasa")) {
      registeredQuery();
    } else {
      setLoading(false);

      window.location.href = "/login/5";
      props.navigation.navigate("Login", {
        screenNumber: 4, // login while change password
      });
    }
  },[d]);
 if (loading && !d) {
    //console.log("gh: ", store2.getState()[0].logged);
    
    setD(true);
  }*/

  const historyQuery = async () => {
    // setLoading(true);
    setRef(true);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getHisAppointmentsSaloon",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      console.log("mmm: ", responseJson);
      if (responseJson === 0 || responseJson === undefined) {
        alert.show(
          "We didn't find any registered appointments for your account"
        );
        setHistoryAppointments([]);
      } else {
        setHistoryAppointments(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }
    // here goes your query, fetching the registered appointments wrt to users id, active as well as not active
    setRegistered(false);
    setHistory(true);
    setLoading(false);
    setRef(false);
  };

  const cancelApp = async (appointmentID) => {
    // OPTIMISTIC APPROACH - remove item from array
    //setLoading(true);
    var item;
    for (var i = 0; i < HistoryAppointments.length; i++) {
      if (HistoryAppointments[i]._id === appointmentID) {
        item = HistoryAppointments.splice(i, 1);
      }
    }
    for (var i = 0; i < RegisteredAppointments.length; i++) {
      if (RegisteredAppointments[i]._id === appointmentID) {
        item = RegisteredAppointments.splice(i, 1);
      }
    }

    setHistoryAppointments(HistoryAppointments);
    setRegisteredAppointments(RegisteredAppointments);
    setkeyCh(Math.random());
    //console.log(item); // keep record of removed item

    const obj = {};

    // here goes query for cancelling the appointment wrt to appointment id  and users id
    try {
      const value = await localStorage.getItem("loginkeysasa");
      console.log("mkmkmkmmmmkmmk: ", value);
      const { data: responseJson } = await axios.put(
        ip + "/api/appointments/cancelTheApp?appointmentID=" + appointmentID,

        obj,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        // do nothing

        //  console.log("nothing");
        alert.show("Appointment Not Cancelled!");

        if (screenNumber == 1) {
          if (localStorage.getItem("loginkeysasa")) {
            registeredQuery();
          } else {
            //setLoading(false);
            window.location.href = "/login/4";
          }
        } else {
          {
            if (localStorage.getItem("loginkeysasa")) {
              historyQuery();
            } else {
              setLoading(false);
              window.location.href = "/login/4";
            }
          }
        }

        setHistoryAppointments([...HistoryAppointments, ...item]);
        setRegisteredAppointments([...RegisteredAppointments, ...item]);
      } else {
        alert.show("Appointment Cancelled!");
      }
    } catch (ex) {
      console.log(ex);
      console.log(ex.response.data);
    }

    setLoading(false);
  };

  const cancelApp2 = async (appointmentID) => {
    // here goes query for cancelling the appointment wrt to appointment id  and users id
    try {
      const value = await localStorage.getItem("loginkeysasa");
      const obj = {};
      const { data: responseJson } = await axios.put(
        ip +
          "/api/appointments/cancelTheAppAfterConfirmOwner?appointmentID=" +
          appointmentID,
        obj,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (responseJson.length === 0 || responseJson === undefined) {
        // do nothing
        alert.show("Appointment didn't cancelled successfully!");
        //  console.log("nothing");

        if (screenNumber == 1) {
          if (localStorage.getItem("loginkeysasa")) {
            registeredQuery();
          } else {
            //setLoading(false);
            window.location.href = "/login/5";
          }
        } else {
          {
            if (localStorage.getItem("loginkeysasa")) {
              historyQuery();
            } else {
              setLoading(false);

              window.location.href = "/login/5";
            }
          }
        }
      } else {
        alert.show("Appointment has been cancelled.");
        if (screenNumber == 1) {
          registeredQuery();
        } else {
          historyQuery();
        }
        //window.location.href = "/appointments/1";
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
    // on recieving promise

    //console.log(HistoryAppointments);
    setLoading(false);
  };

  const _onRefresh = () => {
    setRef(true);
    if (screenNumber == 1) {
      //console.log(store2.getState()[0].logged);
      if (localStorage.getItem("loginkeysasa")) {
        registeredQuery().then(() => {
          setRef(false);
        });
      } else {
        //setLoading(false);
        window.location.href = "/login/5";
      }
    } else {
      if (localStorage.getItem("loginkeysasa")) {
        historyQuery().then(() => {
          setRef(false);
        });
      } else {
        //setLoading(false);
        window.location.href = "/login/5";
      }
    }
  };

  const check = async () => {
    try {
      const value = await localStorage.getItem("loginkeysasa");
      if (value) return true;
      else return false;
    } catch (ex) {
      console.log(ex);
      return false;
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
              {screenNumber == 1
                ? "New Registered Appointments"
                : "Past Appointments "}
            </a>
          </nav>

          <div style={{ marginLeft: "4%" }}>
            {loading ? (
              <ActivityIndicator />
            ) : screenNumber == 1 ? (
              RegisteredAppointments.length === 0 ||
              RegisteredAppointments === undefined ? (
                <div>
                  <h5>No Registered Appointments found!</h5>
                  <p>
                    Note: Registered appointments includes Confirming and
                    Confirmed Appointments Only!
                  </p>
                </div>
              ) : null
            ) : HistoryAppointments.length === 0 ||
              HistoryAppointments === undefined ? (
              <div>
                <h5>No History Appointments found!</h5>
                <p>
                  Note: History appointments includes all appointments you
                  registered in past!
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <div className="col col-sm-10">
              <div className="row col-lg-12" style={{ marginBottom: "2%" }}>
                {loading
                  ? null
                  : (screenNumber == 1 &&
                    !(
                      RegisteredAppointments.length === 0 ||
                      RegisteredAppointments === undefined
                    )
                      ? RegisteredAppointments
                      : screenNumber == 2 &&
                        !(
                          HistoryAppointments.length === 0 ||
                          HistoryAppointments === undefined
                        )
                      ? HistoryAppointments
                      : m
                    ).map((appointment, j) =>
                      appointment.saloonID === null ? null : (
                        <div
                          className="card col-md-5"
                          style={{
                            marginLeft: "2%",
                            marginBottom: "4%",
                            marginRight: "5%",
                          }}
                          key={j}
                        >
                          {console.log("app: ", appointment)}
                          <div className="card-body">
                            {appointment.status === "Confirming" ? (
                              <div
                                style={{
                                  backgroundColor: "skyblue",
                                  fontSize: 13,
                                  padding: 5,
                                  borderRadius: 50,
                                  margin: "1%",
                                  marginTop: "10%",
                                }}
                              >
                                <h5
                                  style={{ textAlign: "center", padding: "2%" }}
                                >
                                  Appointment needs confirmation!
                                </h5>
                              </div>
                            ) : appointment.status === "Confirmed" ? (
                              <div
                                style={{
                                  backgroundColor: "darkgreen",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{
                                    textAlign: "center",
                                    color: "white",
                                    padding: "2%",
                                  }}
                                >
                                  Appointment Confirmed
                                </h5>
                              </div>
                            ) : appointment.status === "TimeUpdate" ? (
                              <div
                                style={{
                                  backgroundColor: "orchid",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{
                                    textAlign: "center",
                                    color: "white",
                                    padding: "2%",
                                  }}
                                >
                                  Time Updated &amp; Confirmed
                                </h5>
                              </div>
                            ) : appointment.status === "NAN" ? (
                              <div
                                style={{
                                  backgroundColor: "yellow",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{ textAlign: "center", padding: "2%" }}
                                >
                                  Time Passed
                                </h5>
                              </div>
                            ) : appointment.status === "Cancelled" ? (
                              <div
                                style={{
                                  backgroundColor: "red",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{ textAlign: "center", padding: "2%" }}
                                >
                                  Cancelled
                                </h5>
                              </div>
                            ) : appointment.status === "Completed" ? (
                              <div
                                style={{
                                  backgroundColor: "grey",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{
                                    textAlign: "center",
                                    color: "white",
                                    padding: "2%",
                                  }}
                                >
                                  Appointment Completed
                                </h5>
                              </div>
                            ) : appointment.status === "Cust-Cancelled" ? (
                              <div>
                                <div
                                  style={{
                                    backgroundColor: "pink",
                                    fontSize: 13,
                                    padding: 5,
                                    marginTop: "10%",
                                    borderRadius: 50,
                                    margin: "1%",
                                  }}
                                >
                                  <h5
                                    style={{
                                      textAlign: "center",
                                      color: "black",
                                      padding: "2%",
                                    }}
                                  >
                                    Appointment Cancelled After Confirmation by
                                    Customer!
                                  </h5>
                                </div>
                                {!appointment.ratedBySaloon ? (
                                  <div
                                    class="alert alert-danger"
                                    style={{ margin: "3%" }}
                                  >
                                    Don't get upset! Just rate the customer and
                                    share your thoughts!
                                  </div>
                                ) : (
                                  <div
                                    class="alert alert-success"
                                    style={{ margin: "3%" }}
                                  >
                                    You rated the appointment! If you have any
                                    issues regarding this appointment, come
                                    contact us, we will be there!
                                  </div>
                                )}
                              </div>
                            ) : appointment.status === "Saloon-Cancelled" ? (
                              <div>
                                <div
                                  style={{
                                    backgroundColor: "#03fc9d",
                                    fontSize: 13,
                                    padding: 5,
                                    marginTop: "10%",
                                    borderRadius: 50,
                                    margin: "1%",
                                  }}
                                >
                                  <h5
                                    style={{
                                      textAlign: "center",
                                      color: "black",
                                      padding: "2%",
                                    }}
                                  >
                                    Appointment Cancelled After Confirmation by
                                    You!
                                  </h5>
                                </div>
                              </div>
                            ) : appointment.status === "Rescheduled" ? (
                              <div
                                style={{
                                  backgroundColor: "hotpink",
                                  fontSize: 13,
                                  padding: 5,
                                  marginTop: "10%",
                                  borderRadius: 50,
                                  margin: "1%",
                                }}
                              >
                                <h5
                                  style={{
                                    textAlign: "center",
                                    color: "black",
                                    padding: "2%",
                                  }}
                                >
                                  Appointment has Rescheduled by Customer &amp;
                                  again needs Confirmation!
                                </h5>
                              </div>
                            ) : null}
                          </div>
                          <nav style={{ position: "static" }}>
                            <div class="pos-f-t" style={{ width: "100%" }}>
                              <div class="collapse" id={"collapse" + j}>
                                <div class="bg-dark p-4">
                                  <ul className="list-group list-group-flush">
                                    {appointment.customerID ? (
                                      <li
                                        className="list-group-item"
                                        style={{ backgroundColor: "linen" }}
                                      >
                                        <h5>
                                          Customer Name:{" "}
                                          <span style={{ color: "blue" }}>
                                            {appointment.customerID.name}
                                          </span>{" "}
                                        </h5>
                                        {appointment.status === "Confirmed" ||
                                        appointment.status === "TimeUpdate" ? (
                                          <h5>
                                            Customer Phone Number:{" "}
                                            <span style={{ color: "blue" }}>
                                              {
                                                appointment.customerID
                                                  .phoneNumber
                                              }
                                            </span>{" "}
                                          </h5>
                                        ) : null}

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: "20px",
                                              paddingRight: "3%",
                                            }}
                                          >
                                            Customer Rating:{" "}
                                          </span>

                                          <span>
                                            <ReactStars
                                              count={5}
                                              // onChange={ratingChanged}
                                              edit={false}
                                              size={24}
                                              activeColor="#ffd700"
                                              value={
                                                appointment.customerID
                                                  .customerOverallRating
                                              }
                                            />
                                          </span>
                                          <span style={{ paddingLeft: "1%" }}>
                                            (
                                            {
                                              appointment.customerID
                                                .numOfReviews
                                            }
                                            )
                                          </span>
                                        </div>
                                      </li>
                                    ) : null}

                                    <li className="list-group-item">
                                      {appointment.status === "Confirming" ||
                                      appointment.status === "Rescheduled" ? (
                                        <div>
                                          <h5>
                                            Customer requested time and date is:
                                            <span style={{ color: "blue" }}>
                                              {" "}
                                              <br />
                                              Time:{" "}
                                              {new Date(
                                                appointment.fromtiming
                                              ).getHours() %
                                                12 ===
                                              0
                                                ? 12 + " "
                                                : (new Date(
                                                    appointment.fromtiming
                                                  ).getHours() %
                                                    12) +
                                                  " "}
                                              :
                                              {new Date(
                                                appointment.fromtiming
                                              ).getMinutes() >= 0 &&
                                              new Date(
                                                appointment.fromtiming
                                              ).getMinutes() <= 9
                                                ? "0" +
                                                  new Date(
                                                    appointment.fromtiming
                                                  ).getMinutes() +
                                                  " "
                                                : new Date(
                                                    appointment.fromtiming
                                                  ).getMinutes() + ""}
                                              {new Date(
                                                appointment.fromtiming
                                              ).getHours() /
                                                12 >=
                                              1
                                                ? " PM | "
                                                : " AM | "}
                                              Dated:{" "}
                                              {new Date(
                                                appointment.fromtiming
                                              ).getDate()}
                                              -
                                              {new Date(
                                                appointment.fromtiming
                                              ).getMonth() + 1}
                                              -
                                              {new Date(
                                                appointment.fromtiming
                                              ).getFullYear()}{" "}
                                              ('dd-mm-yyyy')
                                              <span style={{ color: "black" }}>
                                                {" "}
                                                <br />
                                                <h5
                                                  style={{
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  and{" "}
                                                </h5>{" "}
                                              </span>
                                              Time:{" "}
                                              {new Date(
                                                appointment.totiming
                                              ).getHours() %
                                                12 ===
                                              0
                                                ? 12 + " "
                                                : (new Date(
                                                    appointment.totiming
                                                  ).getHours() %
                                                    12) +
                                                  " "}
                                              :
                                              {new Date(
                                                appointment.totiming
                                              ).getMinutes() >= 0 &&
                                              new Date(
                                                appointment.totiming
                                              ).getMinutes() <= 9
                                                ? "0" +
                                                  new Date(
                                                    appointment.totiming
                                                  ).getMinutes() +
                                                  " "
                                                : new Date(
                                                    appointment.totiming
                                                  ).getMinutes() + ""}
                                              {new Date(
                                                appointment.totiming
                                              ).getHours() /
                                                12 >=
                                              1
                                                ? " PM | "
                                                : " AM | "}
                                              Dated:{" "}
                                              {new Date(
                                                appointment.totiming
                                              ).getDate()}
                                              -
                                              {new Date(
                                                appointment.totiming
                                              ).getMonth() + 1}
                                              -
                                              {new Date(
                                                appointment.totiming
                                              ).getFullYear()}{" "}
                                              ('dd-mm-yyyy')
                                            </span>
                                          </h5>
                                        </div>
                                      ) : appointment.status === "Confirmed" ||
                                        appointment.status === "TimeUpdate" ? (
                                        <div>
                                          <h5>
                                            Customer will arrive at:
                                            <span style={{ color: "blue" }}>
                                              {" "}
                                              Time:{" "}
                                              {new Date(
                                                appointment.completedDate
                                              ).getHours() %
                                                12 ===
                                              0
                                                ? 12 + " "
                                                : (new Date(
                                                    appointment.completedDate
                                                  ).getHours() %
                                                    12) +
                                                  " "}
                                              :
                                              {new Date(
                                                appointment.completedDate
                                              ).getMinutes() >= 0 &&
                                              new Date(
                                                appointment.completedDate
                                              ).getMinutes() <= 9
                                                ? "0" +
                                                  new Date(
                                                    appointment.completedDate
                                                  ).getMinutes() +
                                                  " "
                                                : new Date(
                                                    appointment.completedDate
                                                  ).getMinutes() + ""}
                                              {new Date(
                                                appointment.completedDate
                                              ).getHours() /
                                                12 >=
                                              1
                                                ? " PM | "
                                                : " AM | "}
                                              Dated:{" "}
                                              {new Date(
                                                appointment.completedDate
                                              ).getDate()}
                                              -
                                              {new Date(
                                                appointment.completedDate
                                              ).getMonth() + 1}
                                              -
                                              {new Date(
                                                appointment.completedDate
                                              ).getFullYear()}{" "}
                                              ('dd-mm-yyyy')
                                            </span>
                                          </h5>
                                        </div>
                                      ) : appointment.status === "NAN" ? (
                                        <div>
                                          <h5>
                                            Appointment Time has been Passed!
                                          </h5>
                                        </div>
                                      ) : appointment.status === "Completed" ? (
                                        <div>
                                          <h5>
                                            Your appointment had completed at:
                                            <span style={{ color: "blue" }}>
                                              {" "}
                                              Time:{" "}
                                              {new Date(
                                                appointment.completedDate
                                              ).getHours() %
                                                12 ===
                                              0
                                                ? 12 + " "
                                                : (new Date(
                                                    appointment.completedDate
                                                  ).getHours() %
                                                    12) +
                                                  " "}
                                              :
                                              {new Date(
                                                appointment.completedDate
                                              ).getMinutes() >= 0 &&
                                              new Date(
                                                appointment.completedDate
                                              ).getMinutes() <= 9
                                                ? "0" +
                                                  new Date(
                                                    appointment.completedDate
                                                  ).getMinutes() +
                                                  " "
                                                : new Date(
                                                    appointment.completedDate
                                                  ).getMinutes() + ""}
                                              {new Date(
                                                appointment.completedDate
                                              ).getHours() /
                                                12 >=
                                              1
                                                ? " PM | "
                                                : " AM | "}
                                              Dated:{" "}
                                              {new Date(
                                                appointment.completedDate
                                              ).getDate()}
                                              -
                                              {new Date(
                                                appointment.completedDate
                                              ).getMonth() + 1}
                                              -
                                              {new Date(
                                                appointment.completedDate
                                              ).getFullYear()}{" "}
                                              ('dd-mm-yyyy')
                                            </span>
                                          </h5>
                                        </div>
                                      ) : appointment.status === "Cancelled" ? (
                                        <div>
                                          <h5>
                                            You had cancelled the appointment
                                            before confirming. This appointment
                                            will not be rated by customer!
                                          </h5>
                                        </div>
                                      ) : null}
                                    </li>

                                    <li className="list-group-item">
                                      <div>
                                        <h5>
                                          Stylist:{" "}
                                          {!appointment.stylistID ? (
                                            <span style={{ color: "blue" }}>
                                              Any
                                            </span>
                                          ) : (
                                            <span style={{ color: "blue" }}>
                                              {
                                                appointment.stylistID
                                                  .stylistName
                                              }
                                            </span>
                                          )}
                                        </h5>
                                      </div>
                                    </li>
                                    <li className="list-group-item">
                                      <div>
                                        <ul class="list-group">
                                          <li
                                            class="list-group-item bg-light"
                                            style={{ textAlign: "center" }}
                                          >
                                            Services Registered
                                          </li>
                                          {!(appointment.services.length === 0)
                                            ? appointment.services.map(
                                                (itemk) => (
                                                  <li
                                                    key={itemk._id}
                                                    className="list-group-item"
                                                    style={{
                                                      display: "flex",
                                                      flexDirection: "row",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <h6>{itemk.name}</h6>
                                                    <h6
                                                      style={{
                                                        display: "flex",
                                                      }}
                                                    >
                                                      {itemk.discount == 0 ? (
                                                        <span>
                                                          {itemk.price}/-
                                                        </span>
                                                      ) : (
                                                        <span>
                                                          <del
                                                            style={{
                                                              color: "red",
                                                            }}
                                                          >
                                                            {itemk.price}
                                                          </del>{" "}
                                                          {(
                                                            itemk.price -
                                                            itemk.price *
                                                              (itemk.discount /
                                                                100)
                                                          ).toFixed(0)}
                                                          /-
                                                        </span>
                                                      )}
                                                    </h6>
                                                  </li>
                                                )
                                              )
                                            : null}

                                          {!(appointment.deals.length === 0)
                                            ? appointment.deals.map((itemk) => (
                                                <li
                                                  key={itemk._id}
                                                  className="list-group-item"
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-between",
                                                  }}
                                                >
                                                  <h6>
                                                    {
                                                      itemk.saloonDealDetails
                                                        .nameOfDeal
                                                    }
                                                  </h6>
                                                  <h6
                                                    style={{
                                                      display: "flex",
                                                    }}
                                                  >
                                                    <span>
                                                      {itemk.saloonDealDetails.priceOfDeal.toFixed()}
                                                      /-
                                                    </span>
                                                  </h6>
                                                </li>
                                              ))
                                            : null}
                                          <li
                                            class="list-group-item bg-light"
                                            style={{
                                              textAlign: "center",
                                              display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <span> Total RS:</span>
                                            <span>
                                              {appointment.total.toFixed(0)}/-
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </li>
                                  </ul>
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
                                  data-target={"#collapse" + j}
                                  aria-controls={"collapse" + j}
                                  aria-expanded="false"
                                  aria-label="Toggle navigation"
                                >
                                  <span class="navbar-toggler-icon"></span>
                                </button>
                                <h5
                                  className="mr-auto mt-2 mt-lg-0"
                                  style={{ paddingLeft: "2%", color: "white" }}
                                >
                                  See Appointment Details
                                </h5>
                              </nav>
                            </div>
                          </nav>

                          <div
                            className="card-body"
                            style={{ textAlign: "center" }}
                          >
                            {appointment.status === "Confirming" ||
                            appointment.status === "Rescheduled" ? (
                              <div>
                                <Button
                                  onClick={() => {
                                    window.location.href =
                                      "/reviews/" +
                                      appointment.customerID._id +
                                      "/" +
                                      2;
                                  }}
                                  className="btn btn-info"
                                  style={{
                                    padding: "4%",
                                    width: "100%",
                                    marginBottom: "1%",
                                    backgroundColor: "darkkhaki",
                                  }}
                                >
                                  See Customer Reviews
                                </Button>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    onClick={() => {
                                      window.location.href =
                                        "/confirmTheTimeofApp/" +
                                        appointment.fromtiming +
                                        "/" +
                                        appointment.totiming +
                                        "/" +
                                        appointment._id +
                                        "/" +
                                        1;
                                    }}
                                    className="btn"
                                    style={{
                                      backgroundColor: "green",
                                      padding: "4%",
                                    }}
                                  >
                                    Confirm Appointment
                                  </Button>

                                  <Button
                                    onClick={() => {
                                      cancelApp(appointment._id);
                                    }}
                                    className="btn btn-danger"
                                    style={{ padding: "4%" }}
                                  >
                                    Cancel Appointment
                                  </Button>
                                </div>
                              </div>
                            ) : appointment.status === "Completed" &&
                              !appointment.ratedBySaloon ? (
                              <div>
                                <Button
                                  onClick={() => {
                                    window.location.href =
                                      "/saloonRating/" +
                                      appointment._id +
                                      "/" +
                                      appointment.customerID._id +
                                      "/" +
                                      "1";
                                  }}
                                  className="btn btn-warning"
                                  style={{ width: "100%", padding: "4%" }}
                                >
                                  Rate Customer
                                </Button>
                              </div>
                            ) : appointment.status === "Confirmed" ||
                              appointment.status === "TimeUpdate" ? (
                              <div>
                                <div className="alert alert-danger">
                                  {appointment.status === "Confirmed"
                                    ? "Alert! Once you cancelled this appointment after confirming. Your rating will affect!"
                                    : "Alert! As this appointment was once confirmed by you so if you cancelled this appointment, your rating will be affected!"}
                                </div>
                                <div>
                                  <Button
                                    onClick={() => {
                                      window.location.href =
                                        "/entertain/" + appointment._id;
                                    }}
                                    className="btn btn-success"
                                    style={{
                                      backgroundColor: "black",
                                      padding: "4%",
                                      width: "100%",
                                      marginBottom: "1%",
                                    }}
                                  >
                                    Entertain Appointment
                                  </Button>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  {appointment.status ===
                                  "TimeUpdate" ? null : (
                                    <Button
                                      onClick={() => {
                                        window.location.href =
                                          "/confirmTheTimeofApp/" +
                                          appointment.fromtiming +
                                          "/" +
                                          appointment.totiming +
                                          "/" +
                                          appointment._id +
                                          "/" +
                                          2;
                                      }}
                                      className="btn btn-success"
                                      style={{
                                        backgroundColor: "green",
                                        padding: "4%",
                                        width: "50%",
                                      }}
                                    >
                                      Update Timings
                                    </Button>
                                  )}

                                  <Button
                                    onClick={() => {
                                      cancelApp2(appointment._id);
                                    }}
                                    className="btn btn-danger"
                                    style={{ padding: "4%", width: "50%" }}
                                  >
                                    Cancel Appointment
                                  </Button>
                                </div>
                              </div>
                            ) : appointment.status === "Cust-Cancelled" &&
                              !appointment.ratedBySaloon ? (
                              <div>
                                <Button
                                  onClick={() => {
                                    window.location.href =
                                      "/saloonRating/" +
                                      appointment._id +
                                      "/" +
                                      appointment.customerID._id +
                                      "/" +
                                      "1";
                                  }}
                                  className="btn btn-warning"
                                  style={{ width: "100%", padding: "4%" }}
                                >
                                  Rate Customer
                                </Button>
                              </div>
                            ) : appointment.status === "Rescheduled" ? (
                              ""
                            ) : appointment.ratedBySaloon ? (
                              <Button
                                className="btn btn-success"
                                style={{ width: "100%", padding: "4%" }}
                                disabled="disabled"
                              >
                                Customer Rated!
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      )
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;
