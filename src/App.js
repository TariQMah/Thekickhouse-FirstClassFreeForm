import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ProspectRegistration from "./screens/ProspectRegistration";
import LocationList from "./screens/LocationList";
import LpLocationList from "./screens/LpLocationList";
import LpClassList from "./screens/LpClassList";
import ClassList from "./screens/ClassList";
import Booking from "./screens/Booking";

import axios from "axios";
import { apiURL, siteURL } from "./config";
import GoHighLevelBooking from "./screens/GoHighLevelBooking";
import WlShop from "./screens/wl-shop";
const isNlpFreeIntro = window.isNationalFreeIntroLandingPage || false;
const isLocationPage = window.isLocationPageFreeClass || false;
const locationPageBusinessId = window.businessId || "";
const locationId = window.locationId || "";
const bookingEngine = window.bookingEngine || "WL";
const isShopPage = window.isShopPage || false;
/* window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "askhScheduled",
  bookingLocation: "microsite-homepage",
}); */
export default class App extends Component {
  initialize = () => {
    return {
      step: 1,
      businessID: locationPageBusinessId,
      locationId: locationId,
      bookingEngine: bookingEngine,
      locationData: "",
      clientData: "",
      locationAPIdone: false,
      isClientLoggedin: false,
      isLoading: true,
      classList: "",
      classSession: "",
      locationList: [],
      isProspect: false,
      isMember: false,
      locationURL: "",
      isNlpFreeIntro: isNlpFreeIntro,
      wlGuestInfo: "",
      isLocationPage: isLocationPage,
      geoLocationPermission: true,
      wpLocationData: "",
      purchaseOption: "drop in",
      selectedLocation: {
        name: "",
      },
      isShopPage: isShopPage,
      loginTypes: [],
    };
  };

  state = this.initialize();

  reset = () => {
    this.setState(this.initialize());
  };
  updateWLGuestInfo = (guest) => {
    this.setState({ wlGuestInfo: guest });
  };
  async askhGetLocationsList(k_business) {
    const response = await axios.get(apiURL, {
      params: {
        askhGetLocationsList: true,
        k_business: this.state.businessID,
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
  updatePurchaseOption = (option) => {
    this.setState({ purchaseOption: option });
  };
  updateScreen = (step) => {
    this.setState({ step });
    //this.setState({ vij: step });
  };
  updateClientData = (values) => {
    this.setState({ clientData: values });
  };
  updateLocationList = (list) => {
    this.setState({ locationList: list });
  };

  updateBusinessID = (k_business) => {
    this.setState({ businessID: k_business });
    //this.askhGetLocationsList(k_business);
  };
  updateClassList = (list) => {
    this.setState({ classList: list });
  };
  updateClassSession = (session) => {
    this.setState({ classSession: session });
  };
  updateLocationData = (item) => {
    this.setState({ locationData: item });
  };
  updateGeoLocationPermission = (bool) => {
    this.setState({ geoLocationPermission: bool });
  };
  updateClassSession = (item) => {
    this.setState({ classSession: item });
  };
  updateIsProspect = (bool) => {
    this.setState((prevState) => ({
      isProspect: bool,
    }));
  };
  updateIsMember = (bool) => {
    this.setState((prevState) => ({
      isMember: bool,
    }));
  };
  updateSelectedLocation = async (element) => {
    this.setState({ selectedLocation: element, bookingEngine: "WL", step: 1 });

    const response = await fetch(
      siteURL +
      "/wp-json/wp/v2/location?slug=" +
      element.name.toLowerCase().replace(/\s+/g, "-") +
      "&timestamp=" +
      new Date()
    );
    if (!response.ok) {
      return;
    }
    const locationData = await response.json();
    this.setState({ wpLocationData: locationData[0].acf });
    if (locationData[0].acf.as_franchiseBookingEngine === "goHighLevel") {
      this.setState({ bookingEngine: "goHighLevel" });
    }
    if (
      locationData[0].acf &&
      !locationData[0].acf.as_franchiseFirstClassOffers[0].value
        .toLowerCase()
        .includes("free")
    ) {
      setTimeout(() => {
        document.getElementById("first-class-heading").innerHTML =
          "First Class " +
          locationData[0].acf.as_franchiseFirstClassOffers[0].label;
      }, 100);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      locationName: locationData[0].acf.as_franchiseName,
    });

    console.log("locationData", locationData);
  };
  async loadLocationList() {
    const response = await fetch(
      siteURL + "/wp-json/wp/v2/location?per_page=100&timestamp=" + new Date()
    );
    if (!response.ok) {
      return;
    }
    const locations = await response.json();
    //console.log(locations);
    if (locations.length) {
      let locationArray = [];
      locations.forEach((element) => {
        if (
          element.acf.as_franchiseBusinessId !== "a" &&
          !element.acf.as_franchiseLocationStatus
        ) {
          locationArray.push(element.acf);
        }
      });
      this.setState({ locationList: locationArray });
    }
  }
  getLocationDataFromWP = async (id) => {
    const response = await fetch(
      siteURL + "/wp-json/wp/v2/location/" + id + "?timestamp=" + Date.now()
    );
    if (!response.ok) {
      return;
    }
    const locationData = await response.json();
    this.setState({ wpLocationData: locationData.acf });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      locationName: locationData.acf.as_franchiseName,
    });
    console.log("locationData", locationData);
  };
  getLoginTypes = (k_business) => {
    axios
      .get(apiURL, {
        params: {
          askhGetLoginTypes: true,
          timestamp: Date.now(),
          k_business: k_business,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status === "ok") {
          this.setState({ loginTypes: data.a_login_type_list });
        }
        // console.log("logintypes: ", data);
      })
      .catch((error) => console.log("logintypes error", error));
  };
  componentDidMount() {
    console.log('this.state: ', this.state);
    if (this.state.isLocationPage) {
      this.askhGetLocationsList(this.state.businessID);
    }
    this.loadLocationList();
    if (locationId) {
      this.getLocationDataFromWP(locationId);
      this.getLoginTypes(locationPageBusinessId);
    }
  }

  render() {
    return (
      <div className="bookingEngine">
        {this.state.bookingEngine !== "goHighLevel" && (
          <div className="askhIntroClassAPP">
            {this.state.step === 1 && (
              <ProspectRegistration
                updateScreen={this.updateScreen}
                clientData={this.state.clientData}
                updateClientData={this.updateClientData}
                updateIsMember={this.updateIsMember}
                updateIsProspect={this.updateIsProspect}
                isNlpFreeIntro={this.state.isNlpFreeIntro}
                isLocationPage={this.state.isLocationPage}
                businessID={this.state.businessID}
                locationData={this.state.locationData}
                geoLocationPermission={this.state.geoLocationPermission}
                selectedLocation={this.state.selectedLocation}
                wpLocationData={this.state.wpLocationData}
                updateWLGuestInfo={this.updateWLGuestInfo}
                updatePurchaseOption={this.updatePurchaseOption}
                purchaseOption={this.state.purchaseOption}
                isShopPage={this.state.isShopPage}
                loginTypes={this.state.loginTypes}
              ></ProspectRegistration>
            )}

            {this.state.locationList.length !== 0 &&
              this.state.step === 1 &&
              this.state.isNlpFreeIntro && (
                <LpLocationList
                  updateScreen={this.updateScreen}
                  businessID={this.state.businessID}
                  updateBusinessID={this.updateBusinessID}
                  locationList={this.state.locationList}
                  clientData={this.state.clientData}
                  isNlpFreeIntro={this.state.isNlpFreeIntro}
                  geoLocationPermission={this.state.geoLocationPermission}
                  updateGeoLocationPermission={this.updateGeoLocationPermission}
                  updateIsMember={this.updateIsMember}
                  updateIsProspect={this.updateIsProspect}
                  updateClientData={this.updateClientData}
                  updateLocationData={this.updateLocationData}
                  updateSelectedLocation={this.updateSelectedLocation}
                />
              )}
            {this.state.step === 2 &&
              !this.state.isNlpFreeIntro &&
              !this.state.isLocationPage && (
                <LocationList
                  updateScreen={this.updateScreen}
                  businessID={this.state.businessID}
                  updateBusinessID={this.updateBusinessID}
                  locationList={this.state.locationList}
                  clientData={this.state.clientData}
                  isNlpFreeIntro={this.state.isNlpFreeIntro}
                  updateIsMember={this.updateIsMember}
                  updateIsProspect={this.updateIsProspect}
                  updateClientData={this.updateClientData}
                  updateLocationData={this.updateLocationData}
                  updateSelectedLocation={this.updateSelectedLocation}
                ></LocationList>
              )}
            {this.state.step === 3 &&
              (this.state.isNlpFreeIntro || this.state.isLocationPage) &&
              !this.state.isShopPage && (
                <LpClassList
                  updateScreen={this.updateScreen}
                  updateClassList={this.updateClassList}
                  classLists={this.classList}
                  businessID={this.state.businessID}
                  locationData={this.state.locationData}
                  clientData={this.state.clientData}
                  isMember={this.state.isMember}
                  geoLocationPermission={this.state.geoLocationPermission}
                  updateGeoLocationPermission={this.updateGeoLocationPermission}
                  isProspect={this.state.isProspect}
                  updateClientData={this.updateClientData}
                  updateClassSession={this.updateClassSession}
                  isNlpFreeIntro={this.state.isNlpFreeIntro}
                  isLocationPage={this.state.isLocationPage}
                  wlGuestInfo={this.state.wlGuestInfo}
                />
              )}

            {this.state.step === 3 &&
              !this.state.isNlpFreeIntro &&
              !this.state.isLocationPage &&
              !this.state.isShopPage && (
                <ClassList
                  updateScreen={this.updateScreen}
                  updateClassList={this.updateClassList}
                  classLists={this.classList}
                  businessID={this.state.businessID}
                  locationData={this.state.locationData}
                  clientData={this.state.clientData}
                  isMember={this.state.isMember}
                  isProspect={this.state.isProspect}
                  updateClientData={this.updateClientData}
                  updateClassSession={this.updateClassSession}
                  isNlpFreeIntro={this.state.isNlpFreeIntro}
                  isLocationPage={this.state.isLocationPage}
                  wlGuestInfo={this.state.wlGuestInfo}
                ></ClassList>
              )}
            {this.state.isShopPage && this.state.step === 3 && (
              <WlShop
                wlGuestInfo={this.state.wlGuestInfo}
                wpLocationData={this.state.wpLocationData}
                clientData={this.state.clientData}
                updateScreen={this.updateScreen}
                locationData={this.state.locationData}
              />
            )}
            {this.state.step === 4 && (
              <Booking
                updateScreen={this.updateScreen}
                locationData={this.state.locationData}
                businessID={this.state.businessID}
                clientData={this.state.clientData}
                classSession={this.state.classSession}
                isMember={this.state.isMember}
                isProspect={this.state.isProspect}
                wpLocationData={this.state.wpLocationData}
                selectedLocation={this.state.selectedLocation}
                isNlpFreeIntro={this.state.isNlpFreeIntro}
                isLocationPage={this.state.isLocationPage}
                purchaseOption={this.state.purchaseOption}
                wlGuestInfo={this.state.wlGuestInfo}
              ></Booking>
            )}
          </div>
        )}
        {this.state.bookingEngine === "goHighLevel" &&
          this.state.wpLocationData && (
            <>
              <GoHighLevelBooking
                wpLocationData={this.state.wpLocationData}
                locationData={this.state.locationData}
                clientData={this.state.clientData}
                updateClientData={this.updateClientData}
                isNlpFreeIntro={this.state.isNlpFreeIntro}
                updateScreen={this.updateScreen}
              />
              {this.state.locationList.length !== 0 &&
                this.state.step === 1 &&
                this.state.isNlpFreeIntro && (
                  <LpLocationList
                    updateScreen={this.updateScreen}
                    businessID={this.state.businessID}
                    updateBusinessID={this.updateBusinessID}
                    locationList={this.state.locationList}
                    clientData={this.state.clientData}
                    isNlpFreeIntro={this.state.isNlpFreeIntro}
                    geoLocationPermission={this.state.geoLocationPermission}
                    updateGeoLocationPermission={
                      this.updateGeoLocationPermission
                    }
                    updateIsMember={this.updateIsMember}
                    updateIsProspect={this.updateIsProspect}
                    updateClientData={this.updateClientData}
                    updateLocationData={this.updateLocationData}
                    updateSelectedLocation={this.updateSelectedLocation}
                  />
                )}
            </>
          )}
      </div>
    );
  }
}
