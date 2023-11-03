import React, { Component } from "react";
import CreditCard from "./creditCard";
import Axios from "axios";
import { apiURL } from "../../config";
export default class Payment extends Component {
  state = {
    error: "",
    k_pay_owner: "",
    isReadyForBooking: false,
    isLoading: false,
    k_pay_bank: "",
  };

  async askhGetPayOwner(uid) {
    const response = await Axios.get(apiURL, {
      params: {
        askhGetPayOwner: true,
        uid: uid,
      },
    });
    const data = await response.data;
    //console.log(data);
    return data.k_pay_owner;
  }
  componentDidMount() {
    this.askhGetPayOwner(this.props.clientData.uid).then((result) => {
      this.setState({ k_pay_owner: result });
    });
  }
  updateCreditCard = (cc) => {
    this.setState({ k_pay_bank: cc });
    this.setState({ isReadyForBooking: true });
  };
  async completeTransaction() {
    this.setState({ error: "" });
    this.setState({ isLoading: true });
    //console.log(this.props.classSession);
    const a_data = {
      //dt_date_gmt: this.props.classSession.dt_date,
      //k_class_period: this.props.classSession.k_class_period,
      k_pay_bank: this.state.k_pay_bank,
      uid: this.props.clientData.uid,
      f_amount: this.props.selectedPurchaseOption.as_franchiseProductPrice,
      k_id: this.props.selectedPurchaseOption.as_franchiseProductId,
      k_business: this.props.locationData.k_business,
      k_location: this.props.locationData.k_location,
      timestamp: Date.now(),
      //id_purchase_item: this.props.selectedPurchaseOption.id_purchase_item,
    };

    const response = await Axios.get(apiURL, {
      params: {
        askhPurchaseProduct: true,
        a_data: a_data,
      },
    });
    const data = await response.data;
    if (data.status !== "ok") {
      this.setState({ error: data.message });
      this.setState({ isLoading: false });
    } else {
      this.setState({ success: true });
      this.props.updateBookingSuccess(true);
      this.setState({ isLoading: false });
    }
    //console.log(response);
  }
  render() {
    let errorMessage = [];
    let buttonLabel = "Complete";
    if (this.state.isLoading) {
      buttonLabel = "Processing...";
    }
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }

    return (
      <div className="col-12 paymentScreen">
        {errorMessage}
        <CreditCard
          clientData={this.props.clientData}
          wpLocationData={this.props.wpLocationData}
          locationData={this.props.locationData}
          k_pay_owner={this.state.k_pay_owner}
          updateCreditCard={this.updateCreditCard}
          selectedPurchaseOption={this.props.selectedPurchaseOption}
        />
        <div className="row navigationButtons">
          <div className="col-6">
            <button
              className="btn btn-outline-dark back-step-btn btn-block"
              onClick={() => this.props.updateBookingStep(1)}
            >
              Back
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-outline-dark next-step-btn btn-block"
              onClick={() => this.props.updateScreen(3)}
              disabled={this.state.isReadyForBooking ? false : true}
              onClick={() => this.completeTransaction()}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
