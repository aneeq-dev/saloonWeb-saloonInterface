import React, { useState, useEffect } from "react";
import { FormText } from "react-bootstrap";
import SaloonDeals from "./saloonDeals";
import SaloonServices from "./SaloonServices";
import axios from "axios";
import ip from "../ipadd/ip";

function Cart(props) {
  const [cart, setCart] = useState([]);
  const [sercart, setSerCart] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [setse, setSe] = useState(true);
  const [set, setTr] = useState(false);
  const [dealsfromdb, setdealsfromdb] = useState([]);
  const [services, setServices] = useState([]);

  const cartTotalling = () => {
    var i;
    var len2 = sercart.length;
    var len = cart.length;
    var total = 0;
    var p = 0;
    for (i = 0; i < len2; i++) {
      if (!(sercart[i].discount === 0)) {
        p = sercart[i].price - sercart[i].price * (sercart[i].discount / 100);
        total = total + p;
      } else {
        total = total + sercart[i].price;
      }
    }
    for (i = 0; i < len; i++) {
      total = total + cart[i].saloonDealDetails.priceOfDeal;
    }
    // console.log("total: ",total);
    setCartTotal(total);
  };

  Cart.getCart = () => {
    return cart;
  };

  Cart.getserCart = () => {
    return sercart;
  };

  Cart.gettotal = () => {
    return cartTotal;
  };

  Cart.cartIsOkay = () => {
    if (cartTotal === 0) {
      return false;
    } else {
      return true;
    }
  };

  Cart.updateme = () => {
    if (setse) {
      setSe(false);
    } else {
      setSe(true);
    }
  };

  const c = () => {
    let c = [];
    var total = 0;
    c = SaloonServices.getMenuCartonlyforupdate();
    //console.log("c: ",c);
    for (var i = 0; i < c.length; i++) {
      total = total + (c[i].price - c[i].price * (c[i].discount / 100));
    }
    let d = [];
    d = SaloonDeals.getDealsCartonlyforUpdate();
    for (var i = 0; i < d.length; i++) {
      total = total + d[i].saloonDealDetails.priceOfDeal;
    }
    //console.log("d: ",d);

    return total;
  };

  Cart.AddItemsToArray = (item) => {
    // console.log("hrtr");
    //  console.log("cart in cart: ",cart);
    const checksIfExists = cart.includes(item);
    // if already in cart then remove
    checksIfExists
      ? //console.log('already addded')
        console.log()
      : // else add it to cart
        cart.push(item);
    toggle ? setToggle(false) : setToggle(true);
    // console.log("i deal checked");
    cartTotalling();
    //console.log("cart in cart: ",cart);
  };

  Cart.AddServicesToArray = (item) => {
    // console.log("hrtr");
    //  console.log("cart in cart: ",cart);
    const checksIfExists = sercart.includes(item);
    // if already in cart then remove
    checksIfExists
      ? //console.log('already addded')
        console.log()
      : // else add it to cart
        sercart.push(item);
    toggle ? setToggle(false) : setToggle(true);
    // console.log("i deal checked");
    //console.log("cfgv: ",sercart);
    cartTotalling();
    //console.log("cart in cart: ",cart);
  };

  // if already exists then remove from cart
  Cart.RemoveItemFromArray = (it) => {
    const arr = cart.filter((i) => i != it); // except the item
    var i, fLen;
    fLen = cart.length;
    for (i = 0; i < fLen; i++) {
      cart.pop(i);
    }
    for (i = 0; i < arr.length; i++) {
      cart.push(arr[i]);
    }
    toggle ? setToggle(false) : setToggle(true);
    cartTotalling();
  };

  // if already exists then remove from cart
  Cart.RemoveServicesFromArray = (it) => {
    const arr = sercart.filter((i) => i != it); // except the item
    var i, fLen;
    fLen = sercart.length;
    for (i = 0; i < fLen; i++) {
      sercart.pop(i);
    }
    for (i = 0; i < arr.length; i++) {
      sercart.push(arr[i]);
    }
    toggle ? setToggle(false) : setToggle(true);
    cartTotalling();
  };

  const getappps = async () => {
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/appointments/getConfingAppointmentDeals?appointmentID=" +
          props.app_id,
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
        var deal = responseJson[0].deals;
        console.log("de2: ", deal);
        deal.forEach(function (element, i) {
          element.isSelected = false;
          // console.log(i);
        });
        //console.log("l: ", deal);
        setdealsfromdb(deal);
        //setSelectedDeals(responseJson[0].deals);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  const getRegServices = async () => {
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/appointments/getConfingAppointmentServices?appointmentID=" +
          props.app_id,
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
        //console.log("mmmm: ",responseJson[0].deals);
        //console.log("i: ",c);

        //selectedDeals.push(responseJson[0].deals);
        // console.log("mi: ",responseJson);
        //;
        //console.log("mkmmk: ",c);
        setServices(responseJson[0].services);
        // setTr(true);
        //   console.log('shmn: ',selectedDeals);
        // return responseJson[0].deals;
        // Deals.netCartOnlyForUpdate(responseJson[0].deals);
      }
    } catch (ex) {
      console.log(ex.response.data);
    }
  };

  useEffect(() => {
    if (props.screenNumber == 2 || props.screenNumber==3) {
      getappps();
      getRegServices();
    }
  }, [set]);

  return (
    <div style={{ marginBottom: "2.5%" }}>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ marginBottom: "1.5%" }}
      >
        <div className="navbar-text text-white">Your Cart</div>
      </nav>

      {props.screenNumber == 2 || props.screenNumber==3 ? (
        <div
          style={{
            width: "50%",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            bottom: 0,
            borderWidth: 1,
            backgroundColor: "black",
          }}
          className="bg-secondary"
        >
          <div class="pos-f-t">
            <div class="collapse" id="navbarToggleExternalContent2">
              <div class="bg-dark p-4">
                <li className="list-group-item ">
                  <div>
                    <ul class="list-group">
                      <li
                        class="list-group-item bg-light"
                        style={{ textAlign: "center" }}
                      >
                        Services Registered
                      </li>
                      {!(services.length === 0)
                        ? services.map((itemk) => (
                            <li
                              key={itemk._id}
                              className="list-group-item"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <h6>{itemk.name}</h6>
                              <h6
                                style={{
                                  display: "flex",
                                }}
                              >
                                {itemk.discount == 0 ? (
                                  <span>{itemk.price}/-</span>
                                ) : (
                                  <span>
                                    <del
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      {itemk.price}
                                    </del>{" "}
                                    {(
                                      itemk.price -
                                      itemk.price * (itemk.discount / 100)
                                    ).toFixed(0)}
                                    /-
                                  </span>
                                )}
                              </h6>
                            </li>
                          ))
                        : null}

                      {!(dealsfromdb.length === 0)
                        ? dealsfromdb.map((itemk) => (
                            <li
                              key={itemk._id}
                              className="list-group-item"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <h6>{itemk.saloonDealDetails.nameOfDeal}</h6>
                              <h6
                                style={{
                                  display: "flex",
                                }}
                              >
                                <span>
                                  {itemk.saloonDealDetails.priceOfDeal.toFixed()}
                                  /-
                                </span>
                              </h6>
                            </li>
                          ))
                        : null}
                      <li
                        class="list-group-item bg-light"
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      ></li>
                    </ul>
                  </div>
                </li>
              </div>
            </div>
            <nav class="navbar navbar-dark bg-secondary mr-auto mt-2 mt-lg-0">
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
              <h6
                className="mr-auto mt-2 mt-lg-0"
                style={{ paddingLeft: "2%", color: "white" }}
              >
                {" "}
                Old Cart
              </h6>
            </nav>
          </div>
        </div>
      ) : null}
      <div
        style={{
          width: "50%",
          position: "fixed",
          zIndex: 1000,
          right: 0,
          bottom: 0,
          borderWidth: 1,
          backgroundColor: "black",
        }}
        className="bg-secondary"
      >
        <div class="pos-f-t">
          <div class="collapse" id="navbarToggleExternalContent3">
            <div class="bg-dark p-4">
              <li className="list-group-item">
                <div>
                  <ul class="list-group">
                    <li
                      class="list-group-item bg-light"
                      style={{ textAlign: "center" }}
                    >
                      New Services Selected
                    </li>
                    {!(sercart.length === 0)
                      ? sercart.map((itemk) => (
                          <li
                            key={itemk._id}
                            className="list-group-item"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <h6>{itemk.name}</h6>
                            <h6
                              style={{
                                display: "flex",
                              }}
                            >
                              {itemk.discount == 0 ? (
                                <span>{itemk.price}/-</span>
                              ) : (
                                <span>
                                  <del
                                    style={{
                                      color: "red",
                                    }}
                                  >
                                    {itemk.price}
                                  </del>{" "}
                                  {(
                                    itemk.price -
                                    itemk.price * (itemk.discount / 100)
                                  ).toFixed(0)}
                                  /-
                                </span>
                              )}
                            </h6>
                          </li>
                        ))
                      : null}

                    {!(cart.length === 0)
                      ? cart.map((itemk) => (
                          <li
                            key={itemk._id}
                            className="list-group-item"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <h6>{itemk.saloonDealDetails.nameOfDeal}</h6>
                            <h6
                              style={{
                                display: "flex",
                              }}
                            >
                              <span>
                                {itemk.saloonDealDetails.priceOfDeal.toFixed()}
                                /-
                              </span>
                            </h6>
                          </li>
                        ))
                      : null}
                    <li
                      class="list-group-item bg-light"
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    ></li>
                  </ul>
                </div>
              </li>
            </div>
          </div>
          <nav class="navbar navbar-dark bg-secondary mr-auto mt-2 mt-lg-0">
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
            <h6
              className="mr-auto mt-2 mt-lg-0"
              style={{ paddingLeft: "2%", color: "white" }}
            >
              {" "}
              New Cart
            </h6>
          </nav>
        </div>
      </div>

      <div>
        <ul class="list-group">
          <li class="list-group-item active">Deals and Services Registered</li>
          {cart.map((itemk) => (
            <li key={itemk.id} className="list-group-item">
              <h4>{itemk.saloonDealDetails.nameOfDeal}</h4>
              <h7>{itemk.saloonDealDetails.priceOfDeal.toFixed(0)}</h7>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul class="list-group ">
          {sercart.map((itemn) => (
            <li key={itemn.id} className="list-group-item ">
              <h4>{itemn.name}</h4>
              <h7>
                {itemn.discount === 0
                  ? itemn.price
                  : (
                      itemn.price -
                      itemn.price * (itemn.discount / 100)
                    ).toFixed(0)}
              </h7>
            </li>
          ))}
        </ul>
        <ul class="list-group">
          <div className="list-group-item bg-dark ">
            <h3 className="text-white ">Total RS.</h3>
            <h3 style={{ color: "#65f083" }}>
              {cartTotal.toFixed(0)} <span className="text-white ">/-</span>
            </h3>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Cart;
