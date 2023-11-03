import React, { Component } from "react";
import moment from "moment-timezone";
export default class GHLThankYou extends Component {
  componentDidMount() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "askhScheduled",
      bookingLocation: "firstClassbooking",
      bookingEngine: "goHighLevel",
    });
  }
  render() {
    return (
      <div className="row ghlThankYou-component text-center">
        <div className="col-12 thankYouScreen text-center">
          <p>You have successfully scheduled your appointmet:</p>

          <div className="classTitle">
            <i class="fas fa-clock"></i>
            {moment
              .tz(this.props.selectedSlot, this.props.selectedTimezone.value)
              .format("LT")}
          </div>
          <div className="classDate">
            <i class="fas fa-calendar-alt"></i>
            {moment(this.props.selectedSlot).format("dddd, MMMM D, YYYY")}
          </div>
          <div className="classLocation">
            <i class="fas fa-map-marker-alt"></i>
            Kickhouse - {this.props.wpLocationData.as_franchiseName}
          </div>
          <div className="classTimezone">
            <i className="fas fa-globe"></i>Timezone -
            <strong>{this.props.selectedTimezone.label}</strong>
          </div>
          <div className="">You should receive a confirmation email soon!</div>
        </div>
      </div>
    );
  }
}
