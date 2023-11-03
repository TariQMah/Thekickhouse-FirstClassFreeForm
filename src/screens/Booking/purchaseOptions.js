import React, { Component } from "react";
import axios from "axios";
import { apiURL } from "../../config";
export default class PurchaseOptions extends Component {
  state = {
    purchaseOptions: [],
    isLoading: true,
    error: "",
  };
  async componentDidMount() {
    const response = await axios.get(apiURL, {
      params: {
        askhGetPurchaseOptions: true,
        //k_business: this.props.locationData.k_business,
        k_business: this.props.businessID,
        dt: this.props.classSession.dt_date,
        k_class_period: this.props.classSession.k_class_period,
        uid: this.props.clientData.uid,
        timestamp: Date.now(),
      },
    });
    const data = await response.data;
    if (data.status === "ok") {
      this.setState({ purchaseOptions: data.a_purchase });
    } else {
      this.setState({ error: "Something went wrong! Please try again later." });
    }
    this.setState({ isLoading: false });
    // console.log(data);
  }
  updatePurchaseOption = (option) => {
    this.props.updatePurchaseOption(option);
    //this.props.updateBookingStep(3);
  };
  render() {
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        );
    }
    const firstClassOffersValue =
      this.props.wpLocationData.as_franchiseFirstClassOffers[0].value;
    let purchaseOptionLabel = this.props.purchaseOption.toLowerCase();

    if (!this.props.classSession.s_title.toLowerCase().includes("kickstart")) {
      purchaseOptionLabel = "drop in";
    }

    let newMemberError = [];
    if (
      this.props.wlGuestInfo &&
      !this.props.wlGuestInfo.is_customer_new &&
      this.props.classSession.s_title.toLowerCase().includes("kickstart")
    ) {
      newMemberError.push(
        <div className="alert alert-warning" role="alert">
          Sorry you're not a first time customer, so we can't give you the
          promotional rate
        </div>
      );
    }
    return (
      <div className="purchaseOptions col-12 mt-3 mt-sm-0">
        <div className="row">
          <div className="col-12">
            <div className="section-heading h3">
              Select from Available Purchase Options:
            </div>
            {errorMessage}
            {newMemberError}
            <p className="small">
              To book this class, you must select an option below and proceed to
              purchase.
            </p>
            {this.state.isLoading && <div className="appLoader"></div>}
            {Object.keys(this.state.purchaseOptions).map((key) => {
              if (
                this.state.purchaseOptions[key].s_class == "class-limit" &&
                this.state.purchaseOptions[key].s_title
                  .toLowerCase()
                  .includes(purchaseOptionLabel)
              ) {
                return (
                  <button
                    className={
                      this.props.selectedPurchaseOption.k_id ===
                      this.state.purchaseOptions[key].k_id
                        ? "btn btn-block btn-dark p-option"
                        : "btn btn-block btn-outline-dark p-option"
                    }
                    onClick={() =>
                      this.updatePurchaseOption(this.state.purchaseOptions[key])
                    }
                  >
                    <div className="d-none d-sm-block">
                      {" "}
                      {"$"} {this.state.purchaseOptions[key].f_price}
                      {" | "}
                      {this.state.purchaseOptions[key].s_title}
                      {" | "}
                      {this.state.purchaseOptions[key].s_duration}
                      {" | "}
                      {this.state.purchaseOptions[key].i_limit}{" "}
                      {this.state.purchaseOptions[key].sid_program_category}
                    </div>
                    <div className="d-flex d-sm-none mobile-purchase-option">
                      <div className="col-6">
                        {" "}
                        <span>
                          {"$"} {this.state.purchaseOptions[key].f_price}
                        </span>
                        <br></br>
                        <span> {this.state.purchaseOptions[key].s_title}</span>
                      </div>
                      <div className="col-6">
                        {" "}
                        {this.state.purchaseOptions[key].s_duration}
                        <br></br>
                        {this.state.purchaseOptions[key].i_limit} <br></br>
                        {this.state.purchaseOptions[key].sid_program_category}
                      </div>
                    </div>
                  </button>
                );
              }
            })}
          </div>
          <div className="col-12 navigationButtons">
            <div className="row">
              <div className="col-6">
                <button
                  className="btn btn-outline-dark back-step-btn btn-block"
                  onClick={() => this.props.updateScreen(3)}
                >
                  Back A Step
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-dark next-btn btn-block"
                  onClick={() => this.props.updateBookingStep(2)}
                  disabled={this.props.selectedPurchaseOption ? false : true}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
