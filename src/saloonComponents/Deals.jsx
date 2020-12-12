import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import React, { useState, useEffect } from "react";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
function Deals(props) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ik, setik] = useState(0);

  const alert = useAlert();

  const getDeals = async () => {
    //console.log("bhjbh",saloon_id);
    try {
      const value = await localStorage.getItem("loginkeysasa");
      if (!value) {
      } else {
        const { data: responseJson } = await axios.get(
          ip + "/api/deals/getDealsSaloon",
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        if (responseJson === 0 || !responseJson) {
          // do nothing
          setDeals([]);
          setLoading(false);
        } else {
          // console.log("llll: ",responseJson);
          responseJson.forEach(function (element, i) {
            element.num = i;
            // console.log(i);
          });
          console.log(responseJson);
          setDeals(responseJson);
          setLoading(false);
        }
      }
    } catch (ex) {
      console.error(ex);
    }
    //console.log("njknkjnjjj: ",deals);
  };

  const deleteDeals = async (id) => {
    // here goes query for deleting
    try {
      //console.log(id);
      const value = await localStorage.getItem("loginkeysasa");
      //  console.log('mkmkmkmmmmkmmk: ', value);
      const { data: responseJson } = await axios.delete(
        ip + "/api/deals/deleteDeal?dealID=" + id,

        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        // do nothing

        //  console.log("nothing");
        alert.show("Deal didn't deleted successfully!");

        if (localStorage.getItem("loginkeysasa")) {
          getDeals();
        } else {
          //setLoading(false);
          window.location.href = "/login/4";
        }
        setDeals([]);
      } else {
        alert.show("Deal has been deleted.");
        getDeals();
      }
    } catch (ex) {
      console.log(ex);
      console.log(ex.response.data);
    }
    // on recieving promise

    //console.log(HistoryAppointments);
    setLoading(false);
  };

  {
    if (ik === 0 && loading) {
      if (localStorage.getItem("loginkeysasa")) {
        setik(1);
        //  console.log("calllll"),
        getDeals();
        setLoading(false);
      } else {
        setLoading(false);
        window.location.href = "/login/4";
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    getDeals();
  }, [ik]);

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10" style={{ marginLeft: "3%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">My Saloon Deals</a>
          </nav>
          {localStorage.getItem("loginkeysasa") ? (
            <div className="row col-lg-12">
              {deals.map((deal) => (
                <div className="card col-lg-3">
                  <div class="card" style={{ margin: "1.5%" }}>
                    <div class="card-header bg-light">
                      {deal.saloonDealDetails.nameOfDeal.toUpperCase()}
                    </div>
                    <div class="card-body text-white bg-dark">
                      <h5 class="card-title">
                        Valued Rs.{" "}
                        {deal.saloonDealDetails.priceOfDeal.toFixed(0)}
                      </h5>
                      <p class="card-text">
                        Services included:
                        <span style={{ color: "lightgreen" }}>
                          {" "}
                          {deal.saloonDealDetails.servicesOfDeal}
                        </span>
                      </p>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <button
                          onClick={(nval) => {
                            // checkboxtheItem(deal);
                            //setToggleCheckBox(nval);
                            window.location.href = "/addDeals/2/" + deal._id;
                          }}
                          class="btn btn-primary"
                        >
                          Edit Deal
                        </button>
                        <button
                          onClick={(nval) => {
                            // checkboxtheItem(deal);
                            //setToggleCheckBox(nval);
                            deleteDeals(deal._id);
                          }}
                          class="btn btn-danger"
                        >
                          Delete Deal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

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
                window.location.href = "/addDeals/" + 1 + "/" + 0;
              }}
              style={{ width: "30%", padding: "1.5%", borderRadius: 50 }}
              class={"btn btn-dark"}
            >
              Add New Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deals;
