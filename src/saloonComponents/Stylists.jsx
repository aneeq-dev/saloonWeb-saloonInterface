import React, { useState, useEffect } from "react";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import ReactStars from "react-rating-stars-component";

function Stylists(props) {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(false);
  const alert = useAlert();

  const getStylists = async () => {
    setLoading(true);

    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip + "/api/stylist/getStylistWRTAuth",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      console.log("njn: ", responseJson);
      if (responseJson === 0 || responseJson === undefined) {
        alert.show("No stylists found!");

        setStylists([]);
        // do nothing
      } else {
        setStylists(responseJson);
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
    setLoading(false);
  };

  const cancelApp = async (stylistID) => {
    // here goes query for deleting
    try {
      const value = await localStorage.getItem("loginkeysasa");
      //  console.log('mkmkmkmmmmkmmk: ', value);
      const { data: responseJson } = await axios.delete(
        ip + "/api/stylist/deleteStylist?stylistID=" + stylistID,

        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        // do nothing

        //  console.log("nothing");
        alert.show("Stylist Not Deleted!");

        if (localStorage.getItem("loginkeysasa")) {
          getStylists();
        } else {
          //setLoading(false);
          window.location.href = "/login/4";
        }
      } else {
        alert.show("Stylist Deleted");

        getStylists();
      }
    } catch (ex) {
      console.log(ex);
      console.log(ex.response.data);
    }
    // on recieving promise

    //console.log(HistoryAppointments);
    setLoading(false);
  };

  if (loading && !d) {
    //console.log("gh: ", store2.getState()[0].logged);
    if (localStorage.getItem("loginkeysasa")) {
      getStylists();
    } else {
      setLoading(false);

      window.location.href = "/login/4";
    }
    setD(true);
  }

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10" style={{ marginLeft: "3%" }}>
          <nav
            className="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a className="navbar-brand">My Saloon Stylists</a>
          </nav>
          <div className="row col-lg-12">
            {stylists.map((stylis, i) => (
              <div className="card col-lg-3" style={{ margin: "1.5%" }} key={i}>
                <div className="card" style={{ margin: "1.5%" }}>
                  <div className="card-header bg-light">
                    Stylist Name: {stylis.stylistName.toUpperCase()}
                  </div>
                  <div className="card-body text-white bg-dark">
                    <h5 className="card-title">
                      Stylist Phone Number:{" "}
                      <span style={{ color: "lightgreen" }}>
                        {stylis.phoneNumber}
                      </span>
                    </h5>
                    <p className="card-text">
                      Stylist Rating:
                      <span style={{ color: "lightgreen" }}>
                        {" "}
                        <ReactStars
                          count={5}
                          // onChange={ratingChanged}
                          edit={false}
                          size={24}
                          activeColor="#ffd700"
                          value={stylis.stylistRating}
                        />
                      </span>
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        onClick={(nval) => {
                          // checkboxtheItem(deal);
                          //setToggleCheckBox(nval);
                          // window.location.href = "/addDeals/2/" + deal._id;
                          window.location.href =
                            "/updateStylist/2/" + stylis._id;
                        }}
                        className="btn btn-primary"
                      >
                        Update Stylist
                      </button>
                      <button
                        onClick={(nval) => {
                          // checkboxtheItem(deal);
                          //setToggleCheckBox(nval);
                          cancelApp(stylis._id);
                        }}
                        className="btn btn-danger"
                      >
                        Delete Stylist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2%",
            }}
          >
            <button
              onClick={(nval) => {
                //checkboxtheItem(sub);
                // setToggleCheckBox(nval);
                // deleteSubService(service._id, sub._id);
                //console.log(subservices._id);
                window.location.href = "/updateStylist/1/0";
              }}
              style={{ width: "30%", padding: "1.5%", borderRadius: 50 }}
              className={"btn btn-dark"}
            >
              Add New Stylist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stylists;
