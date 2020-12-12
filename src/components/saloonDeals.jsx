import React, { useState, useEffect } from "react";
import { FormText } from "react-bootstrap";
import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ip from "../ipadd/ip";
import jwtDecode from "jwt-decode";

import Cart from "./Cart";

function SaloonDeals(props) {
  const saloon_id = props.id;
  console.log("nj", props.id);
  const [loading, setLoading] = useState(true);
  const [set, setTr] = useState(false);
  const [deals, setDeals] = useState([]);
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [setse, setSe] = useState(true);
  const [cart, setCart] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const getDeals = async () => {
    //console.log("bhjbh",saloon_id);
    try {
      const value = await localStorage.getItem("loginkeysasa");
      const user = jwtDecode(value);

      const { data: responseJson } = await axios.get(
        ip + "/api/deals/getDeals?saloonID=" + user._id
      );
      if (responseJson === 0) {
        // do nothing
      } else {
        // console.log("llll: ",responseJson);
        responseJson.forEach(function (element, i) {
          element.num = i;
          // console.log(i);
        });
        setDeals(responseJson);
      }
    } catch (ex) {
      console.error(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDeals();
  }, [set]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-text text-white">Saloon Deals</div>
      </nav>
      {loading && deals.length === 0 ? (
        <ActivityIndicator />
      ) : deals.length === 0 ? (
        <div style={{ display:"flex", justifyContent:"center", margin:"2%"  }}>No deals found!</div>
      ) : (
        <div className="row col-lg-12">
          {deals.map((deal) => (
            <div className="card col-lg-3"  style={{ margin: "1.5%" }}>
              <div class="card" style={{ margin: "1.5%" }}>
                <div class="card-header bg-light">
                  {deal.saloonDealDetails.nameOfDeal.toUpperCase()}
                </div>
                <div class="card-body text-white bg-dark">
                  <h5 class="card-title">
                    Valued Rs. {deal.saloonDealDetails.priceOfDeal.toFixed(0)}
                  </h5>
                  <p class="card-text">
                    {deal.saloonDealDetails.servicesOfDeal}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SaloonDeals;
