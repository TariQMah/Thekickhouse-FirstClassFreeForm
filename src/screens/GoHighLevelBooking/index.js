import React, { Component } from "react";
import GHLAppointmentCalendar from "./AppointmentCalendar";
import GHLProspectRegistration from "./ProspectRegistration";
import GHLThankYou from "./ThankYou";
import axios from "axios";
import { ghlAPIKey, ghlAPIURL } from "../../config";
import moment from "moment-timezone";
import ReviewBooking from "./ReviewBooking";
export default class GoHighLevelBooking extends Component {
  state = {
    currentStep: 1,
    loading: false,
    slots: {},
    startDate: moment().valueOf(),
    endDate: moment().endOf("month").valueOf(),
    selectedSlot: "",
    selectedTimezone: "",
    timeZoneList: [],
    loading: false,
    loadingMsg: "Loading...",
  };

  updateStep = (step) => {
    this.setState({ currentStep: step });
    if (step === 1) {
      this.props.updateScreen(1);
    }
  };
  updateTimeZone = (timezone) => {
    this.setState({ selectedTimezone: timezone });
    this.getAppointmentSlots(
      this.state.startDate,
      this.state.endDate,
      timezone.value
    );
  };
  componentDidMount() {
    let timez = moment().utcOffset(0, false).format();
    //timez = timez.tz();
    console.log("timezoen", moment.tz.zonesForCountry("US"));
    const selectOptions = moment.tz.zonesForCountry("US").map((n) => {
      let rObj = {};
      rObj["value"] = n;
      rObj["label"] = n;
      return rObj;
    });
    console.log("tx", selectOptions);
    this.setState({ timeZoneList: selectOptions });
    const currentTz = moment.tz.guess();
    const selectedTz = selectOptions.filter(({ label }) => label === currentTz);
    if (selectedTz) {
      this.setState({ selectedTimezone: selectedTz[0] });
    } else {
      this.setState({
        selectedTimezone: {
          value: "America/Los_Angeles",
          label: "America/Los_Angeles",
        },
      });
    }

    this.getTimezone();
    this.getAppointmentSlots(this.state.startDate, this.state.endDate);
  }
  getTimezone = () => {
    var config = {
      method: "get",
      url: `${ghlAPIURL}/timezones/`,
      headers: {
        Authorization: `Bearer ${this.props.wpLocationData.as_franchiseHlApiKey}`,
      },
    };
    axios(config).then((response) => {
      console.log("Timzezone Response", response.data);
    });
  };
  getAppointmentSlots = (
    startDate,
    endDate,
    selectedTimezone = moment.tz.guess()
  ) => {
    this.setState({
      loading: true,
      loadingMsg: "Finding Open Available Slots...",
    });
    //selectedTimezone = moment.tz.guess();
    const calendarId = this.props.wpLocationData.as_franchiseHlCalenderId;

    var config = {
      method: "get",
      url: `${ghlAPIURL}/appointments/slots?calendarId=${calendarId}&startDate=${startDate}&endDate=${endDate}&timezone=${selectedTimezone}`,
      headers: {
        Authorization: `Bearer ${this.props.wpLocationData.as_franchiseHlApiKey}`,
      },
    };
    console.log("config", config);
    axios(config)
      .then((response) => {
        console.log(response);
        this.setState({ slots: response.data });
        if (response.data) {
          this.setState({
            loading: false,
          });
          // this.updateStep(2);
        }
        this.setState({
          loading: false,
        });
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "+1" + match[1] + match[2] + match[3];
    }
    return null;
  };
  bookAppointmentOnHL = (slot) => {
    this.setState({ loading: true, loadingMsg: "Booking Your Appointment..." });
    var data = JSON.stringify({
      calendarId: this.props.wpLocationData.as_franchiseHlCalenderId,
      selectedTimezone: this.state.selectedTimezone.label,
      selectedSlot: slot,
      email: this.props.clientData.email,
      phone: this.formatPhoneNumber(this.props.clientData.phone),
      calendarNotes: "Booking Request : First Class - Kickstart",
    });
    console.log("Slot Time Zone", moment(slot).tz());
    var config = {
      method: "post",
      url: `${ghlAPIURL}/appointments/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.wpLocationData.as_franchiseHlApiKey}`,
      },
      data: data,
    };
    console.log("config Booking", config);
    axios(config)
      .then((response) => {
        console.log(response);
        console.log(JSON.stringify(response.data));
        this.setState({
          loading: false,
          loadingMsg: "Appointment Booked",
        });
        if (response.data.id) {
          this.updateStep(4);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  updateSelectedSlot = (slot) => {
    this.setState({ selectedSlot: slot });
    //console.log("offset", moment(slot).getTimezoneOffset());
    console.log("Slot Time Zone", moment(slot).tz());
  };
  render() {
    return (
      <div className="row goHighLevelBooking-component askhIntroClassAPP">
        {this.state.loading && (
          <div className="col-12 loading-component">
            <div className="loading-wrapper">{this.state.loadingMsg}</div>
          </div>
        )}
        {this.state.currentStep === 1 && (
          <div className="col-12">
            <GHLProspectRegistration
              wpLocationData={this.props.wpLocationData}
              clientData={this.props.clientData}
              updateClientData={this.props.updateClientData}
              updateStep={this.updateStep}
              isNlpFreeIntro={this.props.isNlpFreeIntro}
              locationData={this.props.locationData}
              updateScreen={this.props.updateScreen}
            />
          </div>
        )}
        {this.state.currentStep === 2 && (
          <div className="col-12">
            <GHLAppointmentCalendar
              wpLocationData={this.props.wpLocationData}
              clientData={this.props.clientData}
              updateTimeZone={this.updateTimeZone}
              timeZoneList={this.state.timeZoneList}
              selectedTimezone={this.state.selectedTimezone}
              updateStep={this.updateStep}
              slots={this.state.slots}
              getAppointmentSlots={this.getAppointmentSlots}
              updateSelectedSlot={this.updateSelectedSlot}
            />
          </div>
        )}
        {this.state.currentStep === 3 && (
          <div className="col-12">
            <ReviewBooking
              wpLocationData={this.props.wpLocationData}
              clientData={this.props.clientData}
              updateStep={this.updateStep}
              bookAppointmentOnHL={this.bookAppointmentOnHL}
              selectedSlot={this.state.selectedSlot}
              selectedTimezone={this.state.selectedTimezone}
            />
          </div>
        )}
        {this.state.currentStep === 4 && (
          <div className="col-12">
            <GHLThankYou
              clientData={this.props.clientData}
              selectedSlot={this.state.selectedSlot}
              selectedTimezone={this.state.selectedTimezone}
              wpLocationData={this.props.wpLocationData}
              updateStep={this.updateStep}
            />
          </div>
        )}
      </div>
    );
  }
}
