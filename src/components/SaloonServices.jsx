import React, { useState, useEffect } from "react";
import { FormText } from "react-bootstrap";
import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ip from "../ipadd/ip";
import Cart from "./Cart";
import jwtDecode from "jwt-decode";

function SaloonServices(props) {
  const [services, setServices] = useState([]);

  const [servicesFromDB, setServicesFromDB] = useState([]);

  const [setse, setSe] = useState(true);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [set, setTr] = useState(false);
  const [i, setI] = useState(0);
  const [ik, setik] = useState(0);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const getServices = async () => {
    //console.log("bhjbh",props.id);
    try {
      const value = await localStorage.getItem("loginkeysasa");
      const user = jwtDecode(value);

      const { data: responseJson } = await axios.get(
        ip + "/api/services/getServices?saloonID=" + user._id
      );
      if (!responseJson) {
        setLoading(false);

        // do nothing
        console.log("no services found");
      } else {
        // console.log(responseJson);
        // console.log(responseJson);
        responseJson.forEach(function (element, i) {
          element.id = i;
          var arr = [];

          //console.log("e:",element, i);
          var j = 0;
          while (!(element.Services.length === 0)) {
            var n = element.Services.splice(0, 1);
            n[0].id = j;
            n[0].p_id = i;
            n[0].isSelected = false;
            arr.push(n);
            j++;
          }
          for (var l in arr) {
            element.Services.push(arr[l][0]);
          }

          //element.services.Services=arr;
          // console.log(element.services.Services);
          // element.num = i;
          // console.log(i);
        });
        // console.log("nnnnn: ",responseJson);
        for (var j = 0; j < responseJson.length; j++) {
          //console.log("nnnnnkk: ",responseJson[j].Services);
        }

        setServices(responseJson);
        setI(i + 1);
        // sortFullServices(services);
      }
    } catch (ex) {
      console.error(ex);
    }
    setLoading(false);

    //console.log("njknkjnjjj: ",deals);
  };

  /*  const getRegServices = async () => {
    try {
      const value = await AsyncStorage.getItem('loginkeysasa');

      const {data: responseJson} = await axios.get(
        'https://' +
          ip +
          '/api/appointments/getConfingAppointmentServices?appointmentID=' +
          props.app_id,
        {
          headers: {
            'x-auth-token': value,
          },
        },
      );
      if (responseJson.length === 0  || responseJson===0 || responseJson===undefined) {
        // do nothing
      } else {
        //console.log("mmmm: ",responseJson[0].deals);
        //console.log("i: ",c);

        //selectedDeals.push(responseJson[0].deals);
        // console.log("mi: ",responseJson);
        //;
        //console.log("mkmmk: ",c);
        setServicesFromDB(responseJson[0].services);
        // setTr(true);
        //   console.log('shmn: ',selectedDeals);
        // return responseJson[0].deals;
        // Deals.netCartOnlyForUpdate(responseJson[0].deals);
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
  };
*/

  useEffect(() => {
    getServices(); // This is be executed when `loading` state changes
  }, [set]);

  //console.log("nnnn:mkm: ",services);

  return (
    <div style={{ marginTop: "3%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ marginBottom: "1.5%" }}
      >
        <div className="navbar-text text-white">Saloon Services</div>
      </nav>
      <div>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : services.length === 0 ? (
          <div style={{ display:"flex", justifyContent:"center", margin:"2%"  }}>No Services found!</div>

        ) : (
          services.map((service) => (
            <div>
              <nav className="navbar navbar-expand-lg  text-white bg-info">
                <div className="navbar-text">{service.name}</div>
              </nav>
              <div className="row col-lg-12">
                {service.Services.map((sub) => (
                  <div
                    className="card col-lg-3"
                    key={sub.id}
                    style={{ margin: "1.5%" }}
                  >
                    <div class="card" style={{ margin: "1.5%" }}>
                      <div class="card-header bg-light">
                        {sub.name.toUpperCase()}
                      </div>
                      <div class="card-body text-white bg-dark">
                        <h5 class="card-title">
                          Valued Rs.
                          {"  "}
                          {(
                            sub.price -
                            (sub.discount / 100) * sub.price
                          ).toFixed(0)}
                          {"  "}
                          <del style={{ color: "red" }}>
                            {sub.price.toFixed(0)}
                          </del>
                        </h5>
                        <p>
                          Discount:{" "}
                          <span style={{ color: "#65f083" }}>
                            {sub.discount}
                          </span>
                          %{"\n"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SaloonServices;
