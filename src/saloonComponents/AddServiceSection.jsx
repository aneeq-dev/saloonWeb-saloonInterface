import React, { useState, useEffect } from "react";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import joi from "joi";

function AddServiceSection(props) {
  const [sectionName, setSectionName] = useState("");
  const [sectionok, setSectionok] = useState(true);

  const [serviceName, setServiceName] = useState("");
  const [serviceNameok, setServiceNameok] = useState(true);

  const [servicePrice, setServicePrice] = useState(0);
  const [servicePriceOk, setServicePriceOk] = useState(true);

  const [discount, setDiscount] = useState(0);
  const [discontok, setDiscountok] = useState(true);

  const [serviceInfo, setServiceInfo] = useState([]);

  const [tr, setTr] = useState(false);

  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState("");

  const screenNumber = props.match.params.screenNumber;

  const alert = useAlert();

  const validateInput = (data) => {
    // validating password
    var schema = joi.object({
      Section_Name: joi.string().min(8).max(60).required(),
    });
    const error = schema.validate({ Section_Name: data });
    // return error.error.details[0].message;
    if (error.error) {
      //console.log(error.error.details[0].message);
      setErrors(error.error.details[0].message);
      setSectionok(false);
      return false;
    } else {
      //console.log('ok');
      setSectionok(true);
      setErrors("");
      return true;
    }
  };

  const validateInputServiceName = (data) => {
    // validating password
    var schema = joi.object({
      service_name: joi.string().min(8).max(60).required(),
    });
    const error = schema.validate({ service_name: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      //console.log(error.error.details[0].message);
      setServiceNameok(false);
      return false;
    } else {
      console.log("ok");
      setServiceNameok(true);
      setErrors("");

      return true;
    }
  };

  const validateInputServicePrice = (data) => {
    // validating password
    var schema = joi.object({
      Price: joi.number().min(0).max(1000000).required(),
    });
    const error = schema.validate({ Price: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      //console.log(error.error.details[0].message);
      setServicePriceOk(false);
      return false;
    } else {
      //console.log('ok');
      setServicePriceOk(true);
      setErrors("");

      return true;
    }
  };

  const validateInputServiceDiscount = (data) => {
    // validating password
    var schema = joi.object({
      Discount: joi.number().min(0).max(100).required(),
    });
    const error = schema.validate({ Discount: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);

      //console.log(error.error.details[0].message);
      setDiscountok(false);
      return false;
    } else {
      //console.log('ok');
      setDiscountok(true);
      setErrors("");

      return true;
    }
  };

  const addSection = async () => {
    if (
      validateInput(sectionName) &&
      validateInputServiceName(serviceName) &&
      validateInputServicePrice(servicePrice) &&
      validateInputServiceDiscount(discount)
    ) {
      let obj = {
        name: sectionName,
        Services: [
          {
            name: serviceName,
            price: servicePrice,
            discount: discount,
          },
        ],
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        //console.log(value);

        const { data: responseJson } = await axios.post(
          ip + "/api/services/saveService",
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
          alert.show("Service section addition was Unsuccessful!");
        } else {
          alert.show("Service Section Added Successfully!");

          window.location.href = "/servicesForOwners";
        }
      } catch (ex) {
        //console.log(ex);
        setErrors(ex.response.data);

        //console.log(ex);
      }
    }
    setLoading(false);
  };

  const addService = async () => {
    if (
      validateInputServiceName(serviceName) &&
      validateInputServicePrice(servicePrice) &&
      validateInputServiceDiscount(discount)
    ) {
      let obj = {
        name: serviceName,
        price: servicePrice,
        discount: discount,
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        // console.log("mmmk: ", props);

        const { data: responseJson } = await axios.post(
          ip +
            "/api/services/PushService?sectionID=" +
            props.match.params.sectionID,
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
          alert.show("Service addition was Unsuccessful!");
        } else {
          alert.show("Service Added Successfully!");
          window.location.href = "/servicesForOwners";
        }
      } catch (ex) {
        // console.log(ex);
        setErrors(ex.response.data);

        // console.log(ex);
      }
    }
    setLoading(false);
  };

  const updateService = async () => {
    if (
      validateInputServiceName(serviceName) &&
      validateInputServicePrice(servicePrice) &&
      validateInputServiceDiscount(discount)
    ) {
      let obj = {
        name: serviceName,
        price: servicePrice,
        discount: discount,
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        // console.log("mmmk: ",props);

        const { data: responseJson } = await axios.post(
          ip +
            "/api/services/EditService?sectionID=" +
            props.match.params.sectionID +
            "&subserviceID=" +
            props.match.params.subserviceID,
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        // console.log(responseJson);
        //console.log("res",responseJson);
        if (!responseJson) {
          alert.show("Service Edit was Unsuccessful!");
          // do nothing
        } else {
          alert.show("Service Edited Successfully!");
          window.location.href = "/servicesForOwners";
        }
      } catch (ex) {
        // console.log(ex);
        setErrors(ex.response.data);

        // console.log(ex);
      }
    }
    setLoading(false);
  };

  const changeSectionName = async () => {
    if (validateInput(sectionName)) {
      let obj = {
        name: sectionName,
      };
      try {
        const value = await localStorage.getItem("loginkeysasa");
        // console.log("mmmk: ",props);

        const { data: responseJson } = await axios.put(
          ip +
            "/api/services/UpdateSectionName?sectionID=" +
            props.match.params.sectionID,
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        console.log(responseJson);
        //console.log("res",responseJson);
        if (!responseJson) {
          // do nothing
          alert.show("Updation was Unsuccessful!");
        } else {
          alert.show("Updated Successfully!");
          window.location.href = "/servicesForOwners";
        }
      } catch (ex) {
        // console.log(ex);
        setErrors(ex.response.data);

        //console.log(ex);
      }
    }
    setLoading(false);
  };

  const getServicesForUpdate = async () => {
    setLoading(true);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/services/getServiceForUpdate?sectionID=" +
          props.match.params.sectionID +
          "&subserviceID=" +
          props.match.params.subserviceID,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      if (!responseJson) {
      } else {
        // console.log("rec:", responseJson);
        setServiceInfo([responseJson]);
      }
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  const populate = () => {
    //console.log('personal info', PersonalInfo);
    if(!localStorage.getItem("loginkeysasa")){
      window.location.href="/login/4";
    }
    if (serviceInfo.length === 0) {
    } else {
      console.log(serviceInfo);
      setServiceName(serviceInfo[0].name);
      setServicePrice(serviceInfo[0].price.toString());
      setDiscount(serviceInfo[0].discount.toString());
    }
    //  setIsShowed2(true)
  };

  useEffect(() => {
    console.log("called: ");
    populate();
  }, [serviceInfo]);

  if (screenNumber == 3 && !tr) {
    getServicesForUpdate();
    setTr(true);
  } else if (screenNumber == 4 && !tr) {
    setSectionName(props.match.params.sectionName);
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
              {screenNumber == 1
                ? "Add Section"
                : screenNumber == 2
                ? "Add Service to section"
                : screenNumber == 3
                ? "Update Service"
                : screenNumber == 4
                ? "Update Section Name"
                : null}
            </a>
          </nav>

          {screenNumber == 1 || screenNumber == 4 ? (
            <div class="form-group">
              <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
                Section Name
              </label>
              <input
                class="form-control"
                type="text"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter section name..."
                onChange={(n) => {
                  //console.log(n.target.value);
                  setSectionName(n.target.value);
                  validateInput(n.target.value);
                }}
                value={sectionName}
                maxLength={100}
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  marginLeft: "4%",
                  width: "75%",
                  borderColor: sectionok ? "black" : "red",
                }}
              />
            </div>
          ) : null}

          {screenNumber == 4 ? null : (
            <div class="form-group">
              <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
                Name the Service
              </label>
              <input
                class="form-control"
                type="text"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter service name..."
                onChange={(n) => {
                  //console.log(n.target.value);
                  setServiceName(n.target.value);
                  validateInputServiceName(n.target.value);
                }}
                value={serviceName}
                maxLength={100}
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  marginLeft: "4%",
                  width: "75%",
                  borderColor: serviceNameok ? "black" : "red",
                }}
              />
            </div>
          )}

          {screenNumber == 4 ? null : (
            <div class="form-group">
              <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
                Enter Service Price (in RS.)
              </label>
              <input
                class="form-control"
                type="number"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter price..."
                onChange={(n) => {
                  setServicePrice(n.target.value);
                  validateInputServicePrice(n.target.value);
                }}
                value={servicePrice}
                maxLength={100}
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  marginLeft: "4%",
                  width: "75%",
                  borderColor: servicePriceOk ? "black" : "red",
                }}
              />
            </div>
          )}

          {screenNumber == 4 ? null : (
            <div class="form-group">
              <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
                Enter Service Discount
              </label>
              <input
                class="form-control"
                type="number"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter service discount..."
                onChange={(n) => {
                  setDiscount(n.target.value);
                  validateInputServiceDiscount(n.target.value);
                }}
                value={discount}
                maxLength={100}
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  marginLeft: "4%",
                  width: "75%",
                  borderColor: discontok ? "black" : "red",
                }}
              />
            </div>
          )}

          {screenNumber == 4 ? null : discount === 0 || !discount ? null : (
            <div>
              <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
                Discounted Price ={" "}
                {servicePrice - (discount / 100) * servicePrice}
              </label>
            </div>
          )}

          {errors ? (
            <div
              className="alert alert-danger"
              style={{ marginLeft: "4%", width: "75%" }}
            >
              {errors}
            </div>
          ) : null}

          <div style={{ marginLeft: "4%" }}>
            <Button
              className="btn btn-dark "
              style={{
                padding: "1%",
                paddingRight: "3%",
                paddingLeft: "3%",
                borderRadius: 50,
              }}
              onClick={() => {
                if (screenNumber == 1) {
                  addSection();
                } else if (screenNumber == 2) {
                  addService();
                } else if (screenNumber == 3) {
                  updateService();
                } else if (screenNumber == 4) {
                  changeSectionName();
                }
              }}
            >
              {screenNumber == 1
                ? "Add Section"
                : screenNumber == 2
                ? "Add Service"
                : screenNumber == 3
                ? "Update Service"
                : screenNumber == 4
                ? "Update Section Name"
                : null}
              <span className="caret"></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddServiceSection;
