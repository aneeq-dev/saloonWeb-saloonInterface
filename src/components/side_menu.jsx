import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

function SideMenu(props) {
  return (
    <div className=" navbar-expand-lg navbar-dark" style={{ width: "250%" }}>
      <div className="row con" style={{ marginRight: "11%" }}>
        <div
          id="sidebar_wrapper"
          className="col-lg-7 bd-sidebar navbar-dark bg-dark col"
        >
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul>
              <li className="removeBulltes  btn btn-dark">
                <h2 className="searchbyPrice">Menu</h2>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "10%" }}>
                  Services
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <NavLink to="/servicesForOwners">
                <button type="button" className="btn btn-dark">
                  My Saloon Services
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <NavLink to="/addupdateservice/1/0/0">
                <button type="button" className="btn btn-dark">
                  Add Service Section
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "10%" }}>Deals</h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/saloondeals">
                <button type="button" className="btn btn-dark">
                  My Saloon Deals
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/addDeals/1/0">
                <button type="button" className="btn btn-dark">
                  Add Saloon Deal
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "10%" }}>
                  Stylists
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/saloonStylists">
                <button type="button" className="btn btn-dark">
                  My Saloon Stylists
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/updateStylist/1/0">
                <button type="button" className="btn btn-dark">
                  Add Saloon Stylist
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              {
                // to="/get/gte/200000/3"
              }
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "5%" }}>
                  Appointments
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/appointments/1">
                <button type="button" className="btn btn-dark">
                  New Appointments
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/appointments/2">
                <button type="button" className="btn btn-dark">
                  Past Appointments
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "10%" }}>
                  Gallery
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <NavLink to="/saloongallery">
                <button type="button" className="btn btn-dark">
                  My Saloon Gallery
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "5%" }}>
                  Settings
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <NavLink to="/settings/1">
                <button type="button" className="btn btn-dark">
                  Account Settings
                </button>
              </NavLink>
              <div className="dropdown-divider space"></div>
              <NavLink to="/settings/2">
                <button type="button" className="btn btn-dark">
                  Security &amp; Login
                </button>
              </NavLink>
              <div className="dropdown-divider space"></div>
              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "5%" }}>
                  Contact &amp; Support
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/contact">
                <button type="button" className="btn btn-dark">
                  Contact us
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>

              <li className="  bg-dark">
                <h5 style={{ color: "skyblue", paddingLeft: "5%" }}>
                  Hows and Whys?
                </h5>
              </li>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
              <NavLink to="/howitworks">
                <button type="button" className="btn btn-dark">
                  How it works?
                </button>
              </NavLink>
              <div className="col-sm-12 dropdown-divider space bg-dark"></div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
