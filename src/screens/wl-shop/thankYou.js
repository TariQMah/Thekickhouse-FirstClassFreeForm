import React, { Component } from "react";
import moment from "moment-timezone";
import axios from "axios";
export default class ThankYou extends Component {
  componentDidMount() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "askhProductPurchase",
      bookingLocation: "shopLandingPage",
    });
    /* if (this.props.wpLocationData.as_franchiseHlCalenderId)
      this.pushToHlBookingCalendar(); */
  }
  linkToMicrosite = () => {
    let locationSlug = this.props.selectedLocation.name
      .replace(/\s/g, "-")
      .toLowerCase();
    //console.log(locationSlug);
    window.location.href = "/" + locationSlug + "/class-schedule/";
  };
  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + "-" + match[2] + "-" + match[3];
    }
    return null;
  };
  pushToHlBookingCalendar = () => {
    var data = JSON.stringify({
      calendarId: this.props.wpLocationData.as_franchiseHlCalenderId,
      selectedTimezone: "America/Los_Angeles",
      selectedSlot: moment(this.props.classSession.dtl_date)
        .tz("America/Los_Angeles")
        .format(),
      email: this.props.clientData.email,
      phone: this.formatPhoneNumber(this.props.clientData.phone),
      calendarNotes: "Booking Request : First Class - Kickstart",
    });

    var config = {
      method: "post",
      url: "https://rest.gohighlevel.com/v1/appointments/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.wpLocationData.as_franchiseHlApiKey}`,
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
  render() {
    return (
      <div className="col-12 thankYouScreen text-center">
        <p>You have successfully purchased an item as below:</p>
        {/* <div className="classTitle">{this.props.classSession.s_title}</div> */}
        <div className="classTitle">
          {this.props.selectedPurchaseOption.as_franchiseProductName}
        </div>
        <div className="classDate">
          {/*  <i class="fas fa-calendar-alt"></i>
          {moment(this.props.classSession.dtl_date).format(
            "dddd, MMMM D, YYYY"
          )} */}
        </div>
        <div className="classLocation">
          <i class="fas fa-map-marker-alt"></i>
          {this.props.locationData.s_title}
        </div>
        <div className="">You should receive a confirmation email soon!</div>
        {/* <div className="">
          <button
            className="btn btn-dark book-again"
            onClick={() => this.linkToMicrosite()}
          >
            See Complete Class Schedule
          </button>
        </div> */}
      </div>
    );
  }
}
