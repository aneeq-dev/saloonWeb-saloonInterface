import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import React, { useState, useEffect } from "react";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import joi from "joi";
import { Button } from "react-bootstrap";

function AddDeals(props) {
  const [dealName, setdealName] = useState("");
  const [dealNameok, setdealNameok] = useState(true);

  const [dealPrice, setdealPrice] = useState(0);
  const [dealPriceOk, setdealPriceOk] = useState(true);

  const [services, setServices] = useState("");
  const [servicesok, setservicesok] = useState(true);

  const [tr, setTr] = useState(false);
  const [loading, setLoading] = useState(true);

  const [serviceInfo, setServiceInfo] = useState([]);

  const screenNumber = props.match.params.screenNumber;
  const [errors, setErrors] = useState("");

  const alert = useAlert();

  const validateInputDealName = (data) => {
    // validating password
    var schema = joi.object({
      Name: joi.string().min(8).max(80).required(),
    });
    const error = schema.validate({ Name: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      //console.log(error.error.details[0].message);
      setdealNameok(false);
      return false;
    } else {
      //console.log("ok");
      setdealNameok(true);
      setErrors("");

      return true;
    }
  };

  const validateInputDealPrice = (data) => {
    // validating password
    var schema = joi.object({
      Price: joi.number().min(0).max(1000000).required(),
    });
    const error = schema.validate({ Price: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      //console.log(error.error.details[0].message);
      setdealPriceOk(false);
      return false;
    } else {
      //console.log("ok");
      setdealPriceOk(true);
      setErrors("");

      return true;
    }
  };

  const validateInputServiceServices = (data) => {
    // validating password
    var schema = joi.object({
      Services: joi.string().min(8).max(150).required(),
    });
    const error = schema.validate({ Services: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      // console.log(error.error.details[0].message);
      setservicesok(false);
      return false;
    } else {
      // console.log("ok");
      setservicesok(true);
      setErrors("");

      return true;
    }
  };

  const addDeal = async () => {
    if (
      validateInputDealName(dealName) &&
      validateInputDealPrice(dealPrice) &&
      validateInputServiceServices(services)
    ) {
      let obj = {
        saloonDealDetails: {
          nameOfDeal: dealName,
          servicesOfDeal: services,
          priceOfDeal: dealPrice,
        },
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        //console.log("mmmk: ", props);

        const { data: responseJson } = await axios.post(
          ip + "/api/deals/saveDeal?",
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //console.log(responseJson);
        //console.log("res",responseJson);
        if (!responseJson) {
          // do nothing
          alert.show("Deal addition was Unsuccessful!");

          // console.log("nothing");
        } else {
          alert.show("Deal Added Successfully!");
          window.location.href = "/saloondeals";

          //props.navigation.goBack();
        }
      } catch (ex) {
        console.log(ex);
        setErrors(ex.response.data);

        console.log(ex);
      }
    }
    setLoading(false);
  };

  const updateService = async () => {
    if (
      validateInputDealName(dealName) &&
      validateInputDealPrice(dealPrice) &&
      validateInputServiceServices(services)
    ) {
      let obj = {
        nameOfDeal: dealName,
        servicesOfDeal: services,
        priceOfDeal: dealPrice,
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        // console.log("mmmk: ",props);

        const { data: responseJson } = await axios.put(
          ip + "/api/deals/EditService?dealID=" + props.match.params.dealID,

          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        //.log(responseJson);
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show("Service Edition was Unsuccessful!");
        } else {
          alert.show("Service Edited Successfully!");
          window.location.href = "/saloondeals";
        }
      } catch (ex) {
        console.log(ex);
        setErrors(ex.response.data);

        console.log(ex);
      }
    }
    setLoading(false);
  };

  const getDealsForUpdate = async () => {
    //console.log("bhjbh",saloon_id);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/deals/getDealsSaloonWRTdealID?dealID=" +
          props.match.params.dealID,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      if (responseJson === 0 || !responseJson) {
        // do nothing
        setServiceInfo([]);
        setLoading(false);
      } else {
        // console.log("llll: ",responseJson);
        responseJson.forEach(function (element, i) {
          element.num = i;
          // console.log(i);
        });
        //console.log(responseJson);
        setServiceInfo(responseJson);
        setLoading(false);
      }
    } catch (ex) {
      console.log(ex);
    }
    //console.log("njknkjnjjj: ",deals);
  };

  const populate = () => {
    //console.log('personal info', PersonalInfo);
    if(!localStorage.getItem("loginkeysasa")){
      window.location.href="/login/4";
    }
    if (serviceInfo.length === 0) {
    } else {
      console.log(serviceInfo);
      setdealName(serviceInfo[0].saloonDealDetails.nameOfDeal.toString());
      setServices(serviceInfo[0].saloonDealDetails.servicesOfDeal.toString());
      setdealPrice(serviceInfo[0].saloonDealDetails.priceOfDeal.toString());
    }
    //  setIsShowed2(true)
  };

  useEffect(() => {
    //console.log("mmk: ", serviceInfo);
    populate();
  }, [serviceInfo]);

  if (screenNumber == 2 && !tr) {
    getDealsForUpdate();
    setTr(true);
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
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">
              {screenNumber == 1 ? "Add Deal" : "Update Deal"}
            </a>
          </nav>

          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Deal Name
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter deal name..."
              onChange={(n) => {
                //console.log(n.target.value);
                setdealName(n.target.value);
                validateInputDealName(n.target.value);
              }}
              value={dealName}
              maxLength={100}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: dealNameok ? "black" : "red",
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Deal Price
            </label>
            <input
              class="form-control"
              type="number"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter deal price..."
              onChange={(n) => {
                //console.log(n.target.value);
                setdealPrice(n.target.value);
                validateInputDealPrice(n.target.value);
              }}
              value={dealPrice}
              maxLength={100}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: dealPriceOk ? "black" : "red",
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Deal Services
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter deal services..."
              onChange={(n) => {
                //console.log(n.target.value);
                setServices(n.target.value);
                validateInputServiceServices(n.target.value);
              }}
              value={services}
              maxLength={100}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: servicesok ? "black" : "red",
              }}
            />
          </div>

          {errors ? (
            <div
              className="alert alert-danger"
              style={{ marginLeft: "4%", width: "75%" }}
            >
              {errors}
            </div>
          ) : null}

          <div
            style={{
              marginLeft: "4%",
            }}
          >
            <Button
              className="btn btn-dark "
              onClick={() => {
                if (screenNumber == 1) {
                  addDeal();
                } else if (screenNumber == 2) {
                  updateService();
                }
              }}
              style={{
                padding: "1%",
                borderRadius: 50,
                paddingLeft: "3%",
                paddingRight: "3%",
              }}
            >
              {screenNumber == 1 ? "Add Deal" : "Update Deal"}
              <span className="caret"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDeals;
