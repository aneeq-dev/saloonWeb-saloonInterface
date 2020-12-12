import React, { Component } from "react";

import Title from "./title";
import NavBar from "./navbar";


function MainGui(props) {
  return (
    <div>
      <div className="row">
        <div className="col col-sm-12">
          <Title />
          <NavBar />
        </div>
      </div>
      <div className="row">
        <hr></hr>
      </div>
      <div className="row">
        <hr></hr>
      </div>
    </div>
  );
}

export default MainGui;
