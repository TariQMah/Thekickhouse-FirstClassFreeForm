import React, { Component } from "react";
import { apiURL, siteURL } from "../../config";
import axios from "axios";
export default class LocationList extends Component {
  state = {
    nearestLocation: "",
    selectedLocation: "",
    k_business: "",
    manualSelection: false,
    locationList: [],
    isReady: false,
    error: false,
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
    this.searchClient(
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

    this.askhGetLocationsList(element.as_franchiseBusinessId).then((result) => {
      this.props.updateLocationData(result);
    });
    this.props.updateBusinessID(element.as_franchiseBusinessId);
    this.setState({ selectedLocation: element });
    this.props.updateSelectedLocation(element);
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
        element.as_franchiseLatitude,
        element.as_franchiseLongitude
      );
      let locationArray = {
        name: element.as_franchiseName,
        address: element.as_franchiseStreetAddress,
        city: element.as_franchiseCity,
        state: element.as_franchiseState,
        zip: element.as_franchisePostalCode,
        distance: store_distance,
      };
      distanceArray.push(locationArray);
    });
    distanceArray.sort(function (a, b) {
      return a.distance - b.distance;
    });
    //console.log(distanceArray);
    this.setState({ nearestLocation: distanceArray[0] });
  }
  componentDidMount() {
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
    this.setState({ locationList: locationList });
    if ("geolocation" in navigator) {
      let clientLatitude;
      let clientLongitude;
      navigator.geolocation.getCurrentPosition(function (position) {
        clientLatitude = position.coords.latitude;
        clientLongitude = position.coords.longitude;
        self.setState({ clientLatitude: position.coords.latitude });
        self.setState({ clientLongitude: position.coords.longitude });
        self.getNearestLocation(clientLatitude, clientLongitude);
      });
    } else {
      //console.log("Not Available");
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
  render() {
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }
    let locationList = this.state.LocationList
      ? this.state.LocationList
      : this.props.locationList;
    return (
      <div className="row locationSelectionScreen">
        <div className="col-12">
          {errorMessage}
          {!this.state.manualSelection && this.state.nearestLocation && (
            <div className="nearestLocation">
              Your Nearest Location
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
              <span className="state">{this.state.nearestLocation.state}</span>
            </div>
          )}
          {this.state.manualSelection && (
            <div className="nearestLocation">
              Your Selected Location:
              <br></br>
              <span className="locationName">
                {" "}
                {this.state.selectedLocation.as_franchiseName}
              </span>
              <span className="locationStreet">
                {this.state.selectedLocation.as_franchiseStreetAddress}
              </span>
              <span className="city">
                {this.state.selectedLocation.as_franchiseCity}
              </span>
              <span className="zip">
                {this.state.selectedLocation.as_franchisePostalCode}
              </span>
              <span className="state">
                {this.state.selectedLocation.as_franchiseState}
              </span>
            </div>
          )}
          <div className="locationSelectionHeadline">
            New to KickHouse? Select a location below for your free trial.
            Members will see a schedule of all current classes.
          </div>
          <div className="sortedLocationLists">
            {locationList.map((element) => {
              return (
                <div className="row locationList">
                  <div className="col-6">
                    <div className="locationName">
                      {element.as_franchiseName}
                    </div>
                    <div className="locationAddress">
                      <span className="streetAddress">
                        {element.as_franchiseStreetAddress}
                      </span>
                      <br></br>
                      <span className="citystatezip">
                        {element.as_franchiseCity}{" "}
                        {element.as_franchisePostalCode}{" "}
                        {element.as_franchiseState}
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <button
                      className={
                        this.props.businessID === element.as_franchiseBusinessId
                          ? "btn btn-dark"
                          : "btn btn-outline-dark"
                      }
                      onClick={() => {
                        this.updateBusinessID(element);
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="row navigationButtons">
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
          </div>
        </div>
      </div>
    );
  }
}
