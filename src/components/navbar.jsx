import React, { Component, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Dropdown, FormText } from "react-bootstrap";
import "../index.css";
import apiKey from "../keys/google_api_key";
import Contact from "./Contact";
import { Redirect } from "react-router-dom";
import store2 from "../redux/store2";
import jwtDecode from "jwt-decode";
import Settings from "./Settings";
import ReactStars from "react-rating-stars-component";

import axios from "axios";
import ip from "../ipadd/ip";
import ActivityIndicator from "react-activity-indicator";

function NavBar(props) {
  const [predictions, setPredictions] = useState([]);
  const [i, setI] = useState(false);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [numOfReviews, setNumofReviews] = useState(0);
  const [status, setStatus] = useState(null);

  /* NavBar.updateMe = (data) => {
    setValue(data);
    setI(i + 1);
  };setStatus

*/

  const saloonInitialData = async () => {
    // let storestate = store.getState();
    //console.log("mkm ",id);
    if (localStorage.getItem("loginkeysasa")) {
      try {
        const { data: responseJson } = await axios.get(
          ip + "/api/customers/getCustomerDataForChange2",
          {
            headers: {
              "x-auth-token": localStorage.getItem("loginkeysasa"),
            },
          }
        );
        if (!responseJson) {
          console.log("no saloon data found");
        } else {
          console.log("sla:", responseJson.saloonOverallRating);
          //setSaloondata(responseJson);
          setRating(responseJson.saloonOverallRating);
          setNumofReviews(responseJson.numOfReviews);
          setStatus(responseJson.saloonStatus);
          setLoading(false);
        }
      } catch (ex) {
        console.log(ex);
      }
    } else {
      //do no
    }
    //console.log(responseJson);
    // setLoading(false);
  };

  useEffect(
    () => {
      //getRating();
      saloonInitialData();
    }
    //  query for fetching category 2 server data
  );
  {
    if (!value && !i) {
      try {
        const value2 = localStorage.getItem("loginkeysasa");
        //console.log(value);
        if (value2) {
          const customer = jwtDecode(value2);
          setName(customer.name);
          setI(true);
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }

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

  const logout = async () => {
    //console.log("Logout pressed");

    try {
      await localStorage.setItem("loginkeysasa", "");

      store2.dispatch({
        type: "LOGGED IN",
        payload: {
          logged: false,
        },
      });

      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <Link className="navbar-brand" to="/">
          <img
            width={"30px"}
            height={"30px"}
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADgCAMAAADCMfHtAAAA8FBMVEX////acwpZOBPZbgDacQDYagBUMQBOJwBTLwDYaADZbABMJABXNg5RLABQKgBKIABIHABHGgBWMwhFFgDXYwBIHgD9///8+vhCDwDoroj79fHEvLaXiHz29PNXMgDilmHV0MykmI5qUDhnSSvAtayTgXGuoJTj3ddfQSM+AABfPhvt6+rv0b7y2Mh7ZFDOxLz04dXqvqHbfzH47OSIcl/ptpV0WkK0qaHm4t/fiknejlLjoXPtx6+LeWrfkljim2nkpnvaeiN0XEflsIzchDxzVDVnRR+Re2ZBCADbfCqCbFrLvrF8XkHg1curnpW/sKJw6laHAAAUdUlEQVR4nO1dCVfiShZGAlnIxmpUQMPeIwoiCri12t0+X3e/fv7/fzPZt7qVVCVBnTl8Z+a9M5MY8qVu3a1u3SoUdthhhx122GGHHXbY4f8FS30+7nVm/X5/YMD4V/+101vP9aOPfrHs0CbDzuyvhipysszXDUgGzH+zvKyIYrXxMhsPJx/9lmkxbXdOWyrHs1IRD4mVOVWVHoYT7aPflxJ674tBLo5biCevqPJqPP+fYTl/kEWZlJ2Huiyqq7H+0S+fjEmnJrLkvKS6LHMmFHOmGmPZem13P5pDHOZ9VSYmxypcTZr1er9/z+e/171eZ9U/rqnVRmO1/mgeOKxZsU4qkir312g9n0aeoHX/tHuv/MHB+EMIJGDNcmSTT5Jr/bEep1a6k3Xn08mqPhCT+ZnmkOXksTF0m8l82LYw2Uw/HRsU3Vc1ST6NWVdlv3w5vRqaf6BN2u3x6LX4Hwu10y+vvd+f2cdpq3zCtOMav4btKSqZ0+lm3h4/DBoGqjX+W+dzujgP1dhZJx5867WTnrGZj2dcSxQ59WDVa0c10Mdieoo3EJJc/dKLVSohTIavdVXhDU/upfd5xnKOtxB8azDe0D5vsv4mirxhToqdP9t4X2q81TAqVOLUjp7umdq8c9yS67x6nPYJOaJXw/ATi2+ZbMBmfKqykkGSXgpyxRijY7jiMOEvteX5+dmhgcXZ+cVyCRkKfcRxkuEezBLV1PYwb8HzrxbndF3cf7+5bApCuVypMAxTqZQFA83nm8P7i8it2toYyCIryr0PUq76ASigjRFWeV4sbptCpVIq7SEolZiy0Py6OA//sf6rwRsqufFL3zYbAFMwxJXruHe5ONwTKgC3EM+KUPnxdL8M/kxHNMwRW13N34FTGC9QHNgawTcfLZ4FJoGey5KpCF/P9v2/7fZqilSsi4mTO2eMFEBCD+APvbxrJo1ehGW5fHceeMCYV0wDVH9PjnPATrASqBGWNwJDQ88GI5QOA6pnbMqqxEnvxlE7Rieh/A1SMUd3AtXwBQayIvy496S12zP9e0l80d+HYQd1RpUZdON1OcX4+STLzLX3qKNRw/AQ663VezgBkwZK8Bdw3/KykoGfPZDla080Nt9UQ3TqjYftJx77iLvNQyN4Vk4poCFUmGtPVueyKTy8uu3pOFcRJTMAbls0c+Bnc7z3HtoxRbUo9rcrqoPoEErHgJ99J+RE0JyPe2fuYzd90fjF+kFviwR1ZAhbQMD6WM6NoMlRuPFsx7pqfmHlVN8aw19Rb0YEXO27XAlaHB/dEGRqDaPU6GyJ4DSqSNkVetMiPxH1wAgL9/FjK7mnDLYzG3tRW1hFXZnzvJRMGOVn15ebDGRrNm5lBeA04s5wqIwebWEELZSEO9cWjixtoM7yt42TiJ6RWPSeH3nYQRgM42qctpUE47nc03JRIVXReGKRt5YJotR0Hblp0cxES3/nbf4j/kz9BbnjaJsEDZRvXaU6E61vjAlK0yISNonoEJ6kc7ZLNgjuZPZcSe1ZuTCln+dkjExDSULuuKBWMyUzHdX8eWLittIUyknpgJJnN+YNU+/xpzku67S5EEMFVde3dGqmVGn++H629NMW+xf3h5fNSrwgCHfO3fqxOWvqNT03huOwouEQh3RJZQpLwuUC+v5H949MbGqgcuNI5rRoulhS9XdeDF9DK2ksGhU+UsxCg9858Bs29s8f49I7DOOk5LqWSi028loan4WcUg5JSNMoUiYQFYHQFs/4HEip7Hwd7R9LrtSrfBi+hIxFC1FiC/KovnxDoALPLvEcm+4HmlmJPziPQo2QKq1/Q67fEOsZ4YnsF2M4eirVpij/k0dJQMgcyojsk3ukfqCQzPEZJ/reV7IpsvXsFLUQQ1WPXr8nFdLyd5qfXeCMR9m1GjNL3dTZzIs4R6EFtRpy/Y5QkzInlL97ghGO8qNzx6mlAutwVjotQ+kv5Drp4kSF2s86w5hHl2LXpsj282TIPyCXCaehcAY9PB7aV/jhHsW6FbgqrzkyRBUNoU9aukz14wtYqboUlw2b4iqTHx7SNKi9J7SGlRRDaOKCASXVpTix6yZkIG9EgSBDESkIuSZjKOxDjyaAdgP+QPnJvqzb6+5yJtMfTLS1EL1FpkqZO+jJZHgE54FrXNv263FZ0sVyLEOyyKmcUkgtfIcpOg5cz4r6i9UMObiV75dKx8jVr2QMM8Wr12B41nTCftvyF1t66ucHYgvpFLlKNIal59S/buEMHMWyHUxpkp3sPEidLB758aH0BblK5Hczj8BzaQBSdL/bxLZnUjGtzVgr2RkepidnA1wzYG7tiz07zwKuaJJgLsYxJJLS7AwL1xDFsvNcJ9/JpUwybtQ4hkSaJgeGhe9QPCXYQf/UecVWylSxb/LTapo8GBZuActbKtlKeu3IWTVdwn/gLcwAudInEoufC8PCT+BjMjf2tZWt8OunqbRNx1emChJRE3ltzFMmag6OoECtbK9puHIqp0pOBVLC6MIhkedd+pGRnI1zSNsItlV05TRV0cbUj59UxKqCv4owfE7reIdxCGib0k/7miOnwCsSwF8hRVdlyOJDIadVBmiZ0sn/TJ3q3jpUBpME36vhEBnYJ8oHZ/K8A1iCJsN2UF05BVaoE+HbfB4thth7N3Nh4jsw7V3vzQ0RavQmQ/NsPouqKqJVi6yut4d9aLmxYseKbslIGjm98sILHrlGli8VlsBj0wD0wZ0oY6ykllPfXlQRlUGmairk+e4EXEJ238nFOnFUsUadQtW8In1RR64RpTFS5toAwEbR9k/bjsIAlgCTcOVqU/lf5BpZHiM3MQUthvsB3XWyKnWdv6dNAVVDlk+sUK1axAGciU7C2S0xTKFs3K0WQKZmSZYTrmSm5gKyTyXHA3crYzjqxJRX5g2UXRJZxL1KwuovOUBnv2nPAt31MEXaIGPjZk2VN+QaUQCVn0ksHEGpN3cmfnMGkaeO992/rKPJEMKli3Jugwjmhpz8qe5uPgPqJ+PhKuKigg4/2QJbaS8HchbuIe/UHUTXd2OpV6RcawoUfRGuXZTzsvrwip7jgHtqv6FTPnbo+DXoEiKpNt2jXyTFAMpneGsj7lAARRXx8NzvFnqNsOwry/pMCIegbhPsD+jld6s65WP/VbBiShTo73mClBlnYFDqqDJvKFjqQXQafQBiWngmXMwvZWdnAp6IbjbIC9ipB/HNmYlVdDqR1ghXnrKSs6DBH9TxfSdughdwMRPgzGE0lVHYJy2qaeLr9mgAhVDG93Oqpb06NeqsVNuW8Dq024KUYj45KXg9yHWbXLWfwrFxrCmQCNFIGeYTKGIcRUdMu176E5hQ8dAb2E9DaPUNUcq6lmgCNhdeJsHLuqDVMUkY2SGGin4ajbA2iqqADwso5bbnx1CeXyMVaZ/ctfuyKcCnId9yIWR3wTFjuNe0L/vJQWBvSALstKtUBy4RbSuw3yOzQsUxdPI1vpimyNjYmlgEmnPA5QTwi2T1bU4wX9O1F542LarUabeNZU6BxWCavU+lrBRhe2g8+Kt9veuJKTShEmCXBUDyTbGxpCRkE1Tct/QSCV4RkJQiAW7tCYasPnExrYlmFnWD/5ZNR8uPvQISFbuKMcEVUE+s9DBUgkRuMcx3uUYfQAq8B+WKv79zWcZWvI2xFY2WnAI72AqFe5oNUAJlWXQA+CIed0eGv8MAyH86mP6NdeosORWh5WSoXgKLys+UPmpMTsGrY/Vr1fBiOqvidk7bu9lUQIzpNsuWmHT6BuPRWAxdh8nfrYX33OZiFc2N2rDklIeSWVRyaqjUNCunWoz35Dn2ureqG5Phl6UqrrDBUsbo3osC3TYvA+VL+hWbWJXtRmddv2lXA2v0R2yxgaE4NfUpUCFlxMI0+nQvuMmXFPFm1/Ml/H46QMTuwNS4B5irQzMEUyBFfEG7Mb/8k8rB2Y/PCXnLIw9eeQWUWHJgbmeoYSiOODgUTtFcoSTcUSjVr/HTwGP45tl8ME6wYTkGOIpmhU4dck8LJ9RNeJgKsagmPdxjGOhW0sKma7qWPmrAGtVKLsI1AWBKOuHFmGuicUz8ev7GDr/jjIKvBLNlGbP7fWpGw2C545Kuk5mFUkX4mmgdj5J7NPlRi1/bHDMRncyjCN9h9jeD5TRdG5CScBNfOrUg6NHkM+x6dbF4x80LQhS428bQeIYCOj50hj/AsfSEG8j9+z2SPEnZ/3u/q04NPwPclA7/BbynZ8zmBpgJeUrZR6LElJtfFxdIKePFk0DWZCuwmO67NehmJh/eUhXsv47EogQsmRp4TN/VzJiSzI+nxdnySDsy/nNxdngbv1Mfw7DgMQS6JHjwEh4SXJr6qoANhwqJdiuJJWO3OTVRoXGTgsmDB1dMY1RNoeAfyAGHGn0et6vqMhPFtAiuwnraNHax1M9aFbkVFPYbFGtwUvLnB1AM7c7x91FwMQwLRb+FEgs2Y+3zkgw6DdoHUAwXsnq7DGKUqTGI/paZotQCBFIb8HUoyjCuPL87xXBJi9cdCS04DCLUNYLrA5I64DHa5v1HMWAO9YC94GKT+3poQz6roDdrfZ6DMx7vTjGwPGmIm+aqGnzCzUK4uYlURVs/GxRV+Bna+2rUYFWS+c1nbvlQ/Hr3JtKmXD7WkXtWcg2T1LnN2tCUBkFVOpv4+aikzHcv0iNZqqHDOONqmJ4/+TaMjEfQo2HbgYl4nLAYXIz2EJYlZDaOVFxbo6dt9eNDEaxElgyGmltSmVTHh3abl2pXUaXaqeEqyeCdyltAsMKz2zALtt0VmsSqjBnarJwXo+7sW03BfKn75vaaDgYRTIZMD8zA3a0eQptBRNDlEIbGXw308F3zAxYj7ueUOcaUCArpvGa620OFkGFhiHShLZo9067C3tBGecFQPHoP96Z0G3pjk6HrmuJzph4AOTVFNdIVtrvCbubAdGLJE6GV5Qdr37PmCB9QvB1FF3N2h8yHp+MIu/H/Om2rdlKEi5EGnEXKif5ICmtAOS2are/5kOVY/wcn8uel7UpqaOV8UrUFc2TLHlH91xXuECRJHQQ5TrDHxB3dbrXN6U1oQBRbuTheDRFDt/8EpHJCHDW8I79NSW2Glj+uWDuz5GxKI6vhm8Qc1WWMI9EW44vnbbmplfBS5LFkuzF/VOJ5WPD6T2DGkWPXJN3hDrdj/SMbViZqkbcMl6MhCXSphW+x53FKysFIT37IdoYxLKPG9HOKmjTbqSGwh87tCWce8uqK4LCmw/xnY7TgcSC5O0rsXE2yT+MAOOYCEVaCw5qWP3LmWIlUrhgqww3r7d1sxAwLa4xVDAqr3FgNk2bkWSlPUWWiPRt6speasRvM4ktOEEAnBgEDWZ0lkfye6bSWEErPUW9Y9ROIdr6NZp9Xn+z0X5ZrjeI5Lh/TnCgEgNmLEjSMoFdGYTNMivGDOFJJj2+WgbRcmONJMweOlUvk7Qd1v3TWWqqnq1CMttnHQ2ok9YnLgaNwgizFmUv43nLTb6sKj66F1BBzBiIAMXHXSkZZBctxzNSFV50wNxkm5EsRjIlHsSi/JJuOp3KKdX8blT2gFudPy1To7v+y0m0cbe/vhzj3LYw6VBIegbbYSzWQpeYT9Diz2YzfosRiSGEsHFyR2AwHRAcZnJ8ItNYjeNROEGPz8/tbCC2GwJ7JJMyIj1QnPRxGO79jEo9L9MFg+DmuNufpV5MhWLOdhEH8qc5hSSVt3nTxfU9IOEDAHr5y8wlXDGcllALrFCZDWkVjQRuQWX5HUmekbbeXi5OyAB7r6bJjysItvgzeTrYEthKYDIFtr7lTZCl6cO1fXN/uCWWkQKHEMBWhfPl0FuOfbCwdGNzuZDJspCu31mgElWYYLZbLs8XdV6FSMU+gLZetf/54PLy/SHhXu5gtGNEb9jBVcywTlBR50ig0iH1N2zf+a/yT6PZftgI8CBhhw6eh36PnQltRGA0D4mrLx4u/2nY61E7B8LzpraGPK3LTb/202tnmUY0OwXABek+m34QYxIMYzykKmd/eUY0jh2A91Ia+J6eyFYHHwgdZYyGJX/RMP4h/E/djhzcsvbLQSYY0eCOPNJxPrM62MR09ghEHps/CxT4UaB+QhsQu2MZV7of8vfoN1/TQhUGaLoMRTDga278Vjlrf85Mj3TC6KlwdSofpC4Uf7r5I61d+sjop+t+4Ef500//kc2DiFaVKtTjWZjmdnj4OpI7kSHHWPLYskeZHqrST0eSonr5lFyF9EDDKUj3ywDc98w+4v6NQT0bzhZQGyVJHDLqjWrCyEGm2l8dpSQ6mL3QunAteHfyb/iycnhjyjfmcTvHCoENrGd2BJFkGgNAdHyuRJ+VOKoy5mkZSTdSVxmpNqVsno5ocmfzUTYWo0V2l0KkeSZXvzEmHcjMetJDYDTqHOXeMa9ETvCkg8Vxj0BkmjqXee0GGr5jhbAQ6bF7oAiqApXqwGq3/wD7Ppt1bHYgy9BlTR/LUGFczDKPzsrwiqpz6z2g0HrZN/Jm328POw7Hx/4LszE+DKxvcAjYZZmOEKCtzFkTzH3zcGrukbDl/EMYa1QLbxt/6exI0fP3XLBonBQ5ycnEpoA/EFJ5qSkgqcSFCnhjK9DFVSoL5n0VOBq1XTevjUIHl3k+LRnH0UNs+x4xnA2bF5qq1ZY61nM9Zp8fkqrFFjuxBbmdXZ8DmobEt8yiuPm4KhrDpcMoWbAer5pNlygXav1Lq4BEDSZ19kgF0MZ81gJAnNT/u9P3dmERMx6c5DaSkyJ9IQEPQR5yYmaQk8p+Vn4X5a1VMqjWOA9/68gnlM4L56FjFRbLxYDl19EFOKC0m4xUn8nQsWY77NfxQF40S2ryzUlWFJaEpsYpavZrndLjZe0KbrEcvDVWU+Tpmakpm0qZ2/Is2nfq5MJn3Rv1Bq6pyHKfwNmSF40S1Kg76nbX+Pzh2ELrdSXs+fOvYGL+15/NlN8eVlR122GGHHXbYYYcddthhhx122OH/CP8FMNXRcaGrnVIAAAAASUVORK5CYII="
            }
          />
        </Link>
        <Link className="navbar-text" to="/">
          SASA - Saloon Insights
        </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <span className=" ml-auto mr-5"></span>
          <ul className="navbar-nav ">
            <li className="nav-item dropdown mr-5 my-2 my-lg-0">
              <NavLink className="nav-link " to="/">
                Dashboard
                <span className="caret"></span>
              </NavLink>
              <div
                className="dropdown-menu"
                aria-labelledby={"dropdown_target"}
              ></div>
            </li>

            {!localStorage.getItem("loginkeysasa") ? null : (
              <li className="nav-item mr-5 my-2 my-lg-0">
                <NavLink className="nav-link " to="/reviews/0/1">
                  My Reviews
                  <span className="caret"></span>
                </NavLink>
              </li>
            )}

            {loading ? null : !localStorage.getItem("loginkeysasa") ? null : (
              <li
                className="nav-item mr-5 my-2 my-lg-0"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <ReactStars
                  count={5}
                  edit={false}
                  size={24}
                  activeColor="#ffd700"
                  value={rating}
                /> 
              </li>
            )}
            {!localStorage.getItem("loginkeysasa") ? (
              <li className="nav-item mr-5 my-2 my-lg-0">
                <NavLink to="/settings/2" className="nav-link">
                  Login/ Sign Up
                </NavLink>
              </li>
            ) : (
              <li className="nav-item mr-5 my-2 my-lg-0">
                <Button className="nav-link bg-dark" onClick={() => logout()}>
                  Logout
                </Button>
              </li>
            )}

         </ul>
        </div>
      </nav>
      {status === null ? null : (
        <div className="alert alert-danger">
          {status === "nan"
            ? "Your saloon profile is not visible to customers right now as you have not yet applied your saloon for confirmation. Please apply for confirmation from Settings -> Account Settings -> Apply for Confirmation"
            : status === "confirming"
            ? "Your profile application is under processed, we will confirm back to you soon! Moreover, your profile is not currently visible to customers but you can make your saloon profile stunning by adding new services and deals and your saloon gallery."
            : status === "confirmed"
            ? "Your saloon profile is confirmed. Now your profile is visible to customers and your saloon appointments section has been started.  "
            : status === "rejected"
            ? "Your saloon profile has been rejected. Please again apply for confirmation!"
            : null}
        </div>
      )}
    </div>
  );
}

export default NavBar;
