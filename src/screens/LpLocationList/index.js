import React, { Component } from "react";
import { apiURL, siteURL } from "../../config";
import axios from "axios";
import { usStates } from "../../data";
const locationSpecific = window.locationSpecific;
export default class LocationList extends Component {
  state = {
    nearestLocation: "",
    selectedLocation: "",
    k_business: "",
    manualSelection: false,
    locationList: [],
    isReady: false,
    error: false,
    userInfo: {
      state: false,
    },
    usStates: {},
  };
  async askhGetLocationsList(k_business) {
    const response = await axios.get(apiURL, {
      params: {
        askhGetLocationsList: true,
        k_business: k_business,
      },
    });
    const data = response.data;
    if (data.status === "ok") {
      this.setState({ locationAPIdone: true });
      const locationData = data.a_location[Object.keys(data.a_location)[0]];
      this.setState({
        locationData: data.a_location[Object.keys(data.a_location)[0]],
      });
      return locationData;
    } else {
      return false;
    }
  }
  updateBusinessID = (element) => {
    this.setState({ isReady: false });
    this.setState({ error: "" });
    this.setState({ manualSelection: true });
    /* this.searchClient(
      this.props.clientData.email,
      element.as_franchiseBusinessId
    ).then((result) => {
      if (result) {
        this.props.updateIsMember(true);
        this.setState({ isReady: true });
      } else {
        this.registerClient(
          this.props.clientData,
          element.as_franchiseBusinessId
        ).then((result) => {
          if (result.status === "ok") {
            let clientData = {
              firstName: this.props.clientData.firstName,
              lastName: this.props.clientData.lastName,
              email: this.props.clientData.email,
              phone: this.props.clientData.phone,
              uid: result.uid,
            };
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "askhNewProspect",
              formLocation: "popupIntroClass",
              clientData: clientData,
            });
            this.props.updateClientData(clientData);
            this.props.updateIsProspect(true);
            this.setState({ isReady: true });
          } else {
            this.setState({ error: result.message });
          }
        });
      }
    });
 */
    this.askhGetLocationsList(element.businessId).then((result) => {
      this.props.updateLocationData(result);
    });
    this.props.updateBusinessID(element.businessId);
    this.setState({ selectedLocation: element });
    this.props.updateSelectedLocation(element);
    this.props.updateGeoLocationPermission(true);
  };
  distanceCalculator(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
  getNearestLocation(clientLatitude, clientLongitude) {
    let locationList = this.props.locationList;
    let distanceArray = [];
    locationList.forEach((element, index) => {
      let store_distance = this.distanceCalculator(
        clientLatitude,
        clientLongitude,
        element.as_franchiseLatitude.replace("\t", ""),
        element.as_franchiseLongitude
      );
      let locationArray = {
        name: element.as_franchiseName,
        address: element.as_franchiseStreetAddress,
        city: element.as_franchiseCity,
        state: element.as_franchiseState,
        zip: element.as_franchisePostalCode,
        businessId: element.as_franchiseBusinessId,
        distance: store_distance,
      };
      distanceArray.push(locationArray);
    });
    distanceArray.sort(function (a, b) {
      return a.distance - b.distance;
    });
    //console.log(distanceArray);
    this.askhGetLocationsList(distanceArray[0].businessId).then((result) => {
      this.props.updateLocationData(result);
      this.props.updateSelectedLocation(distanceArray[0]);
    });
    this.props.updateBusinessID(distanceArray[0].businessId);
    this.setState({ nearestLocation: distanceArray[0] });
    this.setState({ locationList: distanceArray });
  }
  componentDidMount() {
    console.log("locations: ", window.locations);
    this.props.updateIsMember(false);
    this.props.updateIsProspect(false);
    this.setState({ error: "" });
    let self = this;
    let businessID = this.props.businessID;
    if (businessID) {
      this.setState({ isReady: true });
    }
    let locationList = this.props.locationList.map((location) => {
      let rObj = {};
      rObj["name"] = location.as_franchiseName;
      rObj["address"] = location.as_franchiseStreetAddress;
      rObj["city"] = location.as_franchiseCity;
      rObj["state"] = location.as_franchiseState;
      rObj["zip"] = location.as_franchisePostalCode;
      rObj["businessId"] = location.as_franchiseBusinessId;
      return rObj;
    });
    const usStatesList = usStates.reduce(
      (statesSoFar, { abbreviation, name }) => {
        const locationState = locationList.find(
          ({ state }) => state === abbreviation
        );
        if (locationState)
          statesSoFar[abbreviation] = {
            name: name,
            abbreviation: abbreviation,
          };
        //if (!statesSoFar[state]) statesSoFar[state] = [];
        //statesSoFar[state].push(name);
        return statesSoFar;
      },
      {}
    );
    //console.log("usStateList", usStatesList);
    this.setState({ usStates: usStatesList });
    if (locationSpecific) {
      locationList = locationList.filter((el) => {
        const locationSpecificItems = window.locations.split(",");
        if (locationSpecificItems.includes(el.name.toLowerCase())) {
          return true;
        }
      });
      this.setState((prevState) => ({
        userInfo: {
          ...prevState.userInfo,
          state: true,
        },
      }));
    }

    this.setState({ locationList: locationList });
    if (!locationSpecific) {
      if (!this.props.businessID) {
        /*  navigator.permissions
          .query({ name: "geolocation" })
          .then(function (result) {
            if (result.state == "denied") {
              self.props.updateGeoLocationPermission(false);
            }
            console.log("result:", result);
            result.onchange = function () {
              if (result.state == "denied") {
                self.props.updateGeoLocationPermission(false);
              }
              console.log("result changed", result);
            };
          }); */
        if ("geolocation" in navigator) {
          console.log("geolocation found");
          let clientLatitude;
          let clientLongitude;
          navigator.geolocation.getCurrentPosition(
            function (position) {
              clientLatitude = position.coords.latitude;
              clientLongitude = position.coords.longitude;
              self.setState({ clientLatitude: position.coords.latitude });
              self.setState({ clientLongitude: position.coords.longitude });
              self.getNearestLocation(clientLatitude, clientLongitude);
            },
            function () {
              self.props.updateGeoLocationPermission(false);
            }
          );
        } else {
          self.props.updateGeoLocationPermission(false);
          console.log("geolocation Not Available");
        }
      }
    }
    //this.loadLocationList();
  }
  async searchClient(email, k_business) {
    const response = await axios.get(apiURL, {
      params: {
        askhSearchClient: true,
        text_email: email,
        k_business: k_business,
      },
    });
    const data = await response.data;
    //console.log(data);
    if (data.is_use) {
      const clientData = {
        firstName: data.a_user.text_firstname,
        lastName: data.a_user.text_lastname,
        email: email,
        phone: data.a_user.text_phone,
        uid: data.uid_result,
      };
      const response = await axios.get(apiURL, {
        params: {
          askhGetUserInfo: true,
          k_business: k_business,
          uid: data.uid_result,
        },
      });
      const userData = await response.data;
      if (userData.is_traveller) {
        this.registerClient(clientData, k_business);
        this.props.updateClientData(clientData);

        this.setState({ isReady: true });
      } else {
        this.props.updateClientData(clientData);
      }

      localStorage.setItem("askhClientData", JSON.stringify(clientData));
      return data.is_use;
    } else {
      return false;
    }
  }
  async registerClient(values, k_business) {
    const response = await axios.get(apiURL, {
      params: {
        askhPostLeadData: true,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        k_business: k_business,
      },
    });
    const data = await response.data;
    return data;
  }
  //State
  handleStateChange = (e) => {
    const value = e.target.value;
    this.setState((prevState) => ({
      userInfo: {
        ...prevState.userInfo,
        state: value,
      },
    }));
    let locationList = this.props.locationList
      .filter(
        (item) =>
          item.as_franchiseState === value &&
          item.as_franchiseVisibleOnFirstClass
      )
      .map((location) => {
        let rObj = {};
        rObj["name"] = location.as_franchiseName;
        rObj["address"] = location.as_franchiseStreetAddress;
        rObj["city"] = location.as_franchiseCity;
        rObj["state"] = location.as_franchiseState;
        rObj["zip"] = location.as_franchisePostalCode;
        rObj["businessId"] = location.as_franchiseBusinessId;
        return rObj;
      });
    this.setState({ locationList: locationList });
    console.log("statewise filter ", locationList);
    if (value === "") {
      this.setState({ stateError: true });
    } else {
      this.setState({ stateError: false });
    }
  };
  render() {
    let stateOutput = [];
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }
    let locationList = this.state.locationList
      ? this.state.locationList
      : this.props.locationList;
    if (this.state.nearestLocation) {
      //locationList.splice(0, 1);
    }
    // US States Options
    if (this.state.usStates) {
      Object.keys(this.state.usStates).map((key, index) =>
        stateOutput.push(
          <option
            key={this.state.usStates[key].abbreviation}
            value={this.state.usStates[key].abbreviation}
          >
            {this.state.usStates[key].name}
          </option>
        )
      );
      /* this.state.usStates.forEach((element) => {
        stateOutput.push(
          <option key={element.abbreviation} value={element.abbreviation}>
            {element.name}
          </option>
        );
      }); */
    }
    return (
      <div className="row locationSelectionScreen askhIntroClassAPP">
        <div className="col-12">
          {errorMessage}

          {!this.props.isNlpFreeIntro &&
            !this.state.manualSelection &&
            this.state.nearestLocation && (
              <div className="nearestLocation">
                Your Closest Location:
                <br></br>
                <span className="locationName">
                  {" "}
                  {this.state.nearestLocation.name}
                </span>
                <span className="locationStreet">
                  {this.state.nearestLocation.address}
                </span>
                <span className="city">{this.state.nearestLocation.city}</span>
                <span className="zip">{this.state.nearestLocation.zip}</span>
                <span className="state">
                  {this.state.nearestLocation.state}
                </span>
              </div>
            )}
          {!this.props.isNlpFreeIntro && this.state.manualSelection && (
            <div className="nearestLocation">
              Your Selected Location:
              <br></br>
              <span className="locationName">
                {" "}
                {this.state.selectedLocation.name}
              </span>
              <span className="locationStreet">
                {this.state.selectedLocation.address}
              </span>
              <span className="city">{this.state.selectedLocation.city}</span>
              <span className="zip">{this.state.selectedLocation.zip}</span>
              <span className="state">{this.state.selectedLocation.state}</span>
            </div>
          )}
          <div className="locationSelectionHeadline">
            {/*  New to KickHouse? Select a location below for your free trial.
            Members will see a schedule of all current classes. */}
            New to KickHouse? Select a location below for your free trial class.
            KickHouse member? You'll see a schedule of all current classes.
          </div>
          {!locationSpecific && (
            <div className="us-states-dropdown mt-2">
              <select
                name="state"
                className="form-control"
                value={this.state.userInfo.state}
                onChange={this.handleStateChange}
              >
                <option value="0">Select State</option>
                {stateOutput}
              </select>
            </div>
          )}
          {this.state.locationList.length === 0 && (
            <div className="no-locations-found">
              No Locations in selected state
            </div>
          )}
          {this.state.locationList.length !== 0 &&
            this.state.userInfo.state && (
              <div className="sortedLocationLists">
                {locationList.map((element, index, arr) => {
                  /* if (this.state.nearestLocation && index === 0) {
                  return;
                } */
                  return (
                    <div className="row locationList">
                      <div className="col-6">
                        <div className="locationName">{element.name}</div>
                        <div className="locationAddress">
                          <span className="streetAddress">
                            {element.address}
                          </span>
                          <br></br>
                          <span className="citystatezip">
                            {element.city} {element.zip} {element.state}
                          </span>
                        </div>
                      </div>
                      <div className="col-6">
                        <button
                          className={
                            this.props.businessID === element.businessId
                              ? "btn btn-dark"
                              : "btn btn-outline-dark"
                          }
                          onClick={() => {
                            this.updateBusinessID(element);
                          }}
                          // disabled={element.businessId === "423571"}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          {/* <div className="row navigationButtons">
            <div className="col-6">
              <button
                className="btn btn-outline-dark btn-block"
                onClick={() => {
                  this.props.updateScreen(1);
                }}
              >
                Back
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-dark btn-block"
                disabled={this.state.isReady ? false : true}
                onClick={() => {
                  this.props.updateScreen(3);
                }}
              >
                Next
              </button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
