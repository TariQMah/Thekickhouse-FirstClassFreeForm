import React, { Component } from "react";
import Axios from "axios";
import { apiURL } from "../../config";
import CreditCardForm from "./creditCardForm";
import CreditCardList from "./creditCardList";
export default class CreditCard extends Component {
  state = {
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
    isLoading: true,
    visibleCreditCardForm: false,
    k_pay_bank: "",
    ccList: [],
  };
  async askhGetCreditCards() {
    this.setState({ isLoading: true });
    this.setState({ ccList: [] });
    const response = await Axios.get(apiURL, {
      params: {
        askhGetCreditCardList: true,
        uid: this.props.clientData.uid,
        k_business: this.props.locationData.k_business,
        k_location: this.props.locationData.k_location,
        timestamp: Date.now(),
      },
    });
    const data = await response.data;
    //console.log(data);
    if (data.status == "ok") {
      this.setState({ ccList: data.a_bank_card });
      this.setState({ isLoading: false });
      return data.status;
    } else {
      this.setState({ isLoading: false });
      return false;
    }
  }
  hideCreditCardForm = () => {
    this.setState({ visibleCreditCardForm: false });
    this.setState({ k_pay_bank: "" });

    this.askhGetCreditCards();
  };
  visibleCreditCardForm = () => {
    //console.log("visible form");
    this.setState((prevState) => ({
      visibleCreditCardForm: !prevState.visibleCreditCardForm,
    }));
    // this.setState({ visibleCreditCardForm: true });
    this.setState({ k_pay_bank: "" });
  };
  componentDidMount() {
    this.askhGetCreditCards().then((result) => {
      this.setState({ isLoading: false });
    });
  }
  updateCreditCard = (cc) => {
    this.setState({ k_pay_bank: cc.k_pay_bank });
    this.props.updateCreditCard(cc.k_pay_bank);
    this.setState({ visibleCreditCardForm: false });
  };
  render() {
    return (
      <div className="row creditCardScreen">
        <div className="col-12">
          <div className="section-headline h3">Secure Payment with:</div>
          <div className="subInstructions"></div>

          {this.state.isLoading && <div className="appLoader"></div>}
          {!this.state.isLoading && (
            <CreditCardList
              addNewCard={this.addNewCard}
              ccList={this.state.ccList}
              updateCreditCard={this.updateCreditCard}
              k_pay_bank={this.state.k_pay_bank}
              visibleCreditCardForm={this.visibleCreditCardForm}
            ></CreditCardList>
          )}
          {this.state.visibleCreditCardForm && (
            <CreditCardForm
              clientData={this.props.clientData}
              locationData={this.props.locationData}
              k_pay_owner={this.props.k_pay_owner}
              hideCreditCardForm={this.hideCreditCardForm}
              visibleCreditCardForm={this.visibleCreditCardForm}
            ></CreditCardForm>
          )}
        </div>
      </div>
    );
  }
}
