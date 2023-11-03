import Axios from "axios";
import React, { Component } from "react";
import "react-credit-cards/es/styles-compiled.css";
import { apiURL } from "../../config";

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData,
} from "./utils";
export default class CreditCardForm extends Component {
  state = {
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formData: null,
    isLoading: false,
    error: "",
  };
  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
    }

    this.setState({ [target.name]: target.value });
  };

  async askhAddCreditCard(formData) {
    const response = await Axios.get(apiURL, {
      params: {
        askhAddCreditCard: true,
        ccObject: formData,
        k_business: this.props.locationData.k_business,
        k_location: this.props.locationData.k_location,
        k_pay_owner: this.props.k_pay_owner,
      },
    });
    const data = await response.data;
    return data;
  }
  handleSubmit = (e) => {
    this.setState({ error: "" });
    this.setState({ isLoading: true });
    e.preventDefault();
    const { issuer } = this.state;
    const formData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    this.setState({ ccData: formData });
    this.askhAddCreditCard(formData).then((result) => {
      //console.log("creditcard success: ", result);
      if (result.status === "ok") {
        this.props.hideCreditCardForm();
        this.setState({ isLoading: false });
      } else {
        this.setState({ error: result.message });
        this.setState({ isLoading: false });
      }
      //this.form.reset();
    });
  };
  render() {
    let buttonLabel = "Add";
    if (this.state.isLoading) {
      buttonLabel = "Adding...";
    }
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }
    const { name, number, expiry, cvc, focused, issuer, formData } = this.state;
    return (
      <div className="row creditCardForm">
        <div className="col-12">
          {errorMessage}
          <form ref={(c) => (this.form = c)} onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="tel"
                name="number"
                className="form-control"
                placeholder="Card Number"
                pattern="[\d| ]{16,22}"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name on your card"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <input
                  type="tel"
                  name="expiry"
                  className="form-control"
                  placeholder="MM/YY"
                  pattern="\d\d/\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div className="col-6">
                <input
                  type="tel"
                  name="cvc"
                  className="form-control"
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
            </div>
            <input type="hidden" name="issuer" value={issuer} />
            <div className="form-actions">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.isLoading ? true : false}
              >
                {buttonLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
