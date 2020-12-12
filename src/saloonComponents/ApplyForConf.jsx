import React, { useState, useEffect } from "react";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import jwtDecode from "jwt-decode";
import ActivityIndicator from "react-activity-indicator";
import Geocode from "react-geocode";
import joi from "joi";
import apiKey from "../keys/google_api_key";

function ApplyForConf(props) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("date");
  const [mode2, setMode2] = useState("date");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(true);
  const [isDateSelected2, setIsDateSelected2] = useState(true);
  const [isTimeSelected, setIsTimeSelected] = useState(false);
  const [isTimeSelected2, setIsTimeSelected2] = useState(false);
  const [isok, setIsOk] = useState(false);
  const [se, setSe] = useState(false);
  const [se2, setSe2] = useState(false);
  const [address, setAddress] = useState("");
  const [addressok, setAddressok] = useState(false);
  const [services, setServices] = useState("");
  const [servicesok, setServicesok] = useState(true);
  const [password, setPass] = useState("");
  const [passwordOk, setPassOk] = useState(true);
  const [phone, setphone] = useState("+923");
  const [phoneOk, setPhoneOk] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [photo4, setPhoto4] = useState(null);
  const [errors, setErrors] = useState("");
  const [uploadPhotos, setUploadedPhotos] = useState([]);
  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [saloondata, setSaloondata] = useState([]);
  const [display, setDisplay] = useState(false);
  const [display2, setDisplay2] = useState(false);
  const [display3, setDisplay3] = useState(false);
  const [display4, setDisplay4] = useState(false);

  /* console.log("sjs: ", 
  );*/
  const alert = useAlert();

  

  const convertAddress = (lat, lng) => {
    if (!se2) {
      Geocode.fromLatLng(lat, lng).then(
        (response) => {
          const address = response.results[0].formatted_address;
          setAddress(address);
          setAddressok(true);
          console.log(address);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("ni");
    }
  };

  const locateCurrentPosition = () => {
    setLoading(true);
    Geocode.setApiKey(apiKey);
    Geocode.setLanguage("en");
  };

  useEffect(() => {
    locateCurrentPosition();
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        convertAddress(position.coords.latitude, position.coords.longitude);
      },
      function (error) {
        console.log("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, [se2]);

  //  locateCurrentPosition();

  const handleChoosePhoto = (event, i) => {
    if (i === 1) {
      setPhoto(event.target.files[0]);
    } else if (i === 2) {
      setPhoto2(event.target.files[0]);
    } else if (i === 3) {
      setPhoto3(event.target.files[0]);
    } else if (i === 4) {
      setPhoto4(event.target.files[0]);
    }
  };

  const handleupload = async (ph, i) => {
    setLoading(true);
    console.log("here", ph);
    if (ph) {
      const data = new FormData();
      data.append("file", ph);
      data.append("upload_preset", "saloonApp");
      data.append("cloud_name", "sasa-sasa");

      try {
        await fetch("https://api.cloudinary.com/v1_1/sasa-sasa/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("mkmkmkm", data.secure_url, i);
            uploadPhotos.push({
              data: data.secure_url,
              index: i,
            });
          });
      } catch (ex) {
        console.log(ex);
      }
      setLoading(false);
    }
  };

  const validateInput = (data) => {
    // validating phone
    var schema = joi.object({
      Phone: joi
        .string()
        .min(13)
        .max(13)
        .required()
        .regex(/[+]923[0-9]{2}(?!1234567)(?!1111111)(?!7654321)[0-9]{7}/),
    });
    const error = schema.validate({ Phone: data });
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);
      setPhoneOk(false);
      return false;
    } else {
      setErrors("");
      console.log("ok");
      setPhoneOk(true);
      return true;
    }
  };

  const validateInput2 = (data) => {
    // validating password
    var schema = joi.object({
      Password: joi.string().min(8).max(200).required(),
    });
    const error = schema.validate({ Password: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);
      setPassOk(false);
      return false;
    } else {
      setErrors("");
      console.log("ok");
      setPassOk(true);
      return true;
    }
  };

  const validateInput3 = (data) => {
    // validating password
    var schema = joi.object({
      services: joi.string().min(30).max(150).required(),
    });
    const error = schema.validate({ services: data });
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);
      setServicesok(false);
      return false;
    } else {
      console.log("ok");
      setErrors("");
      setServicesok(true);
      return true;
    }
  };

  const validate = () => {
    if (photo && photo2 && photo3 && photo4 && addressok) {
      return true;
    } else {
      console.log("jdn");
      return false;
    }
  };

  /* const createFormData = (photo, body) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };*/

  const allUploaded = () => {
    console.log(uploadPhotos);
    if (uploadPhotos.length === 4) {
      return true;
    } else {
      return false;
    }
  };
  console.log(date);
  const applyquery = async () => {
    setLoading(true);
    let p1 = "",
      p2 = "",
      p3 = "",
      p4 = "";
    for (var i = 0; i < 4; i++) {
      if (uploadPhotos[i].index === 1) {
        p1 = uploadPhotos[i].data;
      } else if (uploadPhotos[i].index === 2) {
        p2 = uploadPhotos[i].data;
      } else if (uploadPhotos[i].index === 3) {
        p3 = uploadPhotos[i].data;
      } else if (uploadPhotos[i].index === 4) {
        p4 = uploadPhotos[i].data;
      }
    }
    var obj = {
      saloonGallery: [p1, p2, p3],
      saloonTiming: {
        opening: date,
        closing: date2,
      },
      saloonAddress: {
        saloonLat: 0,
        //store.getState()[0].latitude,
        saloonlng: 0,
        // store.getState()[0].longitude,
      },
      saloonDocuments: {
        doc: p4,
      },
      saloonBestServices: services,
      saloonBestImage: p1,
      phoneNumber: phone,
      password: password,
    };

    try {
      const value = await localStorage.getItem("loginkeysasa");
      console.log("mkmkmkmmmmkmmk: ", value);
      const { data: responseJson } = await axios.put(
        ip + "/api/saloon/ApplicationSaloon",

        obj,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
      //console.log("res",responseJson);
      if (!responseJson) {
        // do nothing
        alert.show("Application not submitted Successfully!");
      } else {
        console.log("fff: ", responseJson);
        alert.show("Application Submitted Successfully");
        window.location.href = "/";
      }
    } catch (ex) {
      console.log(ex);
      setErrors(ex.response.data);
    }
    setLoading(false);
  };
  const checkAndQuery = () => {
    // setLoading(true);
    //

    // console.log(photolink);
    if (allUploaded()) {
      // query for signing in and recieving promise
      applyquery();
      //setLoading(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        console.log("huh: ");
        checkAndQuery();
      }, 2000);
    }
    // setLoading(false);
  };

  const apply = async () => {
    //handleupload(photo,1);
    //setLoading(true);
    if (
      validateInput(phone) &&
      validateInput2(password) &&
      validate() &&
      validateInput3(services)
    ) {
      console.log("yes its ok");

      handleupload(photo, 1);
      handleupload(photo2, 2);
      handleupload(photo3, 3);
      handleupload(photo4, 4);

      checkAndQuery();

      //  console.log('sign in pressed');
    } else {
      console.log("no its not");
    }
    //  setLoading(false);
  };

  const saloonInitialData = async () => {
    // let storestate = store.getState();
    setLoading(true);
    try {
      const value = await localStorage.getItem("loginkeysasa");

      //console.log('mkm ', id);
      if (!value) {
        setLoading(false);
      } else {
        const user = jwtDecode(value);

        const { data: responseJson } = await axios.get(
          ip + "/api/saloon/getSaloonWRTid?id=" + user._id
        );
        if (responseJson === 0) {
          console.log("no saloon data found");
        } else {
          setSaloondata(responseJson);
          console.log("salonn:", responseJson);
        }
      }
    } catch (ex) {
      console.log(ex);
    }

    //console.log(responseJson);
    setLoading(false);
  };

  if (!se) {
    setLoading(true);
    locateCurrentPosition();

    saloonInitialData();
    // currentAddress();

    setSe(true);
  }

  const _onRefresh = () => {
    //setLoading(true);
    //getSaloonData();
  };

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "3%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">Apply for Confirmation</a>
          </nav>
         
          <div class="form-group" style={{ marginLeft: "4%" }}>
            <div className="alert alert-primary">
              Saloon Address is automatically located so please apply for
              confirmation of saloon at your saloon location, so that your
              customers come to your saloon.
            </div>
            <label for="exampleInputEmail1">Your Saloon Address is: *</label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Address"
              disabled="disabled"
              value={address}
              maxLength={100}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                width: "75%",
                borderColor: addressok ? "black" : "red",
              }}
            />
          </div>
          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          <div
            style={{
              marginLeft: "4%",
              marginTop: "2%",
            }}
          >
            <div className="alert alert-primary">
              Please upload saloon documents picture:
            </div>
            <label for="exampleInputEmail1">Add Saloon Documents</label>

            {photo4 ? null : (
              <button
                onClick={(nval) => {
                  if (photo4) {
                    handleupload();
                  } else {
                    setDisplay(true);
                  }
                }}
                style={{
                  padding: "1.5%",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  borderRadius: 50,
                  marginLeft: "3%",
                }}
                className={"btn btn-dark"}
              >
                {photo4 ? "Upload now!" : "Add Saloon Doc Pic"}
              </button>
            )}
            {display ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChoosePhoto(e, 4)}
                ></input>
              </div>
            ) : null}
            {!photo4 ? (
              <div class="alert alert-danger" style={{ margin: "1%" }}>
                Document not selected
              </div>
            ) : (
              <div class="alert alert-success" style={{ margin: "1%" }}>
                Document selected
              </div>
            )}
          </div>
          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          <div class="form-group" style={{ marginLeft: "4%" }}>
            <div className="alert alert-primary">
              Write 2 to 3 best services you are offering
            </div>
            <label for="exampleInputEmail1">Your Saloon Best Services: *</label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Best Services"
              value={services}
              onChange={(n) => {
                //console.log(n.target.value);
                setServices(n.target.value);
                validateInput3(n.target.value);
              }}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                width: "75%",
                borderColor: servicesok ? "black" : "red",
              }}
            />
          </div>
          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          <div
            style={{
              marginLeft: "4%",
              marginTop: "2%",
            }}
          >
            <div className="alert alert-primary">
              Please upload cover photo of saloon:
            </div>
            <label for="exampleInputEmail1">Add Cover Photo</label>

            {photo ? null : (
              <button
                onClick={(nval) => {
                  if (photo) {
                    handleupload();
                  } else {
                    setDisplay2(true);
                  }
                }}
                style={{
                  padding: "1.5%",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  borderRadius: 50,
                  marginLeft: "3%",
                }}
                className={"btn btn-dark"}
              >
                {photo ? "Upload now!" : "Add Cover Photo"}
              </button>
            )}
            {display2 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChoosePhoto(e, 1)}
                ></input>
              </div>
            ) : null}
            {!photo ? (
              <div class="alert alert-danger" style={{ margin: "1%" }}>
                Cover photo not selected
              </div>
            ) : (
              <div class="alert alert-success" style={{ margin: "1%" }}>
                Cover photo selected
              </div>
            )}
          </div>
          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          <div
            style={{
              marginLeft: "4%",
              marginTop: "2%",
            }}
          >
            <div className="alert alert-primary">
              Upload saloon's 2 other pics
            </div>
            <label for="exampleInputEmail1">Add Saloon Photo</label>

            {photo2 ? null : (
              <button
                onClick={(nval) => {
                  if (photo2) {
                    handleupload();
                  } else {
                    setDisplay3(true);
                  }
                }}
                style={{
                  padding: "1.5%",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  borderRadius: 50,
                  marginLeft: "3%",
                }}
                className={"btn btn-dark"}
              >
                {photo2 ? "Upload now!" : "Add Saloon Photo"}
              </button>
            )}
            {display3 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChoosePhoto(e, 2)}
                ></input>
              </div>
            ) : null}
            {!photo2 ? (
              <div class="alert alert-danger" style={{ margin: "1%" }}>
                Saloon photo not selected
              </div>
            ) : (
              <div class="alert alert-success" style={{ margin: "1%" }}>
                Saloon photo selected
              </div>
            )}

            <label for="exampleInputEmail1">Add Another Saloon Photo</label>

            {photo3 ? null : (
              <button
                onClick={(nval) => {
                  if (photo3) {
                    handleupload();
                  } else {
                    setDisplay4(true);
                  }
                }}
                style={{
                  padding: "1.5%",
                  paddingLeft: "3%",
                  paddingRight: "3%",
                  borderRadius: 50,
                  marginLeft: "3%",
                }}
                className={"btn btn-dark"}
              >
                {photo3 ? "Upload now!" : "Add another Saloon Photo"}
              </button>
            )}
            {display4 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChoosePhoto(e, 3)}
                ></input>
              </div>
            ) : null}
            {!photo3 ? (
              <div class="alert alert-danger" style={{ margin: "1%" }}>
                Saloon photo not selected
              </div>
            ) : (
              <div class="alert alert-success" style={{ margin: "1%" }}>
                Saloon photo selected
              </div>
            )}
          </div>
          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          <div class="alert alert-primary" style={{ marginLeft: "4%" }}>
            Please enter your credentials, once you entered when you signed up
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1" style={{ marginLeft: "4%" }}>
              Phone Number
            </label>
            <input
              class="form-control"
              type="text"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="+923910000000"
              onChange={(n) => {
                //console.log(n.target.value);
                setphone(n.target.value);
                validateInput(n.target.value);
              }}
              value={phone}
              maxLength={13}
              style={{
                borderWidth: 1,
                borderRadius: 20,
                marginLeft: "4%",
                width: "75%",
                borderColor: phoneOk ? "black" : "red",
              }}
            />
          </div>

          <div class="form-group">
            <label for="exampleInputPassword1" style={{ marginLeft: "4%" }}>
              Password
            </label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              value={password}
              onChange={(n) => {
                setPass(n.target.value);
                validateInput2(n.target.value);
              }}
              maxLength={200}
              style={{
                borderWidth: 1,
                marginLeft: "4%",
                borderRadius: 20,
                width: "75%",
                borderColor: passwordOk ? "black" : "red",
              }}
            />
          </div>

          <div
            className="col-sm-12 dropdown-divider space bg-dark"
            style={{ margin: "4%" }}
          ></div>

          {errors ? (
            <div
              class="alert alert-danger"
              role="alert"
              style={{ width: "75%", marginLeft: "4%", borderRadius: 50 }}
            >
              {errors}
            </div>
          ) : null}

          <div class="alert alert-primary" style={{ marginLeft: "4%" }}>
          Please Wait after submitting, untill we ourselves move you from this screen! Other wise your Application will not submit!          </div>
          <button
            class="btn btn-dark"
            style={{
              display: "flex",
              justifyContent: "center",
              paddingLeft: "2%",
              paddingRight: "2%",
              padding: "1%",
              borderRadius: 50,
              marginLeft:"4%",
              marginTop: "2%",
            }}
            onClick={() => {
              apply();
            }}
          >
            Apply for Confirmation{loading?<ActivityIndicator/>:null}
          </button>
          

          <span style={{ margin: "24em" }}></span>
        </div>
      </div>
    </div>
  );
}

export default ApplyForConf;
