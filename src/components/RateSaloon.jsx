import React, { useEffect, useState } from "react";
import MainGui from "./MainGui";
import SideMenu from "./side_menu";
import { useAlert } from "react-alert";
import ip from "../ipadd/ip";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import joi from "joi";
import { Button } from "react-bootstrap";

function RateSaloon(props) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState("");
  const [commentok, setCommentOk] = useState(true);
  const [name, setSaloonName] = useState("");
  const alert = useAlert();

  const RateQuery = async () => {
    // console.log(props.route.params.app_id);
    if (validateInput(comment)) {
      try {
        let obj = {
          comment: comment,
          rating: rating,
        };
        //customerID
        //appointmentID
        //rating
        //comment

        const value = await localStorage.getItem("loginkeysasa");

        const { data: responseJson } = await axios.post(
          ip +
            "/api/reviews/saveReviewOFCustomerBySaloon?customerID=" +
            props.match.params.id +
            "&appointmentID=" +
            props.match.params.app_id,
          obj,
          {
            headers: {
              "x-auth-token": value,
            },
          }
        );

        console.log(responseJson);

        if (!responseJson) {
          // do nothing
          alert.show(
            "Review cannot be registered, please be sure the following 1- Have active internet  2- Correct Review Registration data"
          );
        } else {
          console.log("Review regstered: ", responseJson);

          alert.show("Review Registered Successfully!");

          //console.log("ininin: ",props);
          window.location.href = "/appointments/1";
        }
      } catch (ex) {
        setErrors(ex.response.data);
        console.log(ex.response.data);
      }
    } else {
      alert.show("Please enter valid comment...");
    }
  };

  const GetSaloonInfo = async () => {
    // console.log(props.route.params.app_id);
    //if (validateInput(comment)) {
    try {
      const value = await localStorage.getItem("loginkeysasa");

      const { data: responseJson } = await axios.get(
        ip +
          "/api/appointments/getSaloonInfoWrtCustID?app_id=" +
          props.match.params.app_id,
        {
          headers: {
            "x-auth-token": value,
          },
        }
      );

      console.log(responseJson);

      if (!responseJson) {
        // do nothing
      } else {
        console.log("Review regstered: ", responseJson);
        setSaloonName(responseJson.customerID.name);
      }
    } catch (ex) {
      //      setErrors(ex.response.data);
      console.log(ex);
    }
  };
  //else{
  // alert.show("Please enter valid comment...")
  // }

  useEffect(() => {
    GetSaloonInfo();
  });

  const validateInput = (data) => {
    // validating phone
    var schema = joi.object({
      comment: joi.string().min(10).max(200),
    });
    const error = schema.validate({ comment: data });
    //console.log(error);
    // return error.error.details[0].message;
    if (error.error) {
      setErrors(error.error.details[0].message);
      setCommentOk(false);
      return false;
    } else {
      console.log("ok");
      setErrors("");
      setCommentOk(true);
      return true;
    }
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <div>
      <MainGui></MainGui>
      <div className="row ">
        <div>
          <SideMenu />
        </div>
        <div className="col col-lg-10" style={{ marginLeft: "2%" }}>
          <nav
            class="navbar navbar-dark bg-dark justify-content-between"
            style={{ marginBottom: "2%", paddingLeft: "4%" }}
          >
            <a class="navbar-brand">Rate Customer</a>
          </nav>

          <div
            style={{ marginLeft: "3%", padding: "2%" }}
            className="alert alert-primary"
          >
            <h2 style={{ paddingLeft: "1%" }}>
              How was your appointment with
              <span style={{ color: "green" }}> {name} </span>? We want to hear
              from you...
            </h2>
          </div>

          <div>
            <h2
              style={{
                color: "black",
                marginTop: "5%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Rate Customer with Stars
            </h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactStars
              count={5}
              edit={true}
              size={90}
              onChange={ratingChanged}
              activeColor="#ffd700"
              value={rating}
            />
          </div>
          <div>
            <h2
              style={{
                color: "black",
                marginTop: "5%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Comment
            </h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <textarea
              style={{
                height: "70%",
                width: "40%",
                borderRadius: 20,
                padding: "5%",
                borderColor: commentok ? "black" : "red",
              }}
              value={comment}
              onChange={(n) => {
                setComment(n.target.value);
                validateInput(n.target.value);
              }}
              placeholder="Write your thoughts about saloon here..."
            ></textarea>
          </div>

          {errors ? (
            <div>
              <h6
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "red",
                  margin: "3%",
                }}
              >
                {errors}
              </h6>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3%",
              marginBottom: "10%",
            }}
          >
            <Button
              className="btn btn-success"
              style={{ width: "25%", padding: "1%", fontSize: "120%" }}
              onClick={() => {
                RateQuery();
              }}
            >
              Rate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RateSaloon;
