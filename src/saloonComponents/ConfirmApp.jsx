import React, { useEffect, useState } from "react";
import { Button, FormText } from "react-bootstrap";
import ip from "../ipadd/ip";
import { useAlert } from "react-alert";
import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import DatePicker from "react-datepicker";

function ConfirmApp(props) {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [isChecked2, setIsChecked2] = useState(true); // checking if on start time is set to 10 minutes ahead
  const [isChecked, setIsChecked] = useState(true); // checking if on start time is set to 10 minutes ahead
  const [isok, setIsOk] = useState(false);

  const dates = props.match.params.dateFrom;
  const datesto = props.match.params.dateTo;
  const app_id = props.match.params.app_ID;

  const [date, setDate] = useState(new Date(dates)); // setting default from time to 10 min ahead time
  const [dateto, setDateto] = useState(new Date(datesto)); // setting default from time to 10 min ahead time
  const [dateselect, setDateSelect] = useState(new Date(dates)); // setting default from time to 10 min ahead time
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const alert = useAlert();

  const getscheduleQuery = async () => {
    setLoading(true);

    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getSchedule",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      if (!responseJson) {
        alert.show("No schedule found!");

        setSchedule([]);
        // do nothing
      } else {
        setSchedule(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }
    //  setRef(false);
    setLoading(false);
    //  console.log("presses")
  };

  if (loading && !d) {
    if (localStorage.getItem("loginkeysasa")) {
      getscheduleQuery();
    } else {
      setLoading(false);
      window.location.href = "/login/4";
    }
    setD(true);
  }

  const checkDateandTime = (datefrom) => {
    if (datefrom.getDate() < date.getDate()) {
      if (datefrom.getFullYear() === date.getFullYear()) {
        if (datefrom.getMonth() === date.getMonth()) {
          alert.show("Wrong date selected");
          setIsOk(false);
        } else if (datefrom.getMonth() > date.getMonth()) {
          checkDateandTime2(datefrom);
        }
      } else if (datefrom.getFullYear() > date.getFullYear()) {
        checkDateandTime(datefrom);
      }
    } else if (datefrom.getDate() === date.getDate()) {
      if (datefrom.getHours() < date.getHours()) {
        alert.show("Wrong hours selected");
        setIsOk(false);
      } else if (datefrom.getHours() === date.getHours()) {
        if (datefrom.getMinutes() < date.getMinutes()) {
          alert.show("Wrong minutes selected");
          setIsOk(false);
        }
        else{
          setIsOk(true);
        }
      } else {
        checkDateandTime2(datefrom);
      }
    } else {
      checkDateandTime2(datefrom);
    }
  };
  const checkDateandTime2 = (datefrom) => {
    if (datefrom.getDate() > dateto.getDate()) {
      if (datefrom.getFullYear() === dateto.getFullYear()) {
        if (datefrom.getMonth() === dateto.getMonth()) {
          alert.show("Wrong date selected");
          setIsOk(false);
        } else if (datefrom.getMonth() > dateto.getMonth()) {
          if (
            datefrom.getFullYear() === dateto.getFullYear() ||
            datefrom.getFullYear() > dateto.getFullYear()
          )
            alert.show("Wrong date selected");
          setIsOk(false);
        }
      } else if (datefrom.getFullYear() > dateto.getFullYear()) {
        //checkDateandTime(datefrom);
        alert.show("Wrong date selected");
        setIsOk(false);
      }
    } else if (datefrom.getDate() === dateto.getDate()) {
      if (datefrom.getHours() > dateto.getHours()) {
        alert.show("Wrong hours selected");
        setIsOk(false);
      } else if (datefrom.getHours() === dateto.getHours()) {
        if (
          datefrom.getMinutes() > dateto.getMinutes() ||
          datefrom.getMinutes() === dateto.getMinutes()
        ) {
          alert.show("Wrong minutes selected");
          setIsOk(false);
        } else {
          setIsOk(true);
        }
      } else {
        setIsOk(true);
      }
    } else {
      setIsOk(true);
    }
  };
  /*
    } else if (datefrom.getDate() === date.getDate()) {
      // if dates are equal
      //
      if (datefrom.getHours() < date.getHours()) {
        // if hours is less than current hour
        //setIsDateandTimeOk(false);
        alert.show("Wrong hours selected");

        setIsOk(false);
      } else if (datefrom.getHours() === date.getHours()) {
        if (datefrom.getMinutes() < date.getMinutes()) {
          alert.show("Wrong minutes selected");
          setIsOk(false);
        } else {
          setIsOk(true);
        }
        // if hours is less than current hour
        //setIsDateandTimeOk(false);
      } else {
        setIsOk(true);
      }
    } else if (datefrom.getDate() > dateto.getDate()) {
      alert.show("Wrong date selected");

      setIsOk(false);
    } else {
      console.log("kkkkkk: ", "true");
      setIsOk(true);
    }
  };
*/
  const confirmAppointment = async () => {
    if (!isok) {
      setIsDateSelected(true);
      checkDateandTime(dateselect);
      alert.show("Did you selected timings correctly?");
    } else {
      setLoading(true);
      const obj = { date: dateselect };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        //console.log('mkmkmkmmmmkmmk: ', value);
        const { data: responseJson } = await axios.put(
          ip + "/api/appointments/confirmTheApp?appointmentID=" + app_id,

          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show("Appointment not confirmed Successfully!");
          // do nothing
        } else {
          alert.show("Appointment confirmed successfully");
          window.location.href = "/appointments/1";
        }
      } catch (ex) {
        console.log(ex.response.data);
        // setErrors(ex.response.data);
      }
      //console.log(HistoryAppointments);
      setLoading(false);
    }
  };

  const updateTimings = async () => {
    if (!isok) {
      setIsDateSelected(true);
      checkDateandTime(dateselect);
      alert.show("Did you selected timings correctly?");
    } else {
      setLoading(true);
      const obj = { date: dateselect };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        //console.log('mkmkmkmmmmkmmk: ', value);
        const { data: responseJson } = await axios.put(
          ip + "/api/appointments/updateTimings?appointmentID=" + app_id,

          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show("Appointment not confirmed Successfully!");
          // do nothing
        } else {
          alert.show("Appointment updated successfully");
          window.location.href = "/appointments/1";
        }
      } catch (ex) {
        console.log(ex);
        // setErrors(ex.response.data);
      }
      //console.log(HistoryAppointments);
      setLoading(false);
    }
  };

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;

    checkDateandTime(selectedDate);
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
            <a class="navbar-brand">Confirm The Appointment</a>
          </nav>

          <div style={{ marginLeft: "2%" }}>
            <h3>Your New Confirmed Schedule is as follows:</h3>
            {schedule.length === 0 ? (
              "No confirmed schedule found!"
            ) : (
              <div className="alert alert-success">
                Following is the list of your confirmed appointments, so the
                following list is just for your help when confirming the new
                appointments.
              </div>
            )}
            {schedule.map((s, i) => (
                console.log(s),
              <div className="card col-lg-3" style={{ margin: "1.5%" }} key={i}>
                <div className="card" style={{ margin: "1.5%" }}>
                  <div
                    className="card-header bg-light"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    Appointment # {i + 1}
                  </div>
                  <div className="card-body text-white bg-dark">
                    <h5 className="card-title">
                      Appointment Confirmed for: <br />
                      <span style={{ color: "lightgreen" }}>
                        <span style={{ color: "white" }}>Time: </span>
                        {new Date(s.completedDate).getHours() % 12 === 0
                          ? 12 + " "
                          : (new Date(s.completedDate).getHours() % 12) + " "}
                        :{" "}
                        {new Date(s.completedDate).getMinutes() >= 0 &&
                        new Date(s.completedDate).getMinutes() <= 9
                          ? "0" + new Date(s.completedDate).getMinutes() + " "
                          : new Date(s.completedDate).getMinutes() + ""}
                        {new Date(s.completedDate).getHours() / 12 >= 1
                          ? " PM  "
                          : " AM  "}
                        <span style={{ color: "white" }}>
                          <br />
                          Dated:{" "}
                        </span>
                        {new Date(s.completedDate).getDate()}
                        {"-"}
                        {new Date(s.completedDate).getMonth() + 1}
                        {"-"}
                        {new Date(s.completedDate).getFullYear()} ('dd-mm-yyyy')
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-sm-12 dropdown-divider space bg-dark"
          style={{margin:"4%"}}></div>

          <div className="alert alert-success" style={{marginLeft:"2%"}}>
            Please see the above schedule and confirm the new appointments
            within customer's selected timings below.
          </div>
          <div
            className="w-auto p-3"
            style={{
              flex: 1,
              padding: "16px",
              background: isok ? "#216ba5" : "#421c1a",
              color: "#fff",
            }}
          >
            <nav className="navbar navbar-expand-lg  text-white bg-info">
              <h4 className="navbar-text">FROM</h4>
            </nav>
            <h4>
              Selected customer timings:
              <span style={{ color: "yellow" }}>
                {" "}<br/>
                From 
                
                <h4>
                <span style={{color:"orange"}}>Dated:{" "}</span>
                  {date.toDateString()}
                  <span style={{ color: "orange" }}> Time:</span>{" "}
                  {date.getHours() % 12 === 0
                    ? 12 + " "
                    : (date.getHours() % 12) + " "}
                  :
                  {date.getMinutes() >= 0 && date.getMinutes() <= 9
                    ? "0" + date.getMinutes() + " "
                    : date.getMinutes() + ""}{" "}
                  : 00
                  {date.getHours() / 12 >= 1 ? " PM" : " AM"}
                </h4>
              </span>
            </h4>
            <nav className="navbar navbar-expand-lg  text-white bg-info">
              <h4 className="navbar-text">To</h4>
            </nav>
            <h4>
              <span style={{ color: "yellow" }}>
                {" "}
                To 
                <h4>
                <span style={{color:"orange"}}>Dated:{" "}</span>
                  {dateto.toDateString()}
                  <span style={{ color: "orange" }}> Time:</span>{" "}
                  {dateto.getHours() % 12 === 0
                    ? 12 + " "
                    : (dateto.getHours() % 12) + " "}
                  :
                  {dateto.getMinutes() >= 0 && dateto.getMinutes() <= 9
                    ? "0" + dateto.getMinutes() + " "
                    : dateto.getMinutes() + ""}{" "}
                  : 00
                  {dateto.getHours() / 12 >= 1 ? " PM" : " AM"}
                </h4>
              </span>
            </h4>

            <div style={{ marginTop: "4%" }}>
              <nav className="navbar navbar-expand-lg  text-white bg-info">
                <h4 className="navbar-text">
                  Select Your Suitable Timings within Customer Selected Time:
                </h4>
              </nav>
              <DatePicker
                selected={dateselect}
                // onSelect={(d)=>{onSelectCheck1(d)}}
                onChange={(date) => {
                  setDateSelect(date);
                  onChange(date);
                }}
                showTimeSelect
                className="bg-light w-auto p-3 "
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
              />
            </div>
          </div>
          <button
            class="btn btn-dark"
            style={{
             
              borderRadius: 50,
              marginTop: "2%",
              marginLeft:"3%",
              padding:"1%",
              paddingLeft: "4%",
              paddingRight: "4%",
              display:"flex",
              justifyContent: 'center',
            }}
            onClick={() => {
                props.match.params.screenNumber==1?(
                    confirmAppointment()
                ):
                updateTimings()
              
            }}
          >
              {props.match.params.screenNumber==1?(
                    "Confirm the Appointment"
                ):
                "Update the Appointment"}
            
          </button>
          <div className="col-sm-12 dropdown-divider space bg-dark"
          style={{margin:"4%"}}></div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmApp;
