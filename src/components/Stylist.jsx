import React, { useState, useEffect } from "react";
import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ip from "../ipadd/ip";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ReactStars from "react-rating-stars-component";
import { ajaxSettings } from "jquery";

function Stylist(props) {
  const [stylist, setStylist] = useState("Any");
  const [stylisName, setStylistName] = useState("Any Stylist");
  //const [stylistID, setStylistID] = useState('0');

  const [loading, setLoading] = useState(true);
  const [isgot, setIsgot] = useState(false);

  const [Stylistss, setStylists] = useState([]);

  const [selectedStylist, setSelectedStylist] = useState([]);

  useEffect(() => {
    if (props.screenNumber == 2 || props.screenNumber == 3) {
      getRegStylist(); // This is be executed when `loading` state changes
    }
    // Cart.updateme();
  }, [Stylistss]);

  console.log(props.screenNumber);

  const getStylistsl = async () => {
    //props.id
    try {
      // console.log("in h: ",props.id);
      const value = await localStorage.getItem('loginkeysasa');

      const { data: responseJson } = await axios.get(
        ip + "/api/stylist/getStylistWRTAuth",
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
        setStylists([]);
      } else {
        //  console.log("m: ",responseJson);

        setStylists(responseJson);
      }
      setLoading(false);
    } catch (ex) {
      console.error(ex);
    }
  };

  const getRegStylist = async () => {
    try {
      //  console.log("app: ",props.app_id);

      // const value = await AsyncStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/appointments/getConfingAppointmentStylist?appointmentID=" +
          props.app_id,
        {
          headers: {
            //"x-auth-token": value,
          },
        }
      );
      // console.log("mkkkksbhs: ",responseJson);
      if (responseJson[0].length === 0) {
        // do nothing
      } else if (responseJson[0].stylistID === undefined) {
        // if nothing found
        // set here any stylist
        //  console.log("any stylist here");
        setStylist("Any");

        setSelectedStylist("Any");
      } else {
        // setServicesFromDB(responseJson[0].services);
        // console.log("bvbvbb: ",Stylistss);
        for (var i = 0; i < Stylistss.length; i++) {
          if (Stylistss[i]._id === responseJson[0].stylistID._id) {
            //  console.log("matched");
            setStylist(responseJson[0].stylistID._id);
            var stylistn = [
              {
                _id: responseJson[0].stylistID._id,
                stylistName: responseJson[0].stylistID.stylistName,
                rating: responseJson[0].stylistID._id,
              },
            ];

            // setSelectedStylist(stylistn);
          } else {
            //console.log("not matched");
          }
        }
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
  };


  useEffect(()=>{
    getStylistsl();
  },[isgot])

  Stylist.GetStylist = () => {
    // console.log("ggggggggg: ",stylist);
    return stylist;
  };

  return (
    <div style={{ marginBottom: "2.5%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ marginBottom: "1.5%" }}
      >
        <div className="navbar-text text-white">Saloon Stylists</div>
      </nav>

      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Stylistss.length === 0 ? "No stylists found!" : null}
        </div>

        {Stylistss === undefined
          ? null
          : Stylistss.map((st) =>
              !(st == "Any Stylist") ? (
                <div className="bg-light" style={{ paddingLeft: "2em" }}>
                  <h4>
                    {st.stylistName}{" "}
                    <ReactStars
                      count={5}
                      edit={false}
                      size={24}
                      activeColor="#ffd700"
                      value={st.stylistRating}
                    />
                  </h4>
                  <div className="col-sm-12 dropdown-divider space bg-dark"></div>

                </div>
              ) : null
            )}
      </div>
    </div>
  );
}

export default Stylist;
