import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { apiURL, siteURL } from "../../../config";
import { ghlAPIKey, ghlAPIURL } from "../../../config";
export default class GHLProspectRegistration extends Component {
  state = {
    isLoading: false,
    uid: "",
    prospectData: "",
  };
  validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  validateFirstName(value) {
    let error;
    if (!value) {
      error = "Required";
    }
    return error;
  }
  validateLastName(value) {
    let error;
    if (!value) {
      error = "Required";
    }
    return error;
  }
  validatePhone(value) {
    let error;
    if (!value) {
      error = "Required";
    }
    return error;
  }
  // Error Component
  errorMessage = (error) => {
    return <div className="form-errors">{error}</div>;
  };
  componentDidMount() {
    console.log('this.props: ', this.props);

    //console.log("wpLocationData", this.props.wpLocationData);
  }
  async searchClient(email, k_business) {
    const firstClassOffers =
      this.props.wpLocationData.as_franchiseFirstClassOffers;
    const response = await axios.get(apiURL, {
      params: {
        askhSearchClient: true,
        text_email: email,
        k_business: k_business,
        timestamp: Date.now(),
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
      this.props.updateWLGuestInfo(userData);
      if (
        !firstClassOffers[0].value.includes("free") &&
        userData.status === "ok" &&
        userData.is_customer_new
      ) {
        this.props.updatePurchaseOption(firstClassOffers[0].value);
      }
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
        timestamp: Date.now(),
      },
    });
    const data = await response.data;
    return data;
  }
  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "+1" + match[1] + match[2] + match[3];
    }
    return null;
  };
  goHighLevelContactSubmit = (values) => {
    this.setState({ isLoading: true });
    var data = JSON.stringify({
      email: values.email,
      phone: `${this.formatPhoneNumber(values.phone)}`,
      firstName: values.firstName,
      lastName: values.lastName,
      country: "US",
      name: values.firstName + " " + values.lastName,
      source: "First Class Free Landing Page",
    });

    var config = {
      method: "post",
      url: `${ghlAPIURL}/contacts/`,
      headers: {
        Authorization: `Bearer ${this.props.wpLocationData.as_franchiseHlApiKey}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        this.props.updateStep(2);
        this.props.updateScreen(2);
        this.setState({ isLoading: false });
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "askhNewProspect",
          formLocation: "introClass",
          clientData: values,
        });
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  gravityFormSubmission = (clientData) => {
    console.log('clientData: ', clientData);
    var data = JSON.stringify({
      input_1: clientData.firstName,
      input_2: clientData.lastName,
      input_3: clientData.email,
      input_4: clientData.phone,
      input_5: clientData.location,
      input_7: window.location.href,
      'input_8.1': clientData.isPromotional ? "true" : null,
    });

    var config = {
      method: "post",
      url: "https://thekickhouse.com/wp-json/gf/v2/forms/9/submissions",
      headers: {
        Authorization:
          "Basic dmlqYXlAYW5nZWxzbWl0aC5uZXQ6eGF1MCBuM0lkIDRRbnYgMjF2aCAxWDJPIFVBUXM=",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  handleSubmit = (values) => {
    //this.setState({ isLoading: true });
    this.setState({ prospectData: values });
    //this.setState({ isLoading: false });

    this.setState({ error: "" });
    /* console.log(
      "wpLocationData",
      this.props.wpLocationData.as_franchiseFirstClassOffers[0].value
    ); */
    const firstClassOffers =
      this.props.wpLocationData.as_franchiseFirstClassOffers;
    this.props.updateClientData(values);
    let zapierData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      location: this.props.wpLocationData.as_franchiseName,
    };
    this.goHighLevelContactSubmit(zapierData);
    this.gravityFormSubmission(zapierData);

    /* if (this.props.isNlpFreeIntro || this.props.isLocationPage) {
      this.searchClient(values.email, this.props.businessID).then((result) => {
        if (result) {
          this.setState({ isLoading: false });
          this.props.updateIsMember(true);
          this.setState({ isReady: true });

          this.props.updateScreen(3);
        } else {
          this.registerClient(values, this.props.businessID).then((result) => {
            this.setState({ isLoading: false });
            if (result.status === "ok") {
              let clientData = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
                uid: result.uid,
                location: this.props.selectedLocation.name
                  ? this.props.selectedLocation.name
                  : this.props.wpLocationData.as_franchiseName,
                is_customer_new: true,
              };
              //this.gravityFormSubmission(clientData);
              this.props.updateWLGuestInfo(clientData);
              axios
                .get(apiURL, {
                  params: {
                    askhSendProspectEmail: true,
                    data: clientData,
                    pageLocation: window.location.href,
                    franchiseEmail: this.props.wpLocationData.as_franchiseEmail,
                    franchiseGmEmail:
                      this.props.wpLocationData.as_franchiseGMEmail,
                  },
                })
                .then((response) => console.log("Email", response));
              //let clientData = values;
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: "askhNewProspect",
                formLocation: "introClass",
                clientData: clientData,
              });
              if (
              
                this.props.wpLocationData.as_franchisePostLeadsToHl
              ) {
                this.goHighLevelContactSubmit(values);
              }

              this.props.updateClientData(clientData);
              if (firstClassOffers[0].value.includes("free")) {
                this.props.updateIsProspect(true);
              } else {
                this.props.updateIsMember(true);
                this.props.updatePurchaseOption(firstClassOffers[0].value);
              }

              this.setState({ isReady: true });
              this.props.updateScreen(3);
            } else {
              this.setState({ error: result.message });
            }
          });
        }
      });
    } else {
      this.props.updateScreen(2);
    } */
  };
  render() {
    let clientData = this.props.clientData;
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger" role="alert">
            {this.state.error}
          </div>
        );
    }
    let buttonLabel = "Claim your Free Class!";
    return (
      <div className="row ghlProspectRegistration-component registrationForm">
        {errorMessage}
        <div className="col-12">
          <div className="sectionHeading h3 d-none">Fill in your details:</div>
          <Formik
            initialValues={{
              firstName: clientData.firstName || "",
              lastName: clientData.lastName || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
            }}
            onSubmit={(values) => {
              // same shape as initial values
              //console.log(values);
              this.handleSubmit(values);
              //this.props.updateBookingStep(2);
            }}
          >
            {({ errors, touched, isValidating }) => (
              <Form>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <Field
                      name="firstName"
                      validate={this.validateFirstName}
                      className="form-control"
                      placeholder="First Name"
                    />
                    {errors.firstName &&
                      touched.firstName &&
                      this.errorMessage(errors.firstName)}
                  </div>
                  <div className="form-group col-md-6">
                    <Field
                      name="lastName"
                      validate={this.validateLastName}
                      className="form-control"
                      placeholder="Last Name"
                    />
                    {errors.lastName &&
                      touched.lastName &&
                      this.errorMessage(errors.lastName)}
                  </div>
                </div>
                <div className="form-group">
                  <Field
                    name="email"
                    validate={this.validateEmail}
                    className="form-control"
                    type="email"
                    placeholder="Email"
                  />
                  {errors.email &&
                    touched.email &&
                    this.errorMessage(errors.email)}
                </div>
                <div className="form-group">
                  <Field
                    name="phone"
                    validate={this.validatePhone}
                    className="form-control"
                    placeholder="Phone"
                  />
                  {errors.phone &&
                    touched.phone &&
                    this.errorMessage(errors.phone)}
                </div>
                <div className="form-group">
                  <label>
                    <Field
                      type="checkbox"
                      name="isPromotional"
                      style={{ marginRight: "10px" }}
                    />
                    By checking this box, you consent to receiving automated/promotional messages from us. You can unsubscribe at any time.:

                  </label>

                </div>
                {this.props.isNlpFreeIntro && (
                  <div className="form-group">
                    <div className="nearestLocation">
                      Your Closest Location:
                      <br></br>
                      {/*  {!this.props.geoLocationPermission && (
                        <span>Select a location below</span>
                      )} */}
                      <span className="locationName">
                        {" "}
                        {this.props.locationData.text_city}
                      </span>
                      <span className="locationStreet">
                        {this.props.locationData.text_address_individual}
                      </span>
                      <span className="city">
                        {this.props.locationData.text_city}
                      </span>
                      <span className="zip">
                        {this.props.locationData.text_postal}
                      </span>
                      <span className="state">
                        {this.props.locationData.text_region}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={this.state.isLoading ? true : false}
                  className="btn btn-outline-dark claim-free-trial"
                >
                  {buttonLabel}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
