import logo from "./logo.svg";
import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Saloons from "./components/saloons";

import "./App.css";
import Contact from "./components/Contact";
import searchedList from "./components/searchedList";
import SaloonProfile from "./components/SaloonProfile";
import Settings from "./components/Settings";
import Reviews from "./components/Reviews";
import PersonalInfo from "./components/PersonalInfo";
import ChangePass from "./components/ChangePass";
import Login from "./components/Login";
import Appointments from "./components/Appointments";
import RateSaloon from "./components/RateSaloon";
import HowItWorks from "./components/HowItWorks";
import Services from "./saloonComponents/Services";
import AddServiceSection from "./saloonComponents/AddServiceSection";
import Deals from "./saloonComponents/Deals";
import AddDeals from "./saloonComponents/AddDeals";
import Stylists from "./saloonComponents/Stylists";
import AddStylist from "./saloonComponents/AddStylist";
import SaloonGallery from "./saloonComponents/SaloonGallery";
import ConfirmApp from "./saloonComponents/ConfirmApp";
import EntertainApp from "./saloonComponents/EntertainApp";
import ApplyForConf from "./saloonComponents/ApplyForConf";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch> 
        <Route path="/" component={SaloonProfile} exact></Route>
        <Route path="/saloonProfile/goto/:id/:screenNumber" exact component={SaloonProfile} ></Route>
        <Route path="/saloonProfile/goto/:id/:screenNumber/:app_id" exact component={SaloonProfile} ></Route>
        <Route path="/saloonRating/:app_id/:id/:screenNumber" exact component={RateSaloon} ></Route>
        <Route path="/contact" component={Contact} exact></Route>
        <Route path="/settings/:screenNumber" component={Settings} exact></Route>
        <Route path="/reviews/:id/:screenNumber" component={Reviews} exact></Route>
        <Route path="/personalinfo/:screenNumber" component={PersonalInfo} exact></Route>
        <Route path="/passwords" component={ChangePass} exact></Route>
        <Route path="/howitworks" component={HowItWorks} exact></Route>
        <Route path="/login/:screenNumber" component={Login} exact></Route>
        <Route path="/appointments/:screenNumber" component={Appointments} exact></Route>
        <Route path="/appointments/:app_id/:screenNumber" component={Appointments} exact></Route>
        <Route path="/searchedList/:screenNumber" component={searchedList} exact></Route>
        <Route path="/searchedList/nearto/:placename/:screenNumber" component={searchedList} exact></Route>
        <Route path="/servicesForOwners" component={Services} exact></Route>
        <Route path="/addupdateservice/:screenNumber/:sectionID/:subserviceID" component={AddServiceSection} exact></Route>
        <Route path="/saloondeals" component={Deals} exact></Route>
        <Route path="/addDeals/:screenNumber/:dealID" component={AddDeals} exact></Route>
        <Route path="/saloonStylists" component={Stylists} exact></Route>
        <Route path="/updateStylist/:screenNumber/:stylistID" component={AddStylist} exact></Route>
        <Route path="/saloongallery" component={SaloonGallery} exact></Route>
        <Route path="/confirmTheTimeofApp/:dateFrom/:dateTo/:app_ID/:screenNumber" component={ConfirmApp} exact></Route>
        <Route path="/entertain/:app_ID" component={EntertainApp} exact></Route>
        <Route path="/applyforconf" component={ApplyForConf} exact></Route>

        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
