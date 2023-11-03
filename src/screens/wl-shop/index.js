import React, { Component } from "react";
import ProductList from "./productList";
import Payment from "./payment";
import ThankYou from "./thankYou";
export default class WlShop extends Component {
  state = {
    error: "",
    bookingSuccess: false,
    isLoading: false,
    bookingStep: 1,
    selectedPurchaseOption: "",
  };

  componentDidMount() {}
  updateBookingStep = (step) => {
    this.setState({ bookingStep: step });
  };
  updatePurchaseOption = (option) => {
    this.setState({ selectedPurchaseOption: option });
  };
  updateBookingSuccess = (bool) => {
    this.setState({ bookingSuccess: bool });
  };
  render() {
    let memberError = [];
    {
      this.props.clientData.is_member === "1" &&
        memberError.push(
          <div className="col-12">
            {" "}
            <div className="alert alert-warning" role="alert">
              Sorry you can't avail this offer as you're already a valuable
              member of this kickboxing studio.
            </div>
          </div>
        );
    }
    return (
      <div className="row wlShop">
        {memberError}
        {this.state.bookingStep === 1 &&
          this.props.clientData.is_member !== "1" && (
            <ProductList
              wpLocationData={this.props.wpLocationData}
              updatePurchaseOption={this.updatePurchaseOption}
              selectedPurchaseOption={this.state.selectedPurchaseOption}
              updateScreen={this.props.updateScreen}
              updateBookingStep={this.updateBookingStep}
            />
          )}
        {!this.state.bookingSuccess &&
          this.props.clientData.is_member !== "1" &&
          this.state.bookingStep === 2 && (
            <Payment
              updateBookingStep={this.updateBookingStep}
              updateScreen={this.props.updateScreen}
              locationData={this.props.locationData}
              wpLocationData={this.props.wpLocationData}
              clientData={this.props.clientData}
              selectedPurchaseOption={this.state.selectedPurchaseOption}
              updateBookingSuccess={this.updateBookingSuccess}
            ></Payment>
          )}
        {this.state.bookingSuccess && (
          <ThankYou
            clientData={this.props.clientData}
            locationData={this.props.locationData}
            wpLocationData={this.props.wpLocationData}
            selectedPurchaseOption={this.state.selectedPurchaseOption}
            updateScreen={this.props.updateScreen}
            selectedLocation={this.props.locationData}
          ></ThankYou>
        )}
        {this.props.clientData.is_member === "1" && (
          <div className="col-12">
            <button
              className="btn btn-outline-dark back-step-btn btn-block"
              onClick={() => this.props.updateScreen(1)}
            >
              Back A Step
            </button>
          </div>
        )}
      </div>
    );
  }
}
