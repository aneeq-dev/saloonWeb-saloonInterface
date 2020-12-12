import React, { useState } from "react";
import { FormText } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RequestAppointment from "./RequestAppointment";
import { useAlert } from "react-alert";

function Datepicker(props) {
  var currentDate = new Date();

  var toTime = new Date();

  toTime.setDate(currentDate.getDate());
  toTime.setMonth(currentDate.getMonth());
  toTime.setFullYear(currentDate.getFullYear());
  toTime.setHours(currentDate.getHours() + 1);
  toTime.setMinutes(currentDate.getMinutes());

  var fTime = new Date();

  fTime.setDate(currentDate.getDate());
  fTime.setMonth(currentDate.getMonth());
  fTime.setFullYear(currentDate.getFullYear());
  fTime.setHours(currentDate.getHours());
  fTime.setMinutes(currentDate.getMinutes() + 10);

  const [date, setDate] = useState(new Date(fTime)); // setting default from time to 10 min ahead time
  const [date2, setDate2] = useState(new Date(toTime)); // setting default to time to 1 hour ahead time
  const [minDate, setMinDate] = useState(new Date());

  const [setse, setSe] = useState(true);
  const [isok, setIsOk] = useState(false);
  const [m, setm] = useState(0);

  /* DatePicker.getcheck = () => {
    return isok;
  };

*/

  Datepicker.GetStatus = () => {
    return isok;
  };

  const alert = useAlert();

  const setRequestAppointment = () => {
    RequestAppointment.getDate(date, date2);
    console.log("dateset: ", date, date2);
  };

  const updateme = () => {
    if (setse) {
      setSe(false);
    } else {
      setSe(true);
    }
  };

  // from will automatically will be selected
  // to will be given
  const checkDateandTime2 = (date, dateto) => {
    console.log("checking 2: ", date, dateto, date2);
    if (dateto.getDate() === date.getDate()) {
      //
      if (
        dateto.getMonth() === date.getMonth() ||
        dateto.getMonth() > date.getMonth()
      ) {
        if (
          dateto.getFullYear() === date.getFullYear() ||
          dateto.getFullYear() > date.getFullYear()
        ) {
          if (dateto.getHours() < date.getHours()) {
            //setIsDateandTimeOk(false);
            alert.show(
              "Keep some time within, Please keep some time within To and From Hours!"
            );
            setIsOk(false);
            RequestAppointment.setme();
          } else if (dateto.getHours() === date.getHours()) {
            if (dateto.getMinutes() < date.getMinutes()) {
              alert.show(
                "Keep some time within, Please keep some time within To and From Minutes!"
              );

              setIsOk(false);
              RequestAppointment.setme();
            } else {
              setIsOk(true);
              setRequestAppointment();
            }
          } else {
            setIsOk(true);
            setRequestAppointment();
          }
        } else if (dateto.getFullYear() < date.getFullYear()) {
          alert.show(
            "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
          );

          setIsOk(false);
          RequestAppointment.setme();
        }
      } else if (dateto.getMonth() < date.getMonth()) {
        alert.show(
          "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
        );

        setIsOk(false);
        RequestAppointment.setme();
      }
    } else if (dateto.getDate() < date.getDate()) {
      if (
        dateto.getMonth() < date.getMonth() ||
        dateto.getMonth() === date.getMonth()
      ) {
        if (
          dateto.getFullYear() < date.getFullYear() ||
          dateto.getFullYear() === date.getFullYear()
        ) {
          alert.show(
            "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
          );

          setIsOk(false);
          RequestAppointment.setme();
        } else {
          setIsOk(true);
          setRequestAppointment();
        }
      } else {
        setIsOk(true);
        setRequestAppointment();
      }
    } else if (dateto.getDate() === currentDate.getDate()) {
      if (dateto.getHours() < currentDate.getHours()) {
        //setIsDateandTimeOk(false);
        alert.show("Wrong hours selected,Please select an upcoming hour!");

        setIsOk(false);
        RequestAppointment.setme();
      } else if (dateto.getHours() === currentDate.getHours()) {
        if (dateto.getMinutes() < currentDate.getMinutes()) {
          //setIsDateandTimeOk(false);
          alert.show(
            "Wrong minutes selected,Please select an upcoming minute!"
          );

          setIsOk(false);
          RequestAppointment.setme();
        } else {
          setIsOk(true);
          setRequestAppointment();
        }
      }
    } else if (dateto.getDate() > date.getDate()) {
      //if date is greater
      if (dateto.getMonth() < date.getMonth()) {
        //but not month and also year
        if (
          dateto.getFullYear() < date.getFullYear() ||
          dateto.getFullYear() === date.getFullYear()
        ) {
          alert.show(
            "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
          );

          setIsOk(false);
          RequestAppointment.setme();
        } else {
          setIsOk(true);
          setRequestAppointment();
        }
      } else if (dateto.getMonth === date.getMonth()) {
        //ifdate is greater but month is equal
        if (dateto.getFullYear() < date.getFullYear()) {
          //but year is smaller
          alert.show(
            "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
          );

          setIsOk(false);
          RequestAppointment.setme();
        } else {
          //but year is greater
          setIsOk(true);
          setRequestAppointment();
        }
      } else {
        // if to month is greater but not year
        if (dateto.getFullYear() < date.getFullYear()) {
          alert.show(
            "Choose date again!, Please select date again, such that To and From dates are equal or greater than each other "
          );

          setIsOk(false);
          RequestAppointment.setme();
        } else {
          setIsOk(true);
          setRequestAppointment();
        }
      }
    } else {
      setIsOk(true);

      setRequestAppointment();
    }
   
    console.log("isok:",isok);
  };

  const checkDateandTime = (datefrom) => {
    console.log("here", datefrom);
    console.log(datefrom, currentDate);
    if (datefrom.getDate() === currentDate.getDate()) {
      // if today
      if (datefrom.getHours() < currentDate.getHours()) {
        // if hours is less than current hour
        //setIsDateandTimeOk(false);
        alert.show("Wrong hours selected, Please select an upcoming hour!");

        setIsOk(false);
        RequestAppointment.setme();
      } else if (datefrom.getHours() === currentDate.getHours()) {
        // if current hour
        if (datefrom.getMinutes() < currentDate.getMinutes()) {
          // if minutes are < current minute
          //setIsDateandTimeOk(false);
          alert.show("Wrong minutes selected, Please select upcoming minutes!");

          setIsOk(false);
          RequestAppointment.setme();
        }
      }
    }
    checkDateandTime2(datefrom, date2);
    //setIsChecked(true);
  };

  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    //setShow(Platform.OS === 'ios');

    //setDate(currentDate);

    //setIsTimeSelected(true);
    //console.log(currentDate, selectedDate);
    checkDateandTime(selectedDate);
    //checkDateandTime2(selectedDate);

    setRequestAppointment();
  };

  const onChange2 = (selectedDate) => {
    const currentDate = selectedDate || date2;
    //setShow2(Platform.OS === 'ios');
    //setDate2(currentDate);

    //setIsTimeSelected2(true);
    // checkDateandTime(selectedDate);
    checkDateandTime2(date, selectedDate);

    setRequestAppointment();
  };

  return (
    <div style={{ marginBottom: "2.5%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ marginBottom: "1.5%" }}
      >
        <div className="navbar-text text-white">Date and Time</div>
      </nav>

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
          Your selected <span style={{ color: "yellow" }}>From</span> date and
          time is{" "}
        </h4>
        <h4>
          {date.toDateString()}
          <span style={{ color: "orange" }}> Time:</span>{" "}
          {date.getHours() % 12 === 0 ? 12 + " " : (date.getHours() % 12) + " "}
          :
          {date.getMinutes() >= 0 && date.getMinutes() <= 9
            ? "0" + date.getMinutes() + " "
            : date.getMinutes() + ""}{" "}
          : 00
          {date.getHours() / 12 >= 1 ? " PM" : " AM"}
        </h4>
        <DatePicker
          selected={date}
          // onSelect={(d)=>{onSelectCheck1(d)}}
          onChange={(date) => {
            setDate(date);
            onChange(date);
          }}
          showTimeSelect
          className="bg-light w-auto p-3 "
          closeOnScroll={true}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={minDate}
        />
      </div>

      <div
        className="w-auto p-3"
        style={{
          flex: 1,
          alignItems: "center",
          padding: "16px",
          background: isok ? "#216ba5" : "#421c1a",
          color: "#fff",
        }}
      >
        <nav className="navbar navbar-expand-lg  text-white bg-info">
          <h4 className="navbar-text">TO</h4>
        </nav>
        <h4>
          Your selected <span style={{ color: "yellow" }}>To</span> date and
          time is{" "}
        </h4>
        <h4>
          <span style={{ color: "orange" }}>Dated: </span>
          {date2.toDateString()} <span style={{ color: "orange" }}>Time:</span>{" "}
          {date2.getHours() % 12 === 0
            ? 12 + " "
            : (date2.getHours() % 12) + " "}
          :
          {date2.getMinutes() >= 0 && date2.getMinutes() <= 9
            ? "0" + date2.getMinutes() + " "
            : date2.getMinutes() + ""}{" "}
          : 00
          {date2.getHours() / 12 >= 1 ? " PM" : " AM"}
        </h4>
        <DatePicker
          selected={date2}
          //onSelect={(d)=>{onSelectCheck2(d)}}
          onChange={(date) => {
            setDate2(date);
            onChange2(date);
          }}
          showTimeSelect
          className="bg-light w-auto p-3 "
          closeOnScroll={true}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={minDate}
        />
      </div>
    </div>
  );
}

export default Datepicker;
