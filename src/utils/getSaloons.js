import React, { useState, useEffect } from "react";
import { Button, FormText } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "../index.css";

import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ip from "../ipadd/ip";
import ReactStars from "react-rating-stars-component";
import Geocode from "react-geocode";
import apiKey from "../keys/google_api_key";

function GetSaloons(props) {
  const [category1serverData, setCategory1ServerData] = useState([]);
  const [category2serverData, setCategory2ServerData] = useState([]);
  const [category3serverData, setCategory3ServerData] = useState([]);
  const [category4serverData, setCategory4ServerData] = useState([]);
  const [category5serverData, setCategory5ServerData] = useState([]);
  const [category6serverData, setCategory6ServerData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [loading5, setLoading5] = useState(true);
  const [loading6, setLoading6] = useState(true);

  const [haveMore1, setHaveMore1] = useState(false);
  const [haveMore2, setHaveMore2] = useState(false);
  const [haveMore3, setHaveMore3] = useState(false);
  const [haveMore4, setHaveMore4] = useState(false);
  const [haveMore5, setHaveMore5] = useState(false);
  const [haveMore6, setHaveMore6] = useState(false);

  // const [serverData, setServerData] = useState([]);
  const [fetchingFromServer, setFetchingFromServer] = useState(false);
  const [fetchingFromServer2, setFetchingFromServer2] = useState(false);
  const [fetchingFromServer3, setFetchingFromServer3] = useState(false);
  const [fetchingFromServer4, setFetchingFromServer4] = useState(false);
  const [fetchingFromServer5, setFetchingFromServer5] = useState(false);
  const [fetchingFromServer6, setFetchingFromServer6] = useState(false);

  const [loadMore, setLoadMore] = useState(true);
  const [loadMore2, setLoadMore2] = useState(true);
  const [loadMore3, setLoadMore3] = useState(true);
  const [loadMore4, setLoadMore4] = useState(true);
  const [loadMore5, setLoadMore5] = useState(true);
  const [loadMore6, setLoadMore6] = useState(true);

  const [offset, setOffset] = useState(1);
  const [offset2, setOffset2] = useState(1);
  const [offset3, setOffset3] = useState(1);
  const [offset4, setOffset4] = useState(1);
  const [offset5, setOffset5] = useState(1);
  const [offset6, setOffset6] = useState(1);

  const [search, setSearch] = useState("Lahore");
  const [search2, setSearch2] = useState("Lahore");
  const [predictions, setPredictions] = useState([]);
  const [latii, setlati] = useState(0);
  const [longii, setlongi] = useState(0);
  const [distance, setMaxDistance] = useState(50);

  const [done, setDone] = useState(false);
  const [done1, setDone1] = useState(false);
  const [done2, setDone2] = useState(false);
  const [extra, setExtra] = useState(0);

  Geocode.setApiKey(apiKey);
  Geocode.setLanguage("en");
  const [Categories, setCategories] = useState([
    {
      categoryName: "Men's Saloons",
      categoryName2: "آپ کے قریب ، مردوں کے سیلون",
      c_id: "1",
    },
    {
      categoryName: "Women's Saloons",
      categoryName2: "آپ کے قریب ، خواتین کے سیلون",
      c_id: "2",
    },
    { categoryName: "Featured", categoryName2: "نمایاں سیلون", c_id: "3" },
    {
      categoryName: "SASA Best Deals",
      categoryName2: "بہترین سودے",
      c_id: "4",
    },
    { categoryName: "New on SASA", categoryName2: "نئے سیلون", c_id: "5" },
    { categoryName: "All Saloons", categoryName2: "تمام سیلون", c_id: "6" },
  ]);

  const anyRateSaloons = async () => {
    try {
      const value = localStorage.getItem("loginkeysasa");
      const { data: responseJson } = await axios.get(
        ip + "/api/appointments/getAnyAppWithRateRequired",
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );
   
      if (!responseJson) {
        console.log("empty");
      } else {

        window.location.href= "/saloonRating/"+responseJson._id+"/"+responseJson.saloonID+"/"+"2";
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  //when offset changes load function on second attempt
  // but on first attempt it will load throguh the means of getting lati lngi
  useEffect(
    () => {
      if (done1) {
        // else it will execute
        load(null, null, false);
      } else {
        /// firstly it will execute
        anyRateSaloons();
        getRouteDirections(search, false);
        setDone1(true);
      }
    },
    [offset, offset2, offset3, offset4, offset5, offset6]
    //  query for fetching category 2 server data
  );

  useEffect(() => {
    // if extra changes, back to this screen or after querying again
    if (!(extra === 0)) {
      getRouteDirections(search, true);
    }
  }, [extra]);
  //when destination changes it will call get the lati lngi
  useEffect(() => {
    if (done2) {
      //this will changes when location changes or distance changes
      setCategory6ServerData([]);
      setCategory5ServerData([]);
      setCategory4ServerData([]);
      setCategory3ServerData([]);
      setCategory2ServerData([]);
      setCategory1ServerData([]);
      setExtra(extra + 1);
    } else {
      setDone2(true);
    }
  }, [search2, distance]);

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

  const getRouteDirections = async (dest, AllLoads) => {
    let destinationName = "";

    if (!done) {
      destinationName = search2;
      console.log("search2", search2);
      setDone(true);
    } else {
      destinationName = dest;
      console.log("search2", dest);
    }

    try {
      console.log("here");
      const response = await axios.get(
        `https://aneeqahmad826-eval-prod.apigee.net/geocode?destinationName=${destinationName}`
        //  `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationName}&key=${apiKey}`
      );
      console.log(response);
      let json = await response.data;

      console.log(json);

      setlati(json.results[0].geometry.location.lat);
      setlongi(json.results[0].geometry.location.lng);
      setLoading(true);
      console.log("loading to true");
      //console.log("lat: lng: ", lati, longi);

      load(
        json.results[0].geometry.location.lat,
        json.results[0].geometry.location.lng,
        AllLoads
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getAddress = async () => {
    const response = await Geocode.fromLatLng("48.8583701", "2.2922926");
    return response.results[0].formatted_address;
  };

  //needs to be called when load more buttons are pressed
  // when also loadmore button changes it needs to be called through getting lati lngi
  // it get the data
  // needs to be called when search changes
  // when search changes, it needs to be called through the means of getting lati lngi

  const load = async (lati, lngi, AllLoads) => {
    console.log("showing near to: ", lati, lngi);
    console.log(
      loadMore,
      loadMore2,
      loadMore3,
      loadMore4,
      loadMore5,
      loadMore6,
      AllLoads,
      category1serverData,
      category2serverData
    );
    if (!lati && !lngi) {
      lati = latii;
      lngi = longii;
    }

    {
      if (loadMore || AllLoads) {
        //  query for fetching category 1 server data
        if (AllLoads) {
          setCategory1ServerData([]);
        }
        const { data: responseJson } = await axios.get(
          ip +
            "/api/saloon/browseMensSaloons?pageNumber=" +
            offset +
            "&lat=" +
            lati +
            "&lng=" +
            lngi +
            "&dist=" +
            distance
        );
        //  console.log(offset);
        //  console.log(responseJson);

        if (responseJson === 0) {
          console.log("empty");
        } else {
          //  console.log("reed: ",responseJson.length);
          if (responseJson.length === 6) {
            setHaveMore1(true);
          } else {
            setHaveMore1(false);
          }

          console.log(responseJson);
          setCategory1ServerData([
            ...category1serverData,
            ...responseJson.slice(0 * 5, 1 * 5),
          ]);
        }
        setLoading(false);
        setLoadMore(false);
        setFetchingFromServer(false);
      }

      if (loadMore2 || AllLoads) {
        if (AllLoads) {
          setCategory2ServerData([]);
        }
        const { data: responseJson } = await axios.get(
          ip +
            "/api/saloon/browseWomensSaloons?pageNumber=" +
            offset2 +
            "&lat=" +
            lati +
            "&lng=" +
            lngi +
            "&dist=" +
            distance
        );

        if (responseJson === 0) {
          console.log("empty");
        } else {
          if (responseJson.length === 6) {
            setHaveMore2(true);
          } else {
            setHaveMore2(false);
          }
          console.log("before ca2: ", category2serverData);
          setCategory2ServerData([
            ...category2serverData,
            ...responseJson.slice(0 * 5, 1 * 5),
          ]);
        }
        setLoading2(false);
        setLoadMore2(false);
        setFetchingFromServer2(false);
      }

      if (loadMore3 || AllLoads) {
        const { data: responseJson } = await axios.get(
          ip +
            "/api/saloon/browseFeaturedSaloons?pageNumber=" +
            offset3 +
            "&lat=" +
            lati +
            "&lng=" +
            lngi +
            "&dist=" +
            distance
        );

        if (responseJson === 0) {
          console.log("empty featured");
        } else {
          console.log("reed: ", responseJson.length);
          if (responseJson.length === 6) {
            setHaveMore3(true);
          } else {
            setHaveMore3(false);
          }
          if (AllLoads) {
            setCategory3ServerData([]);
          }
          setCategory3ServerData([
            ...category3serverData,
            ...responseJson.slice(0 * 5, 1 * 5),
          ]);
        }
        setLoading3(false);
        setLoadMore3(false);
        setFetchingFromServer3(false);
      }

      if (loadMore4 || AllLoads) {
        const { data: responseJson } = await axios.get(
          ip +
            "/api/saloon/browseSaSaDealsSaloons?pageNumber=" +
            offset4 +
            "&lat=" +
            lati +
            "&lng=" +
            lngi +
            "&dist=" +
            distance
        );

        if (responseJson === 0) {
          console.log("empty");
        } else {
          if (responseJson.length === 6) {
            setHaveMore4(true);
          } else {
            setHaveMore4(false);
          }
          if (AllLoads) {
            setCategory4ServerData([]);
          }
          setCategory4ServerData([
            ...category4serverData,
            ...responseJson.slice(0 * 5, 1 * 5),
          ]);
        }

        setLoading4(false);
        setLoadMore4(false);
        setFetchingFromServer4(false);
      }
      if (loadMore5 || AllLoads) {
        const { data: responseJson } = await axios.get(
          ip +
            "/api/saloon/browseNewNearSaloons?pageNumber=" +
            offset5 +
            "&lat=" +
            lati +
            "&lng=" +
            lngi +
            "&dist=" +
            distance
        );

        if (responseJson === 0) {
          console.log("empty");
        } else {
          if (responseJson.length === 6) {
            setHaveMore5(true);
          } else {
            setHaveMore5(false);
          }
          if (AllLoads) {
            setCategory5ServerData([]);
          }
          setCategory5ServerData([
            ...category5serverData,
            ...responseJson.slice(0 * 5, 1 * 5),
          ]);
        }
        setLoading5(false);
        setLoadMore5(false);
        setFetchingFromServer5(false);
      }
      if (loadMore6 || AllLoads) {
        try {
          const { data: responseJson } = await axios.get(
            ip +
              "/api/saloon/browseAllSaloons?pageNumber=" +
              offset6 +
              "&lat=" +
              lati +
              "&lng=" +
              lngi +
              "&dist=" +
              distance
          );

          if (responseJson === 0) {
            console.log("empty");
          } else {
            console.log("reed: ", responseJson.length);
            if (responseJson.length === 6) {
              setHaveMore6(true);
            } else {
              setHaveMore6(false);
            }
            if (AllLoads) {
              setCategory6ServerData([]);
            }
            setCategory6ServerData([
              ...category6serverData,
              ...responseJson.slice(0 * 5, 1 * 5),
            ]);
          }
        } catch (ex) {
          console.log(ex);
        }
        setLoading6(false);
        setLoadMore6(false);
        setFetchingFromServer6(false);
      }
      setLoading(false);
    }
  }; //mt-auto

  const renderFooter = (id) => {
    return (
      //Footer View with Load More button
      <div
        className="align-items-center d-flex justify-content-center"
        style={{ margin: "2%" }}
      >
        <button
          type="button"
          class="btn btn-danger"
          onClick={() => {
            // setFetchingFromServer(true);
            if (
              id === "1" &&
              haveMore1 &&
              !(category1serverData.length === 0)
            ) {
              //   setLoading(true);
              setFetchingFromServer(true);
              setOffset(offset + 1);
              setLoadMore(true);
              console.log("increased 1", offset);
            } else if (
              id === "2" &&
              haveMore2 &&
              !(category2serverData.length === 0)
            ) {
              setFetchingFromServer2(true);
              setOffset2(offset2 + 1);
              setLoadMore2(true);
              console.log("increased 2", offset2);
            } else if (
              id === "3" &&
              haveMore3 &&
              !(category3serverData.length === 0)
            ) {
              setFetchingFromServer3(true);
              setOffset3(offset3 + 1);
              setLoadMore3(true);
              console.log("increased 3", offset3);
            } else if (
              id === "4" &&
              haveMore4 &&
              !(category4serverData.length === 0)
            ) {
              setFetchingFromServer4(true);
              setOffset4(offset4 + 1);
              setLoadMore4(true);
              console.log("increased 4", offset4);
            } else if (
              id === "5" &&
              haveMore5 &&
              !(category5serverData.length === 0)
            ) {
              setFetchingFromServer5(true);
              setOffset5(offset5 + 1);
              setLoadMore5(true);
              console.log("increased 5", offset5);
            } else if (
              id === "6" &&
              haveMore6 &&
              !(category6serverData.length === 0)
            ) {
              setFetchingFromServer6(true);
              setOffset6(offset6 + 1);
              setLoadMore6(true);
              console.log("increased 6", offset6);
            }
          }}
        >
          {id === "1" ? (
            <div>
              <FormText>
                {category1serverData.length === 0
                  ? "No Saloons Found!"
                  : haveMore1
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer && !(category1serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : id === "2" ? (
            <div>
              <FormText>
                {category2serverData.length === 0
                  ? "No Saloons Found!"
                  : haveMore2
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer2 && !(category2serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : id === "3" ? (
            <div>
              <FormText>
                {category3serverData.length === 0
                  ? "No Saloons Found!"
                  : haveMore3
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer3 && !(category3serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : id === "4" ? (
            <div>
              <FormText>
                {category4serverData.length === 0
                  ? "No Saloons Found!"
                  : haveMore4
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer4 && !(category4serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : id === "5" ? (
            <div>
              <FormText>
                {category5serverData.length === 0
                  ? "No Saloons Found!"
                  : haveMore5
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer5 && !(category5serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : id === "6" ? (
            <div>
              <FormText>
                {category6serverData.length === 0 // if length is zero
                  ? "No Saloons Found!"
                  : haveMore6 // else if no multiple of pagination found
                  ? "Load More"
                  : "Results Ended"}
              </FormText>
              {fetchingFromServer6 && !(category6serverData.length === 0) ? (
                <ActivityIndicator color="white" />
              ) : null}
            </div>
          ) : null}
        </button>
      </div>
    );
  };

  return (
    <div>
      <nav
        class="navbar navbar-dark bg-light justify-content-between"
        style={{ marginLeft: "4%" }}
      >
        <form className="form-inline ">
          <a class="navbar-brand" style={{ color: "black" }}>
            Showing Saloon Categories Near
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
                          setSearch(prediction.structured_formatting.main_text);
                          setSearch2(
                            prediction.structured_formatting.main_text
                          );
                          getRouteDirections(
                            prediction.structured_formatting.main_text,
                            false
                          );
                        }}
                      >
                        <FormText style={{ fontSize: 20 }}>
                          {prediction.structured_formatting.main_text}
                        </FormText>
                        <FormText>
                          {prediction.structured_formatting.secondary_text}
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
          <div>
            <a class="navbar-brand" style={{ color: "black" }}>
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
        </form>
      </nav>

      {loading || loading2 || loading3 || loading4 || loading5 || loading6 ? (
        <ActivityIndicator />
      ) : (
        Categories.map((Category, i) => (
          <div key={Category.c_id} style={{ marginLeft: "3%" }}>
            <nav
              class="navbar navbar-dark bg-dark justify-content-between"
              style={{ marginBottom: "2%", marginLeft: "1%" }}
            >
              <a class="navbar-brand">{Category.categoryName}</a>
            </nav>
            <div className="row col-lg-12" style={{ marginBottom: "2%" }}>
              {(i === 0
                ? category1serverData
                : i === 1
                ? category2serverData
                : i === 2
                ? category3serverData
                : i === 3
                ? category4serverData
                : i === 4
                ? category5serverData
                : category6serverData
              ).map((cat, j) => (
                <div
                  className="card col-md-3"
                  style={{ marginLeft: "5%", marginBottom: "4%" }}
                  key={j}
                >
                  <img
                    className="card-img-top sizeofPic"
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
                      <h5>Rating</h5>
                      <div>
                        <ReactStars
                          count={5}
                          // onChange={ratingChanged}
                          edit={false}
                          size={24}
                          activeColor="#ffd700"
                          value={cat.saloonOverallRating}
                        />
                      </div>

                      <div>({cat.numOfReviews})</div>
                    </li>
                    <h6>{() => getAddress()}</h6>
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
              {i === 0
                ? renderFooter("1")
                : i === 1
                ? renderFooter("2")
                : i === 2
                ? renderFooter("3")
                : i === 3
                ? renderFooter("4")
                : i === 4
                ? renderFooter("5")
                : i === 5
                ? renderFooter("6")
                : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default GetSaloons;
