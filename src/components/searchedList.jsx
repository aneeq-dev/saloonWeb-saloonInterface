import { Button, FormText } from "react-bootstrap";
import apiKey from "../keys/google_api_key";
import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import axios from "axios";
import joi, { string } from "joi";
import ip from "../ipadd/ip";
import ActivityIndicator from "react-activity-indicator";

import jwtDecode from "jwt-decode";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import ReactStars from "react-rating-stars-component";

import { NavLink } from "react-router-dom";

function SearchedList(props) {
  const lat = 31.5204;
  const long = 74.3587;
  const latdest = props.match.params.latdest;
  const longdest = props.match.params.longdest;

  const screenNumber = props.match.params.screenNumber;
  const [searchedPlaces, setSearchedPlaces] = useState([]);
  const [index, setIndex] = useState(0);
  const [lati, setlati] = useState(0);
  const [longi, setlongi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceSet, setPriceok] = useState(true);
  const [priceSet2, setPriceok2] = useState(true);
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState(0);
  const [price2, setPrice2] = useState(1000000);
  const [price5, setPrice5] = useState(0);
  const [price6, setPrice6] = useState(1000000);
  const [d, setD] = useState(false);
  const [rating, setRating] = useState(0);

  const [discount1, setDiscount1] = useState(0);
  const [discount2, setDiscount2] = useState(100);
  const [discountset, discountSetok] = useState(true);

  const [search, setSearch] = useState("Lahore");
  const [search2, setSearch2] = useState("Lahore");
  const [services, setServices] = useState("");

  const [predictions, setPredictions] = useState([]);
  const [distance, setMaxDistance] = useState(10);

  const alert = useAlert();

  const getRouteDirections = async () => {
    let destinationName = "";

    if (screenNumber == 3) {
      destinationName = props.match.params.placename;
    } else if (screenNumber == 1 || screenNumber == 2 || screenNumber == 4) {
      destinationName = search2;
      console.log("search2", search2);
    }

    try {
      console.log("here");
      const response = await axios.get(
        `https://aneeqahmad826-eval-prod.apigee.net/geocode?destinationName=${destinationName}`
        //  `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationName}&key=${apiKey}`
      );
      console.log(response);
      let json = await response.data;

      //console.log(json);

      setlati(json.results[0].geometry.location.lat);
      setlongi(json.results[0].geometry.location.lng);
      setLoading(true);
      console.log("loading to true");
      //console.log("lat: lng: ", lati, longi);
      if (screenNumber == 3) {
        nearestSaloons(
          json.results[0].geometry.location.lat,
          json.results[0].geometry.location.lng
        ).then(() => {
          setLoading(false);
          // setD(true);
        });
      } else if (screenNumber == 1) {
        nearestMaleSaloonswrtlocation(
          json.results[0].geometry.location.lat,
          json.results[0].geometry.location.lng
        ).then(() => {
          setLoading(false);
          //setD(true);
        });
      } else if (screenNumber == 2) {
        nearestFemaleSaloonswrtlocation(
          json.results[0].geometry.location.lat,
          json.results[0].geometry.location.lng
        ).then(() => {
          setLoading(false);
          //setD(true);
        });
      } else {
        bothSaloonsWithAllFilters(
          json.results[0].geometry.location.lat,
          json.results[0].geometry.location.lng
        ).then(() => {
          setLoading(false);
          //setD(true);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDestination = async (val) => {
    //console.log("mdj:", search);
    const apiUrl = `http://aneeqahmad826-eval-test.apigee.net/mapapiplace?target=${val}`;
    /*const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}
		&input=${val}
		&location=31.5204,74.3587
		&radius=2000`;*/
    try {
      const result = await axios.get(apiUrl); // calling the api
      console.log(result.data.predictions);
      const json = result.data; // storing json data from result

      setPredictions(json.predictions);
      console.log(json.predictions);
    } catch (err) {
      console.log(err);
    }
  };

  const Alerrt = (i) => {
    if (i === 1) {
      alert.show("No saloons found!");
    } else if (i === 2) {
      alert.show("No Male Saloons found!");
    } else if (i === 3) {
      alert.show("No female saloons found!");
    }
    setSearchedPlaces([]);
  };

  const nearestSaloons = async (latt, longg) => {
    console.log(latt, longg);
    const { data: responseJson } = await axios.get(
      ip + "/api/saloon/getNearSaloonsNearTo?lat=" + latt + "&lng=" + longg +"&dist="+distance
    );
    if (responseJson === 0) {
      // if no saloons found
      Alerrt(1);
    } else {
      setSearchedPlaces(responseJson);
    }
    setLoading(false);
  };

  const nearestSaloonswrtlocation = async () => {
    let storestate = [{ latitude: 31.5204, longitude: 74.3587 }];

    const { data: responseJson } = await axios.get(
      ip +
        "/api/saloon/getNearSaloonsNearTo?lat=" +
        storestate[0].latitude +
        "&lng=" +
        storestate[0].longitude+"&dist="+distance
    );
    if (responseJson === 0) {
      //Alerrt(1);
    } else {
      setSearchedPlaces(responseJson);
    }
    setLoading(false);
  };

  const nearestMaleSaloonswrtlocation = async (lati, lngi) => {
    console.log(services);

    try {
      const { data: responseJson } = await axios.get(
        ip +
          "/api/saloon/getNearMalePrice?lat=" +
          lati +
          "&lng=" +
          lngi +
          "&min=" +
          price +
          "&max=" +
          price2 +
          "&rating=" +
          rating +
          "&string=" +
          services +
          "&min2=" +
          price5 +
          "&max2=" +
          price6 +
          "&discountmin=" +
          discount1 +
          "&discountmax=" +
          discount2+"&dist="+distance
      );
      console.log("mkmkkkklll: ", responseJson);
      if (responseJson === 0) {
        setSearchedPlaces([]);

        //Alerrt(2);
      } else {
        setSearchedPlaces(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }
    setLoading(false);
  };

  const nearestFemaleSaloonswrtlocation = async (lati, lngi) => {
    //getNearFemalePrice
    //  let storestate = [{ latitude: 31.5204, longitude: 74.3587 }];
    try {
      const { data: responseJson } = await axios.get(
        ip +
          "/api/saloon/getNearFemalePrice?lat=" +
          lati +
          "&lng=" +
          lngi +
          "&min=" +
          price +
          "&max=" +
          price2 +
          "&rating=" +
          rating +
          "&string=" +
          services +
          "&min2=" +
          price5 +
          "&max2=" +
          price6 +
          "&discountmin=" +
          discount1 +
          "&discountmax=" +
          discount2+"&dist="+distance
      );
      console.log("mkmkkkklll: ", responseJson);
      if (responseJson === 0) {
        setSearchedPlaces([]);

        //Alerrt(2);
      } else {
        setSearchedPlaces(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }

    setLoading(false);
  };

  const bothSaloonsWithAllFilters = async (lati, lngi) => {
    //getNearFemalePrice
    //  let storestate = [{ latitude: 31.5204, longitude: 74.3587 }];
    try {
      const { data: responseJson } = await axios.get(
        ip +
          "/api/saloon/getWrtAllFilters?lat=" +
          lati +
          "&lng=" +
          lngi +
          "&min=" +
          price +
          "&max=" +
          price2 +
          "&rating=" +
          rating +
          "&string=" +
          services +
          "&min2=" +
          price5 +
          "&max2=" +
          price6 +
          "&discountmin=" +
          discount1 +
          "&discountmax=" +
          discount2+"&dist="+distance
      );
      console.log("mkmkkkklll: ", responseJson);
      if (responseJson === 0) {
        setSearchedPlaces([]);

        //Alerrt(2);
      } else {
        setSearchedPlaces(responseJson);
      }
    } catch (ex) {
      console.log(ex);
    }

    setLoading(false);
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const getData = () => {
    if (
      validate() &&
      validate2(price5, price6) &&
      validate3(discount1, discount2)
    ) {
      if (screenNumber == 0) {
        setLoading(true);
        nearestSaloonswrtlocation().then(() => {
          setLoading(false);
        });
      } else if (screenNumber == 1) {
        if (!priceSet) {
          //
        } else {
          /*nearestMaleSaloonswrtlocation(31, 74).then(() => {
          setLoading(false);
          //setD(true);
        });*/
          getRouteDirections();
        }
      } else if (screenNumber == 2) {
        /* nearestFemaleSaloonswrtlocation(31, 74).then(() => {
        setLoading(false);
        //setD(true);
      });*/
        getRouteDirections();
      } else if (screenNumber == 3) {
        getRouteDirections();
      } else {
        console.log("calin");

        getRouteDirections();
      }
    }
  };

  const validate = (price, price2) => {
    var schema = joi.object({
      a: joi.number().integer(),
      Phone: joi.number().min(0).max(9999999).less(joi.ref("a")),
    });
    const error = schema.validate({ Phone: price, a: price2 });
    // console.log(error.error);
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      setPriceok(false);
      return false;
    } else {
      var schema = joi.object({
        Phone2: joi.number().min(0).max(9999999),
      });
      const error = schema.validate({ Phone2: price2 });
      if (error.error) {
        setPriceok(false);
        return false;
      } else {
        setPriceok(true);
        return true;
      }
      /*
    // if(price===price2)
    if (price > price2) {
      //ok
      setPriceok(false);
      return false;
    } else if (price < 0) {
      setPriceok(false);
      return false;
    } else if (price2 < 0) {
      setPriceok(false);
      return false;
    } else {
      setPriceok(true);
      return true;
    }*/
    }
  };

  const validate2 = (price5, price6) => {
    // if(price===price2)

    var schema = joi.object({
      a: joi.number().integer(),
      Phone: joi.number().min(0).max(9999999).less(joi.ref("a")),
    });
    const error = schema.validate({ Phone: price5, a: price6 });
    console.log(error.error);
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      setPriceok2(false);
      return false;
    } else {
      var schema = joi.object({
        Phone2: joi.number().min(0).max(9999999),
      });
      const error = schema.validate({ Phone2: price6 });
      if (error.error) {
        setPriceok2(false);
        return false;
      } else {
        setPriceok2(true);
        return true;
      }
    }
    /*
    console.log(price5,price6);
    if (price5 > price6 || price5 < 0 || price6 < 0) {
      console.log(price5>price6);
      console.log(price5<0);
      console.log(price6<0);
      
      //ok
      setPriceok2(false);
      return false;
    } else {
      setPriceok2(true);
      return true;
    }*/
  };

  const validate3 = (discount1, discount2) => {
    var schema = joi.object({
      a: joi.number().integer(),
      Phone: joi.number().min(0).max(100).less(joi.ref("a")),
    });
    const error = schema.validate({ Phone: discount1, a: discount2 });
    console.log(error.error);
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      discountSetok(false);
      return false;
    } else {
      var schema = joi.object({
        Phone2: joi.number().min(0).max(100),
      });
      const error = schema.validate({ Phone2: discount2 });
      if (error.error) {
        discountSetok(false);
        return false;
      } else {
        discountSetok(true);
        return true;
      }
    } /*
    // if(price===price2)
    console.log(discount1, discount2);
    if (
      discount1 > discount2 ||
      discount1 < 0 ||
      discount2 < 0 ||
      discount1 > 100 ||
      discount2 > 100
    ) {
      //ok
      discountSetok(false);
      return false;
    } else {
      discountSetok(true);
      return true;
    }*/
  };

  useEffect(() => {
    getData();
  }, [props.match.params.placename]);

  useEffect(() => {
    getData();
  }, [props.match.params.screenNumber]);

  useEffect(() => {
    getData();
    console.log("again1");
  }, [search2, distance]);

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10" style={{ marginLeft: "2.5%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">
              {screenNumber == 0
                ? "Search Saloons"
                : screenNumber == 1
                ? "Male Saloons "
                : screenNumber == 2
                ? "Female Saloons "
                : screenNumber == 3
                ? "Nearest Saloons to " + props.match.params.placename
                : screenNumber == 4
                ? "Search Using All Filters"
                : "No Such Screen Found"}
            </a>
          </nav>

          <div>
            <div class="pos-f-t">
              <div class="collapse" id="navbarToggleExternalContent5">
                <div class="bg-dark p-4">
                  <nav
                    class="navbar navbar-dark bg-light justify-content-between"
                    style={{ paddingLeft: "4%" }}
                  >
                    <div class="pos-f-t" style={{ width: "100%" }}>
                      <div class="collapse" id="navbarToggleExternalContent">
                        <div class="bg-dark p-4">
                          <nav
                            class="navbar navbar-dark bg-light justify-content-between"
                            style={{ paddingLeft: "4%" }}
                          >
                            <form className="form-inline ">
                              <a
                                class="navbar-brand"
                                style={{ color: "black" }}
                              >
                                {screenNumber == 1
                                  ? "Show male saloons near to: "
                                  : screenNumber == 2
                                  ? "Show female saloons near to: "
                                  : null}
                              </a>
                              <input
                                className="form-control "
                                type="search"
                                placeholder="Search Saloons Near to"
                                aria-label="Search"
                                onChange={(n) => {
                                  // handleChange(n);
                                  setSearch(n.target.value);
                                  onChangeDestination(n.target.value);
                                  // validate();
                                  //console.log(search);
                                }}
                                value={search}
                              />

                              <div class="dropdown">
                                <div class="dropdown-menu" style={{}}>
                                  {predictions &&
                                    predictions.map((prediction, i) => (
                                      <div key={i}>
                                        <li class="dropdown-item space2">
                                          <Button
                                            className="btn-dark"
                                            style={{ width: "100%" }}
                                            onClick={() => {
                                              setSearch(
                                                prediction.structured_formatting
                                                  .main_text
                                              );
                                              setSearch2(
                                                prediction.structured_formatting
                                                  .main_text
                                              );
                                              getData();
                                            }}
                                          >
                                            <FormText style={{ fontSize: 20 }}>
                                              {
                                                prediction.structured_formatting
                                                  .main_text
                                              }
                                            </FormText>
                                            <FormText>
                                              {
                                                prediction.structured_formatting
                                                  .secondary_text
                                              }
                                            </FormText>
                                          </Button>
                                        </li>
                                        <div className="dropdown-divider "></div>
                                      </div>
                                    ))}
                                </div>
                                <button
                                  class="btn btn-dark "
                                  type="button"
                                  id="dropdownMenuButton"
                                  data-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  Search
                                </button>
                              </div>
                            </form>

                            <div className="col-sm-12 dropdown-divider space bg-dark"></div>

                            <form className="form-inline ">
                              <label
                                class="navbar-brand"
                                for="exampleInputEmail1"
                                style={{ marginLeft: "0%", color: "black" }}
                              >
                                Saloon Min Price between
                              </label>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Min price"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setPrice(n.target.value);
                                  validate(n.target.value, price2);
                                }}
                                value={price}
                                maxLength={7}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  width: "18%",
                                  borderColor: priceSet ? "black" : "red",
                                }}
                              />

                              <a
                                class="navbar-brand"
                                style={{ marginLeft: "2%", color: "black" }}
                              >
                                and
                              </a>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Max price"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setPrice2(n.target.value);
                                  validate(price, n.target.value);
                                }}
                                value={price2}
                                maxLength={13}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  marginRight: "2%",
                                  width: "18%",
                                  borderColor: priceSet ? "black" : "red",
                                }}
                              />
                              <Button
                                onClick={() => getRouteDirections()}
                                className="btn-dark"
                              >
                                Done
                              </Button>
                            </form>
                          </nav>
                        </div>
                      </div>
                      <nav class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0">
                        <button
                          class="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#navbarToggleExternalContent"
                          aria-controls="navbarToggleExternalContent"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <h5
                          className="mr-auto mt-2 mt-lg-0"
                          style={{ paddingLeft: "2%", color: "white" }}
                        >
                          Saloon Filters
                        </h5>
                      </nav>
                    </div>

                    <div class="pos-f-t" style={{ width: "100%" }}>
                      <div class="collapse" id="navbarToggleExternalContent2">
                        <div class="bg-dark p-4">
                          <nav
                            class="navbar navbar-dark bg-light justify-content-between"
                            style={{ paddingLeft: "4%" }}
                          >
                            <form className="form-inline ">
                              <a
                                class="navbar-brand"
                                style={{ color: "black" }}
                              >
                                {screenNumber == 1 || screenNumber == 2
                                  ? "Saloon with service: "
                                  : null}
                              </a>
                              <input
                                className="form-control "
                                type="search"
                                placeholder="Any service you want..."
                                aria-label="Search"
                                onChange={(n) => {
                                  // handleChange(n);
                                  setServices(n.target.value);
                                  //onChangeDestination(n.target.value);
                                  // validate();
                                  //console.log(search);
                                }}
                                value={services}
                              />

                              <div>
                                <Button
                                  className="btn-dark "
                                  onClick={() => getData()}
                                >
                                  Search
                                </Button>
                              </div>
                            </form>

                            <div className="col-sm-12 dropdown-divider space bg-dark"></div>

                            <form className="form-inline ">
                              <label
                                class="navbar-brand"
                                for="exampleInputEmail1"
                                style={{ marginLeft: "0%", color: "black" }}
                              >
                                Service Min Price
                              </label>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Min price"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setPrice5(n.target.value);
                                  validate2(n.target.value, price6);
                                }}
                                value={price5}
                                maxLength={7}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  width: "18%",
                                  borderColor: priceSet2 ? "black" : "red",
                                }}
                              />

                              <a
                                class="navbar-brand"
                                style={{ marginLeft: "2%", color: "black" }}
                              >
                                Service Max Price
                              </a>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Max price"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setPrice6(n.target.value);
                                  validate2(price5, n.target.value);
                                }}
                                value={price6}
                                maxLength={13}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  width: "18%",
                                  marginRight: "2%",
                                  borderColor: priceSet2 ? "black" : "red",
                                }}
                              />
                              <Button
                                onClick={() => getRouteDirections()}
                                className="btn-dark"
                              >
                                Done
                              </Button>
                            </form>
                            <div className="col-sm-12 dropdown-divider space bg-dark"></div>
                            <form className="form-inline ">
                              <label
                                class="navbar-brand"
                                for="exampleInputEmail1"
                                style={{ marginLeft: "0%", color: "black" }}
                              >
                                Min Discount (in %)
                              </label>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Min discount"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setDiscount1(n.target.value);
                                  validate3(n.target.value, discount2);
                                }}
                                value={discount1}
                                maxLength={7}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  width: "18%",
                                  borderColor: discountset ? "black" : "red",
                                }}
                              />

                              <a
                                class="navbar-brand"
                                style={{ marginLeft: "2%", color: "black" }}
                              >
                                Max Discount (in %)
                              </a>
                              <input
                                class="form-control"
                                type="number"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Max discount"
                                onChange={(n) => {
                                  //console.log(n.target.value);
                                  setDiscount2(n.target.value);
                                  validate3(discount1, n.target.value);
                                }}
                                value={discount2}
                                maxLength={13}
                                style={{
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  width: "18%",
                                  marginRight: "2%",
                                  borderColor: discountset ? "black" : "red",
                                }}
                              />
                              <Button
                                onClick={() => getRouteDirections()}
                                className="btn-dark"
                              >
                                Done
                              </Button>
                            </form>
                          
                          </nav>
                        </div>
                      </div>
                      <nav class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0">
                        <button
                          class="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#navbarToggleExternalContent2"
                          aria-controls="navbarToggleExternalContent2"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <h5
                          className="mr-auto mt-2 mt-lg-0"
                          style={{ paddingLeft: "2%", color: "white" }}
                        >
                          Service Filters
                        </h5>
                      </nav>
                    </div>

                    <div class="pos-f-t" style={{ width: "100%" }}>
                      <div class="collapse" id="navbarToggleExternalContent3">
                        <div class="bg-dark p-4">
                          <nav
                            class="navbar navbar-dark bg-light justify-content-between"
                            style={{ paddingLeft: "4%" }}
                          >
                            <form className="form-inline ">
                              <a
                                class="navbar-brand"
                                style={{ color: "black" }}
                              >
                                {screenNumber == 1 || screenNumber == 2
                                  ? "Saloon Rating with "
                                  : null}
                              </a>

                              <div>
                                <ReactStars
                                  count={5}
                                  edit={true}
                                  size={24}
                                  onChange={ratingChanged}
                                  activeColor="#ffd700"
                                  value={rating}
                                />
                              </div>
                              <a
                                class="navbar-brand mr-2"
                                style={{
                                  color: "black",
                                  paddingLeft: "2%",
                                }}
                              >
                                {screenNumber == 1 || screenNumber == 2
                                  ? "stars and up!"
                                  : null}
                              </a>

                              <div style={{ marginRight: "2.5%" }}>
                                <Button
                                  className=" btn-dark "
                                  type="button"
                                  onClick={() => {
                                    getData();
                                  }}
                                >
                                  Search
                                </Button>
                              </div>
                            </form>

                            <div className="col-sm-12 dropdown-divider space bg-dark"></div>
                          </nav>
                        </div>
                      </div>
                      <nav class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0">
                        <button
                          class="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#navbarToggleExternalContent3"
                          aria-controls="navbarToggleExternalContent3"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <h5
                          className="mr-auto mt-2 mt-lg-0"
                          style={{ paddingLeft: "2%", color: "white" }}
                        >
                          Rating Filter
                        </h5>
                      </nav>
                    </div>

                 
                    <div class="pos-f-t" style={{ width: "100%" }}>
                      <div class="collapse" id="navbarToggleExternalContent6">
                        <div class="bg-dark p-4">
                          <nav
                            class="navbar navbar-dark bg-light justify-content-between"
                            style={{ paddingLeft: "4%" }}
                          >
                            <form className="form-inline ">
                              <div>
                                <a
                                  class="navbar-brand"
                                  style={{ color: "black" }}
                                >
                                  Distance of around (in km):
                                </a>
                                <input
                                  className="form-control "
                                  type="number"
                                  min={0}
                                  max={50}
                                  placeholder="Search Saloons Near to"
                                  aria-label="Search"
                                  onChange={(n) => {
                                    // handleChange(n);
                                    setMaxDistance(n.target.value);
                                  }}
                                  value={distance}
                                />
                              </div>
                            </form>{" "}
                          </nav>
                        </div>
                      </div>
                      <nav
                        class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0"
                        style={{ marginBottom: "2.5%" }}
                      >
                        <button
                          class="navbar-toggler"
                          type="button"
                          data-toggle="collapse"
                          data-target="#navbarToggleExternalContent6"
                          aria-controls="navbarToggleExternalContent6"
                          aria-expanded="false"
                          aria-label="Toggle navigation"
                        >
                          <span class="navbar-toggler-icon"></span>
                        </button>
                        <h5
                          className="mr-auto mt-2 mt-lg-0"
                          style={{ paddingLeft: "2%", color: "white" }}
                        >
                          Distance Filter
                        </h5>
                      </nav>
                    </div>
                  </nav>
                </div>
              </div>
              <nav
                class="navbar navbar-dark bg-dark mr-auto mt-2 mt-lg-0"
                style={{ marginBottom: "2.5%" }}
              >
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarToggleExternalContent5"
                  aria-controls="navbarToggleExternalContent5"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>
                <h5
                  className="mr-auto mt-2 mt-lg-0"
                  style={{ paddingLeft: "2%", color: "white" }}
                >
                  Filters
                </h5>
              </nav>
            </div>
          </div>
          {loading ? <ActivityIndicator /> : null}
          {
            <h3 style={{ paddingLeft: "4%", color: "red" }}>
              {!priceSet || !priceSet2
                ? "Enter Price filters correctly!"
                : null}
            </h3>
          }

          {
            <div style={{ marginLeft: "2%" }}>
              <h4 style={{ marginLeft: "2%" }}>Filters Summary</h4>
              <p className="bg-light" style={{ padding: "2%" }}>
                Searching Near to:{" "}
                <span style={{ color: "blue" }}>{search}</span> <br />
                Saloon Min price: <span style={{ color: "blue" }}>
                  {price}
                </span>{" "}
                Saloon Max price:{" "}
                <span style={{ color: "blue" }}>{price2}</span> <br />
                Service Search tag:{" "}
                <span style={{ color: "blue" }}>
                  {services ? services : "no"}{" "}
                </span>
                <br />{" "}
                {services ? (
                  <div>
                    <span>
                      Service Min Price:{" "}
                      <span style={{ color: "blue" }}>{price5}</span> Service
                      Max Price: <span style={{ color: "blue" }}>{price6}</span>
                    </span>
                  </div>
                ) : null}
                Discount on Service: Min{" "}
                <span style={{ color: "blue" }}>{discount1} </span>
                Max <span style={{ color: "blue" }}>{discount2}</span>
                <br />
                Rating: <span style={{ color: "blue" }}>{rating}</span> star and
                up.
                <br />
                Distance around selected location: (in km) <span style={{ color: "blue" }}>{distance} km</span> 
              </p>
            </div>
          }

          {searchedPlaces.length === 0 && priceSet ? (
            <div>
              <h4 style={{ paddingLeft: "4%", textAlign: "center" }}>
                No Saloons found!
              </h4>
            </div>
          ) : null}
          <div className="col col-sm-10">
            <div className="row col-lg-12" style={{ marginBottom: "2%" }}>
              {searchedPlaces.map((cat, j) => (
                <div
                  className="card col-md-5"
                  style={{
                    marginLeft: "2%",
                    marginBottom: "4%",
                    marginRight: "5%",
                  }}
                  key={j}
                >
                  <img
                    className="card-img-top"
                    src={cat.saloonBestImage}
                    alt="Card image cap"
                  />
                  <FormText
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      backgroundColor: "red",
                      fontSize: 13,
                      padding: 5,
                    }}
                  >
                    Upto {cat.saloonDiscount}% off
                  </FormText>
                  <FormText
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      backgroundColor: "red",
                      fontSize: 13,
                      padding: 5,
                    }}
                  >
                    {cat.saloonGender === "male" ? "For Mens" : "For Females"}
                  </FormText>

                  <div className="card-body">
                    <h5 className="card-title">{cat.saloonName}</h5>
                    <p className="card-text">{cat.saloonBestServices}</p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Minimum price RS. {cat.saloonMinPrice}
                    </li>
                    <li className="list-group-item">
                      Rating
                      <ReactStars
                        count={5}
                        // onChange={ratingChanged}
                        edit={false}
                        size={24}
                        activeColor="#ffd700"
                        value={cat.saloonOverallRating}

                      />
                      <div>({cat.numOfReviews})</div>
                    </li>
                  </ul>
                  <div className="card-body">
                    <Button
                      onClick={() => {
                        window.location.href =
                          "/saloonProfile/goto/" + cat._id + "/1";
                      }}
                      style={{ width: "100%", padding: "5%" }}
                      className="btn-secondary"
                    >
                      Open Saloon Profile
                    </Button>
                  </div>
                  <div
                    className="card-body"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      onClick={() => {
                        window.open(
                          "https://www.google.com/maps/dir//" +
                            cat.saloonAddress.saloonLat +
                            "," +
                            cat.saloonAddress.saloonlng +
                            "/@31.4366919,74.2910565,21z"
                        );
                      }}
                      className="nav-link"
                    >
                      Goto Saloon Location
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchedList;
