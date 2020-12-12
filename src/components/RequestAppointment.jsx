import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Cart from "./Cart";
import SaloonDeals from "./saloonDeals";
import SaloonServices from "./SaloonServices";
import { useAlert } from "react-alert";

import Stylist from "./Stylist";
import axios from "axios";
import ip from "../ipadd/ip";
import SaloonProfile from "./SaloonProfile";
import { matchPath } from "react-router";
import Datepicker from "./DatePicker";

function RequestAppointment(props) {
  const [Date1, setDate1] = useState();
  const [Date2, setDate2] = useState();
  const [Date, setDate] = useState(false);
  const [cart, setCart] = useState(false);
  const [carttotal, setCartTotal] = useState(0);
  const [itemsincart, setitemsincart] = useState([]);

  const alert = useAlert();
  const screenNumber = props.screenNumber;

  console.log("props are: ", props);

  RequestAppointment.getDate = (date, date2) => {
    //console.log(Date1);
    setDate1(date);
    setDate2(date2);
    setDate(true);
  };

  RequestAppointment.setme = () => {
    setDate(false);
  };

  const checkDateandCartAlert = () => {
    alert.show(
      "Request Denied!, for scheduling appointment, please select Date section and select any of the deals or services..."
    );
  };

  const upda = async (ob) => {
    //console.log(" jjdndjnjneekj: ",ob);
    // console.log("props:", props);
    try {
      const value = localStorage.getItem("loginkeysasa");
      //await AsyncStorage.getItem('loginkeysasa');

      const { data: responseJson } = await axios.put(
        ip + "/api/appointments/updateApp?appointmentID=" + props.app_id,
        ob,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      //  console.log("res: ",responseJson);

      if (
        responseJson.length === 0 ||
        responseJson === 0 ||
        responseJson === undefined
      ) {
        // do nothing
        alert.show(
          "Appointment Not Updated! Please be sure of active internet connection!"
        );
      } else {
        alert.show("Appointment Updated!");

        //console.log("ininin: ",props);
        SaloonProfile.goBack();
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
  };

  const upda2 = async (ob) => {
    //console.log(" jjdndjnjneekj: ",ob);
    console.log("obj:", ob);
    try {
      const value = localStorage.getItem("loginkeysasa");
      //await AsyncStorage.getItem('loginkeysasa');

      const { data: responseJson } = await axios.put(
        ip + "/api/appointments/updateApp2?appointmentID=" + props.app_id,
        ob,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      //  console.log("res: ",responseJson);

      if (
        responseJson.length === 0 ||
        responseJson === 0 ||
        responseJson === undefined
      ) {
        console.log("resp: ", responseJson);
        // do nothing
        alert.show(
          "Appointment Not Updated! Please be sure of active internet connection!"
        );
      } else {
        alert.show("Appointment Updated!");

        //console.log("ininin: ",props);
        SaloonProfile.goBack();
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
  };

  const checkDateAlert = () => {
    alert.show(
      "Request Denied!, Please select Date section according to instructions..."
    );
  };

  const checkCartAlert = () => {
    alert.show("Request Denied! Please select any deals or services...");
  };

  const checkData = async () => {
    let c = [];
    c = SaloonServices.getMenuCartonlyforupdate();
    // console.log("nnnnnnnnnnn: ",c);
    let d = [];
    d = SaloonDeals.getDealsCart();
    let t = false;
    if (c.length === 0 && d.length === 0) {
      t = false;
    } else {
      t = true;
    }
    console.log("in req: ", Datepicker.GetStatus());
    if (
      !Datepicker.GetStatus() &&
      !Cart.cartIsOkay() &&
      !(props.screenNumber === 2) &&
      !(props.screenNumber === 3)
    ) {
      checkDateandCartAlert();
    } else if (
      Datepicker.GetStatus() &&
      !Cart.cartIsOkay() &&
      !(props.screenNumber === 2) &&
      !(props.screenNumber === 3)
    ) {
      checkCartAlert();
    } else if (
      !Datepicker.GetStatus() &&
      Cart.cartIsOkay() &&
      !(props.screenNumber === 2) &&
      !(props.screenNumber === 3)
    ) {
      checkDateAlert();
    } else if (
      !Datepicker.GetStatus() &&
      !t &&
      props.screenNumber === 2 &&
      props.screenNumber === 3
    ) {
      checkDateandCartAlert();
    } else if (
      Datepicker.GetStatus() &&
      !t &&
      props.screenNumber === 2 &&
      props.screenNumber === 3
    ) {
      checkCartAlert();
    } else if (
      !Datepicker.GetStatus() &&
      cart &&
      props.screenNumber === 2 &&
      props.screenNumber === 3
    ) {
      checkDateAlert();
    } else if (Date1 === undefined || Date2 === undefined) {
      console.log("mkmkmkmkmkmmkkkkkkkkkkkkkkkkk-----------------");
      checkDateAlert();
    } else {
      console.log(
        "yes you can request appointment... here query can be applied with saving data in db..."
      );
      // data will be saving an appointment
      // appointment will have data as follows:
      // date & time
      //console.log(Date1, " ", Date2, " ", DatePicker.getcheck());
      // cart array

      var dea = [];
      var ser = [];
      var tott = 0;

      if (props.screenNumber === 2 || props.screenNumber === 3) {
        // console.log("cart in menu services: ",Menu.getMenuCartonlyforupdate());
        // console.log("cart in deals services: ",Deals.getDealsCartonlyforUpdate());
        let c = [];
        var total = 0;
        c = SaloonServices.getMenuCartonlyforupdate();
        for (var i = 0; i < c.length; i++) {
          total = total + c[i].price;
        }
        ser = SaloonServices.getMenuCartonlyforupdate();
        console.log("mli: ", ser);
        dea = SaloonDeals.getDealsCartonlyforUpdate();
        console.log("mli1: ", dea);
        tott = total;
        console.log(total, c.length);
      } else {
        //console.log("cart in deals: ",Cart.getCart());
        // console.log("cart in menu: ",Cart.getserCart());
        // console.log(Cart.gettotal());
        ser = Cart.getserCart();
        dea = Cart.getCart();
        tott = Cart.gettotal();
      }
      // console.log("cart is in req: ",Cart.getCart());
      // saloon id
      //console.log("saloonID: ",saloonProfile.getSalonId());
      //console.log("customerID: 5f83dde2f425191b10b11b7e");
      //console.log("stylist ID: ",Stylists.GetStylist());
      // status: at start status will be confirming
      console.log("Confirming");
      //
      // carttotal
      //console.log(Stylists.GetStylist());
      var obj = {};
      if (!(Stylist.GetStylist() === "Any")) {
        obj = {
          stylistID: Stylist.GetStylist(),
          deals: dea,
          services: ser,
          total: tott,
          fromtiming: Date1,
          totiming: Date2,
        };
      } else {
        obj = {
          // stylistID:Stylists.GetStylist(),
          deals: dea,
          services: ser,
          total: tott,
          totiming: Date2,
          fromtiming: Date1,
        };
      }

      if (screenNumber == 1) {
        // request app
        try {
          const value = localStorage.getItem("loginkeysasa");
          //await AsyncStorage.getItem('loginkeysasa');
          // console.log('val: ', value);

          if (value === null) {
            window.location.href = "/login/4";
          } else {
            const { data: responseJson } = await axios.post(
              ip + "/api/appointments/saveApp?saloonID=" + props.saloonId,
              obj,
              {
                headers: {
                  "x-auth-token": value,
                },
              }
            );

            if (responseJson.length === 0) {
              // do nothing
              alert.show(
                "Appointment not registered successfully, be sure of active internet connection!"
              );
            } else {
              alert.show(
                "Appointment registered successfully, you can check all appointments in 'My Appointment'"
              );

              //console.log("ininin: ",props);
              SaloonProfile.goBack();
            }
          }
        } catch (ex) {
          console.log(ex);
        }
      } else if (props.screenNumber == 2) {
        upda(obj);
      } else if (props.screenNumber == 3) {
        upda2(obj);
      }
    }
  };

  const setCarti = () => {
    let c = [];
    c = Cart.getCart();
    setitemsincart(c);
  };

  const requestApp = () => {
    setCarti();
    checkData();
  };

  const updateApp = () => {
    //setCarti2();
    checkData();
  };

  return (
    <div style={{ marginBottom: "2.5%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ marginBottom: "1.5%" }}
      >
        <div className="navbar-text text-white">
          {props.screenNumber == 2 || props.screenNumber == 3
            ? "Update Appointment"
            : "Request Appointment"}
        </div>
      </nav>

      <div style={{ textAlign: "center", marginBottom: "10%" }}>
        <Button
          className="bg-dark"
          onClick={() => {
            if (!localStorage.getItem("loginkeysasa")) {
              window.location.href = "/login/2";
            } else if (props.screenNumber == 1) {
              requestApp();
            } else if (props.screenNumber == 2) {
              updateApp();
            } else if (props.screenNumber == 3) {
              updateApp();
            }
          }}
        >
          <h5 style={{ paddingRight: "2.5%", paddingLeft: "2.5%" }}>
            {props.screenNumber == 2 || props.screenNumber == 3
              ? "Update Appointment"
              : "Request Appointment"}
          </h5>
        </Button>
      </div>
    </div>
  );
}

export default RequestAppointment;
