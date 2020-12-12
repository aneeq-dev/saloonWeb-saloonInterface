import React, { useState, useEffect } from "react";

import ActivityIndicator from "react-activity-indicator";
import axios from "axios";
import ip from "../ipadd/ip";
import ReactStars from "react-rating-stars-component";
import { Button, FormText } from "react-bootstrap";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";

function Reviews(props) {
  const [loading, setLoading] = useState(true);
  const [serverData, setServerData] = useState([]);
  const [fetchingFromServer, setFetchingFromServer] = useState(false);
  const [offset, setOffset] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [haveMore1, setHaveMore1] = useState(false);

  useEffect(
    () => {
      props.match.params.screenNumber == 1 ? load() : load2();
    },
    [offset]
    //  query for fetching category 2 server data
  );

  const load = async () => {
    // saloon's reviews
    //console.log("pros: ",props.match.params.id);
    {
      if (loadMore && props.match.params.screenNumber == 1) {
        //customer id store in redux store

        const value = await localStorage.getItem("loginkeysasa");

        try {
          //  query for fetching category 1 server data
          const { data: responseJson } = await axios.get(
            ip +
              "/api/reviews/getReviewsOfSaloonwrtAuth" +
              "?pageNumber=" +
              offset,
            {
              headers: {
                "x-auth-token": value,
              },
            }
          );

          //  console.log(offset);
          // console.log('response: ', responseJson);

          if (responseJson === 0) {
            // console.log('empty');
          } else {
            //  console.log("reed: ",responseJson.length);
            if (responseJson.length === 6) {
              setHaveMore1(true);
            } else {
              setHaveMore1(false);
            }
            setServerData([...serverData, ...responseJson.slice(0 * 5, 1 * 5)]);
          }
        } catch (ex) {
          console.log(ex);
        }
        // console.log({data});
        // setCategory1ServerData([...category1serverData, ...responseJson]);
        setLoading(false);
        setLoadMore(false);
        setFetchingFromServer(false);
      }
    }
  };

  const load2 = async () => {
    //console.log("pros: ",props.match.params.id);
    {
      if (loadMore && props.match.params.screenNumber == 2) {
        //customer id store in redux store

        const value = await localStorage.getItem("loginkeysasa");

        try {
          //  query for fetching category 1 server data
          const { data: responseJson } = await axios.get(
            ip +
              "/api/reviews/getReviewsOfCustomerwrtAuthandCustID?customerID=" +
              props.match.params.id +
              "&pageNumber=" +
              offset,
            {
              headers: {
                "x-auth-token": value,
              },
            }
          );

          //  console.log(offset);
          // console.log('response: ', responseJson);

          if (responseJson === 0) {
            // console.log('empty');
          } else {
            //  console.log("reed: ",responseJson.length);
            if (responseJson.length === 6) {
              setHaveMore1(true);
            } else {
              setHaveMore1(false);
            }
            setServerData([...serverData, ...responseJson.slice(0 * 5, 1 * 5)]);
          }
        } catch (ex) {
          console.log(ex);
        }
        // console.log({data});
        // setCategory1ServerData([...category1serverData, ...responseJson]);
        setLoading(false);
        setLoadMore(false);
        setFetchingFromServer(false);
      }
    }
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <div
        className="align-items-center d-flex justify-content-center"
        style={{ margin: "2%" }}
      >
        <Button
          onClick={() => {
            if (haveMore1 && !(serverData.length === 0)) {
              //   setLoading(true);
              setFetchingFromServer(true);
              setOffset(offset + 1);
              setLoadMore(true);
            }

            //  loadMoreData()
          }}
          //On Click of button calling loadMoreData function to load more data
          //{{setOffset(offset+1)}}
        >
          <div>
            <FormText>
              {serverData.length === 0
                ? "No Reviews Found!"
                : haveMore1
                ? "Load More"
                : "Results Ended"}
            </FormText>
            {fetchingFromServer && !(serverData.length === 0) ? (
              <ActivityIndicator color="white" />
            ) : null}
          </div>
        </Button>
      </div>
    );
  };

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "1%" }}>
          <nav
            className="navbar navbar-expand-lg navbar-dark bg-dark"
            style={{ marginBottom: "1.5%" }}
          >
            <div className="navbar-text text-white" style={{marginLeft:"4%"}}>
              <h5>
                {
                  props.match.params.screenNumber == 1 ?(
                    "My Saloon Reviews"
                  ):
                  "Customer Reviews"
                }
                </h5>
            </div>
          </nav>
          {loading ? (
            <ActivityIndicator />
          ) : !(serverData.length === 0) ? (
            <div style={{ paddingLeft: "4%" }}>
              {serverData.map((item) => (
                <div style={{ marginBottom: "4%" }}>
                  <div className="bg-light" style={{ padding: "1%" }}>
                    {
                      <h3>
                        {props.match.params.screenNumber == 1 ? (
                          item.customerID.name.toUpperCase()
                        ) : (
                          <span style={{ color: "brown" }}>
                            {item.saloonID.saloonName.toUpperCase()}
                          </span>
                        )}{" "}

                        reviewed{" "}
                        {
                          props.match.params.screenNumber==1?(
                            "your saloon"
                          ):null
                        }
                      </h3>
                    }
                  </div>
                  <div>
                    <ReactStars
                      count={5}
                      edit={false}
                      size={24}
                      activeColor="#ffd700"
                      value={item.rating}
                    />
                  </div>

                  <div>
                    <h4>Comment:</h4>
                    <h6>{item.comment}</h6>
                  </div>

                  <div className="col-sm-12 dropdown-divider space bg-dark"></div>
                </div>
              ))}
            </div>
          ) : null}

          {renderFooter()}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
