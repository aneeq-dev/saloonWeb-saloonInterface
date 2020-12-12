import React, { useState, useEffect } from "react";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import { NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";

function Services(props) {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [ik, setik] = useState(0);

  const alert = useAlert();

  const getServices = async () => {
    //console.log("bhjbh",props.id);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      if (!value) {
      } else {
        const { data: responseJson } = await axios.get(
          ip + "/api/services/getServicesSaloon",
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );
        if (!responseJson) {
          setLoading(false);
          setServices([]);
          console.log("no services found");
        } else {
          responseJson.forEach(function (element, i) {
            element.id = i;
            var arr = [];
            var j = 0;
            while (!(element.Services.length === 0)) {
              var n = element.Services.splice(0, 1);
              n[0].id = j;
              n[0].p_id = i;
              n[0].isSelected = false;
              arr.push(n);
              j++;
            }
            for (var l in arr) {
              element.Services.push(arr[l][0]);
            }
          });
          for (var j = 0; j < responseJson.length; j++) {
            //console.log("nnnnnkk: ",responseJson[j].Services);
          }

          setServices(responseJson);
        }
        setLoading(false);
      }
    } catch (ex) {
      console.error(ex);
    }

    //console.log("njknkjnjjj: ",deals);
  };

  const deleteServices = async (id) => {
    // here goes query for deleting
    try {
      console.log(id);
      const value = await localStorage.getItem("loginkeysasa");
      //  console.log('mkmkmkmmmmkmmk: ', value);
      const { data: responseJson } = await axios.delete(
        ip + "/api/services/deleteWholeSection?sectionID=" + id,

        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        // do nothing

        //  console.log("nothing");
        alert.show("Service didn't deleted successfully!");

        if (localStorage.getItem("loginkeysasa")) {
          getServices();
        } else {
          //setLoading(false);
          window.location.href = "/login/4";
        }
      } else {
        alert.show("Service has been deleted.");

        getServices();
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
        getServices();
        setLoading(false);
      } else {
        setLoading(false);
        window.location.href = "/login/4";
      }
    }
  }
  //changeSectionName

  const deleteSubService = async (sectionid, serviceId) => {
    // here goes query for deleting
    try {
      // console.log(id);
      const value = await localStorage.getItem("loginkeysasa");
      //  console.log('mkmkmkmmmmkmmk: ', value);
      const { data: responseJson } = await axios.delete(
        ip +
          "/api/services/deleteSubservice?sectionID=" +
          sectionid +
          "&subserviceID=" +
          serviceId,

        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      if (!responseJson) {
        // do nothing

        //  console.log("nothing");
        alert.show("Service didn't deleted successfully!");

        if (localStorage.getItem("loginkeysasa")) {
          getServices();
        } else {
          //setLoading(false);
          window.location.href = "/login/4";
        }
      } else {
        alert.show("Service has been deleted.");

        getServices();
      }
    } catch (ex) {
      console.log(ex);
      console.log(ex.response.data);
    }
    // on recieving promise

    //console.log(HistoryAppointments);
    setLoading(false);
  };

  const _onRefresh = () => {
    // console.log(props);
    setLoading(true);
    getServices();
  };

  useEffect(() => {
    setLoading(true);
    getServices();
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
            <a class="navbar-brand">My Saloon Services</a>
          </nav>
          {services.map((service) => (
            <div style={{marginTop:"4%"}}>
              <nav className="navbar navbar-expand-lg  text-white bg-secondary">
                <div className="navbar-text">{service.name}</div>
                <span className=" ml-auto mr-5"></span>
                <ul className="navbar-nav ">
                  <li className="nav-item dropdown mr-5 my-2 my-lg-0">
                    <Button
                      className="btn btn-success "
                      onClick={() => {
                        window.location.href =
                          "/addupdateservice/" +
                          2 +
                          "/" +
                          service._id +
                          "/" +
                          0;
                      }}
                    >
                      Add a service to Section
                      <span className="caret"></span>
                    </Button>
                  </li>
                  <li className="nav-item dropdown mr-5 my-2 my-lg-0">
                    <Button
                      className="btn btn-warning"
                      onClick={() => {
                        window.location.href =
                          "/addupdateservice/" +
                          4 +
                          "/" +
                          service._id +
                          "/" +
                          0;
                      }}
                    >
                      Edit Section Name
                      <span className="caret"></span>
                    </Button>
                  </li>
                  <li className="nav-item dropdown mr-5 my-2 my-lg-0">
                    <Button
                      className="btn btn-danger"
                      onClick={() => deleteServices(service._id)}
                    >
                      Delete whole Section
                      <span className="caret"></span>
                    </Button>
                  </li>
                </ul>
              </nav>{" "}
              <div className="row col-lg-12">
                {service.Services.map((sub) => (
                  <div
                    className="card col-lg-3"
                    key={sub.id}
                    style={{ margin: "1.5%" }}
                  >
                    <div class="card" style={{ margin: "1.5%" }}>
                      <div class="card-header bg-light">
                        {sub.name.toUpperCase()}
                      </div>
                      <div class="card-body text-white bg-dark">
                        <h5 class="card-title">
                          Valued Rs.
                          {"  "}
                          {(
                            sub.price -
                            (sub.discount / 100) * sub.price
                          ).toFixed(0)}
                          {"  "}
                          <del style={{ color: "red" }}>
                            {sub.price.toFixed(0)}
                          </del>
                        </h5>
                        <p>
                          Discount:{" "}
                          <span style={{ color: "#65f083" }}>
                            {sub.discount}
                          </span>
                          %{"\n"}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={(nval) => {
                              //checkboxtheItem(sub);
                              // setToggleCheckBox(nval);
                              window.location.href =
                                "/addupdateservice/" +
                                3 +
                                "/" +
                                service._id +
                                "/" +
                                sub._id;
                            }}
                            style={{ width: "50%" }}
                            class={"btn btn-primary"}
                          >
                            Edit
                          </button>
                          <button
                            onClick={(nval) => {
                              //checkboxtheItem(sub);
                              // setToggleCheckBox(nval);
                              deleteSubService(service._id, sub._id);
                              //console.log(subservices._id);
                            }}
                            style={{ width: "50%" }}
                            class={"btn btn-danger"}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", marginTop:"2%" }}>
            <button
              onClick={(nval) => {
                //checkboxtheItem(sub);
                // setToggleCheckBox(nval);
               // deleteSubService(service._id, sub._id);
                //console.log(subservices._id);
                window.location.href="/addupdateservice/"+1+"/"+0+"/"+0;
              }}
              style={{ width: "30%", padding:"1.5%" , borderRadius:50}}
              class={"btn btn-dark"}
            >
              Add New Service Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
