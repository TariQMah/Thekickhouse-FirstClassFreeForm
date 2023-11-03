import Axios from "axios";
import React, { Component } from "react";
import { apiURL } from "../../config";
import PurchaseOptions from "./purchaseOptions";
import ThankYou from "./thankYou";
import Payment from "./payment";

export default class Booking extends Component {
  state = {
    error: "",
    bookingSuccess: false,
    isLoading: false,
    bookingStep: 1,
    selectedPurchaseOption: "",
  };
  updateBookingStep = (step) => {
    this.setState({ bookingStep: step });
  };
  updatePurchaseOption = (option) => {
    this.setState({ selectedPurchaseOption: option });
  };
  updateBookingSuccess = (bool) => {
    this.setState({ bookingSuccess: bool });
  };
  componentDidMount() {}
  async completeTransaction() {
    this.setState({ error: "" });
    this.setState({ isLoading: true });
    const a_data = {
      dt_date_gmt: this.props.classSession.dt_date,
      k_class_period: this.props.classSession.k_class_period,
      uid: this.props.clientData.uid,
    };
    const response = await Axios.get(apiURL, {
      params: {
        askhBookIntroClass: true,
        a_data: a_data,
      },
    });
    const data = await response.data;
    //console.log(data);
    if (data.status === "ok") {
      this.setState({ isLoading: false });
      this.setState({ bookingSuccess: true });
    } else {
      this.setState({ bookingSuccess: false });
      this.setState({ isLoading: false });
      this.setState({ error: data.message });
    }
  }
  render() {
    let buttonLabel = "confirm";
    if (this.state.isLoading) {
      buttonLabel = "Finalizing Booking...";
    }
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }
    return (
      <div className="row bookingScreen ">
        {errorMessage}
        {!this.state.bookingSuccess &&
          this.props.isMember &&
          this.state.bookingStep === 1 && (
            <PurchaseOptions
              locationData={this.props.locationData}
              businessID={this.props.businessID}
              classSession={this.props.classSession}
              clientData={this.props.clientData}
              updatePurchaseOption={this.updatePurchaseOption}
              selectedPurchaseOption={this.state.selectedPurchaseOption}
              updateBookingStep={this.updateBookingStep}
              updateScreen={this.props.updateScreen}
              wpLocationData={this.props.wpLocationData}
              purchaseOption={this.props.purchaseOption}
              wlGuestInfo={this.props.wlGuestInfo}
            ></PurchaseOptions>
          )}
        {!this.state.bookingSuccess &&
          this.state.bookingStep === 2 &&
          this.props.isMember && (
            <Payment
              updateBookingStep={this.updateBookingStep}
              updateScreen={this.props.updateScreen}
              locationData={this.props.locationData}
              classSession={this.props.classSession}
              clientData={this.props.clientData}
              selectedPurchaseOption={this.state.selectedPurchaseOption}
              updateBookingSuccess={this.updateBookingSuccess}
            ></Payment>
          )}
        {!this.state.bookingSuccess && this.props.isProspect && (
          <div className="col-12">
            <div>
              Please click on the CONFIRM button below to book your free class.
            </div>

            <div className="row navigationButtons">
              <div className="col-6">
                <button
                  className="btn btn-outline-dark btn-block back-btn"
                  onClick={() => {
                    this.props.updateScreen(3);
                  }}
                >
                  Back
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-dark btn-block next-btn"
                  onClick={() => {
                    this.completeTransaction();
                  }}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          </div>
        )}
        {this.state.bookingSuccess && (
          <ThankYou
            clientData={this.props.clientData}
            locationData={this.props.locationData}
            wpLocationData={this.props.wpLocationData}
            classSession={this.props.classSession}
            updateScreen={this.props.updateScreen}
            selectedLocation={this.props.selectedLocation}
          ></ThankYou>
        )}
      </div>
    );
  }
}
