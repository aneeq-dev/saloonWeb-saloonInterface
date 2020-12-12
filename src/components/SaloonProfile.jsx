import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator } from "react-activity-indicator";
import { Button, FormText, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import ip from "../ipadd/ip";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import Carousel from "react-bootstrap/Carousel";
import ReactStars from "react-rating-stars-component";
import SaloonDeals from "./saloonDeals";
import SaloonServices from "./SaloonServices";
import Cart from "./Cart";
import DatePicker from "./DatePicker";
import RequestAppointment from "./RequestAppointment";
import Stylist from "./Stylist";
import Reviews from "./Reviews";
import { useAlert } from "react-alert";
import jwtDecode from "jwt-decode";

function SaloonProfile(props) {
  const [loading, setLoading] = useState(true);
  const [saloondata, setSaloondata] = useState([]);
  const [i, setI] = useState(0);
  const alert = useAlert();
  var id = props.match.params.id;
  //const saloonName = props.route.params.name;
  const screenNumber = props.match.params.screenNumber;
  var app_id = props.match.params.app_id;
  //const salonName = props.navigation.pa('userName', 'NO-User');

  const anyRateSaloons = async () => {
    try {
      const value = localStorage.getItem("loginkeysasa");
      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getAnyAppWithRateRequired2",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        console.log("empty");
      } else {
        window.location.href =
          "/saloonRating/" +
          responseJson._id +
          "/" +
          responseJson.customerID +
          "/" +
          "2";
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const saloonInitialData = async () => {
    // let storestate = store.getState();
    //console.log("mkm ",id);
    try {
      const value = await localStorage.getItem("loginkeysasa");
      const user = jwtDecode(value);

      const { data: responseJson } = await axios.get(
        ip + "/api/saloon/getSaloonWRTid?id=" + user._id
      );
      if (responseJson === 0) {
        console.log("no saloon data found");
      } else {
        console.log(responseJson);
        setSaloondata(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }
    //console.log(responseJson);
    setLoading(false);
  };

  SaloonProfile.goBack = () => {
    //props.navigation.goBack();
    window.location.href = "/appointments/1";
    setTimeout(function () {
      alert.show("Appointment Registered Successfully!");
    }, 3000);
  };

  SaloonProfile.SetStateToLoad = () => {
    setLoading(true);
  };

  SaloonProfile.SetStateToUnLoad = () => {
    setLoading(false);
  };

  const setDataUpdation = async () => {
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getConfingAppointment?appointmentID=" + app_id,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      if (
        responseJson.length === 0 ||
        responseJson === 0 ||
        responseJson === undefined
      ) {
        // do nothing
      } else {
        console.log("mmmm: ", responseJson);
        var c = [
          {
            saloonOverallRating: responseJson[0].saloonID.saloonOverallRating,
            saloonGender: responseJson[0].saloonID.saloonGender,
            saloonBestImage: responseJson[0].saloonID.saloonBestImage,
            saloonDiscount: responseJson[0].saloonID.saloonDiscount,
            _id: responseJson[0].saloonID._id,
            saloonName: responseJson[0].saloonID.saloonName,
            saloonGallery: responseJson[0].saloonID.saloonGallery,
          },
        ];
        console.log("i: ", c);
        setSaloondata(c);
        // Deals.netCartOnlyForUpdate(responseJson[0].deals);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  if ((screenNumber == 2 || screenNumber == 3) && loading) {
    app_id = props.match.params.app_id;
    id = props.match.params.id;
    console.log(props.match.params.id);
    setDataUpdation();
    //alert.show("calling");
  }

  useEffect(
    () => {
      anyRateSaloons();
      saloonInitialData();
    },
    [i]
    //  query for fetching category 2 server data
  );

  SaloonProfile.getSalonId = () => {
    return id;
  };

  //saloonInitialData();

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "3%" }}>
          {saloondata.length === 0 ? (
            <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <div>
                <h5 style={{ color: "red", marginLeft: "4%" }}>
                  No profile found!
                </h5>
              </div>
            </nav>
            <div className="alert alert-primary">
              Please login/sign up from Settings -> Security &amp; Login -> Login, to see your profile.
              </div>
            </div>
          ) : (
            saloondata.map((sd) => (
              <div>
                
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                  <div className="navbar-text text-white">{sd.saloonName}</div>
                  <div className="navbar-collapse">
                    <span className=" ml-auto mr-5"></span>

                    <ul className="navbar-nav ">
                      <li className="nav-item dropdown mr-5 my-2 my-lg-0">
                        <ReactStars
                          count={5}
                          edit={false}
                          size={24}
                          activeColor="#ffd700"
                          value={sd.saloonOverallRating}
                        />
                      </li>
                      <li className="nav-item dropdown mr-5 my-2 my-lg-0">
                        <NavLink to="/reviews" className="nav-link">
                          {sd.saloonGender === "male"
                            ? "For Mens"
                            : "For Females"}
                        </NavLink>
                      </li>

                      <li className="nav-item mr-5 my-2 my-lg-0">
                        <Link
                          to={"/reviews/" + sd._id + "/1"}
                          className="nav-link"
                        >
                          Reviews
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
                {sd.saloonGallery.length === 0 ? null : (
                  <div className="container-fluid">
                    <Carousel
                      interval={3500}
                      keyboard={false}
                      pauseOnHover={true}
                    >
                      {sd.saloonGallery.map((img) => (
                        <Carousel.Item>
                          <img
                            style={{ height: "30em" }}
                            className="d-block w-100"
                            src={img}
                          />

                          <Carousel.Caption>
                            <h3 className="nav-item ">{sd.saloonName}</h3>
                          </Carousel.Caption>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                )}
              </div>
            ))
          )}

          {!(saloondata.length === 0) ? (
            <div style={{ marginTop: "1%" }}>
              <SaloonDeals
                id={props.match.params.id}
                screenNumber={screenNumber}
                app_id={app_id}
              ></SaloonDeals>
              <SaloonServices
                id={props.match.params.id}
                screenNumber={screenNumber}
                app_id={app_id}
              ></SaloonServices>

              <Stylist id={props.match.params.id} screenNumber={screenNumber} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
// src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Hair_Salon_Stations.jpg" alt="First slide" />
//src="https://i.pinimg.com/originals/1f/07/30/1f0730df29a4bf396412755530ab4e4c.jpg" alt="Second slide" />
//src="https://i.pinimg.com/originals/b5/fd/dd/b5fdddae5a32c6c75e00b3d78cadb1e6.jpg" alt="Third slide" />

export default SaloonProfile;
