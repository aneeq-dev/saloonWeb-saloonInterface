import React, { useState, useEffect } from "react";
import MainGui from "../components/MainGui";
import SideMenu from "../components/side_menu";
import ip from "../ipadd/ip";
import axios from "axios";
import { useAlert } from "react-alert";
import jwtDecode from "jwt-decode";
import ActivityIndicator from "react-activity-indicator";

function SaloonGallery(props) {
  // const saloonID = props.match.params.id2;
  const [loading, setLoading] = useState(true);
  const [pics, setPics] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [d, setD] = useState(false);
  const [display, setDisplay] = useState(false);
  const alert = useAlert();

  const getImages = async () => {
    //props.id
    try {
      const value = await localStorage.getItem("loginkeysasa");
      if (value) {
        const customer = jwtDecode(value);

        const { data: responseJson } = await axios.get(
          ip + "/api/saloon/getImages?saloonID=" + customer._id
        );
        if (
          responseJson.length === 0 ||
          responseJson === 0 ||
          responseJson === undefined
        ) {
          // do nothing
          setPics([]);
        } else {
          setPics(responseJson[0].saloonGallery);
          setLoading(false);
        }
      } else {
        window.location.href = "/login/4";
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    // setLoading(true);
    getImages();
  }, [d]);

  const deletePic = async (id) => {
    // here goes query for deleting
    try {
      console.log(id);
      const value = await localStorage.getItem("loginkeysasa");
      //  console.log('mkmkmkmmmmkmmk: ', value);
      if (!value) {
        window.location.href = "/login/4";
      } else {
        const { data: responseJson } = await axios.delete(
          ip + "/api/saloon/deleteImage?imageID=" + id,

          {
            headers: {
              "x-auth-token": value,
            },
          }
        );

        if (!responseJson) {
          // do nothing

          //  console.log("nothing");
          alert.show("Image cannot be deleted!");

          if (localStorage.getItem("loginkeysasa")) {
            getImages();
          } else {
            //setLoading(false);
            window.location.href = "/login/4";
          }
        } else {
          alert.show("Image Deleted!");

          getImages();
        }
      }
    } catch (ex) {
      console.log(ex);
      console.log(ex.response.data);
    }
    // on recieving promise

    //console.log(HistoryAppointments);
    setLoading(false);
  };

  const makeCover = async (data) => {
    // here goes query for deleting
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const obj = { image: data };
      const { data: responseJson } = await axios.post(
        ip + "/api/saloon/makeCover",
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
        alert.show("Image cannot be added as cover!");
      } else {
        alert.show("Image selected as cover!");
      }
    } catch (ex) {
      console.log(ex);
      // setErrors(ex.response.data);

      console.log(ex.response.data);
    }

    setLoading(false);
  };

  const pushToArray = async (data) => {
    // here goes query for deleting
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const obj = { image: data };
      const { data: responseJson } = await axios.post(
        ip + "/api/saloon/PushImage",
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
        // do nothinga
        alert.show("Image Not Added!");
      } else {
        alert.show("Image Added");

        setPhoto(null);
        getImages();
      }
    } catch (ex) {
      console.log(ex);
      // setErrors(ex.response.data);

      console.log(ex.response.data);
    }

    setLoading(false);
  };

  const handleupload = async () => {
    setLoading(true);
    if (photo) {
      console.log("here", photo);

      /*let newFile = {
        uri: photo.name,
        type: `test/${photo.type}`,
        name: `test/${photo.name}`,
      };*/
      const data = new FormData();
      data.append("file", photo);
      data.append("upload_preset", "saloonApp");
      data.append("cloud_name", "sasa-sasa");
      setPhoto(null);

      try {
        setLoading(true);
        await fetch("https://api.cloudinary.com/v1_1/sasa-sasa/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            //  console.log("mkmkmkm",data.secure_url, i);

            pushToArray(data.secure_url);
          });
          setDisplay(false);
          setPhoto(null);
      } catch (ex) {
        console.log(ex);
        ///saloon/PushImage?image=
      }
      // setLoading(false);
    }
  };

  const handleChoosePhoto = () => {
    /*const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log(response);
      if (response.uri) {
        setPhoto(response);
        //handleupload(response);
      }
    });*/
  };
  const fileSelectHandler = (event) => {
      console.log(event);
    setPhoto(event.target.files[0]);
  };

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-sm-10" style={{ marginLeft: "3%" }}>
          <nav
            className="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a className="navbar-brand">My Saloon Gallery</a>
          </nav>
          <div className="alert alert-success">
            Make cover option is used for your mobile application
            users/customers. As in mobile applications, it is used as cover
            photo of your saloon profile.
          </div>
          {loading ? <ActivityIndicator /> : null}
          {pics.length === 0 ? <h4>No pictures found!</h4> : null}
          <div className="row col-lg-12">
            {pics.map((item, i) => (
              <div key={i} style={{ margin: "2%" }}>
                <img
                  className="card-img-top sizeofPic2"
                  src={item}
                  alt="Card image cap"
                />

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={(nval) => {
                      makeCover(item);
                    }}
                    style={{ width: "50%", padding: "2%" }}
                    className="btn btn-success"
                  >
                    Make cover
                  </button>
                  <button
                    onClick={(nval) => {
                      // checkboxtheItem(deal);
                      //setToggleCheckBox(nval);
                      deletePic(item);
                    }}
                    style={{ width: "50%", padding: "2%" }}
                    className="btn btn-danger"
                  >
                    Delete Picture
                  </button>
                </div>
              </div>
            ))}
          </div>
          {display ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => fileSelectHandler(e)}
              ></input>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2%",
            }}
          >
            <button
              onClick={(nval) => {
                if (photo) {
                  handleupload();
                } else {
                  setDisplay(true);
                }
              }}
              style={{ width: "30%", padding: "1.5%", borderRadius: 50 }}
              className={"btn btn-dark"}
            >
              {photo ? "Upload now!" : "Add New Photo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaloonGallery;
