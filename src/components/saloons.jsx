import React, { Component } from "react";
import SideMenu from "./side_menu";
import "../index.css";
import MainGui from "./MainGui";
import GetSaloons from "../utils/getSaloons";

function Saloons(props) {
  const params = props;
  console.log(params);
  if (params.match.url === "/") {
    console.log("hello");
  }
  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10">
          <GetSaloons />
        </div>
      </div>
    </div>
  );
}

export default Saloons;
