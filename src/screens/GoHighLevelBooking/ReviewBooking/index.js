import React, { Component } from "react";
import moment from "moment-timezone";
export default class ReviewBooking extends Component {
  render() {
    return (
      <div className="row reviewBooking">
        <div className="col-12">
          <div className="section-heading h3">Booking Summary</div>
          <div className="classTitle">KickStart</div>
          <div className="classTiming">
            <i className="fas fa-clock"></i>
            {moment
              .tz(this.props.selectedSlot, this.props.selectedTimezone.value)
              .format("LT")}
          </div>
          <div className="classDate">
            <i className="fas fa-calendar-alt"></i>
            {moment
              .tz(this.props.selectedSlot, this.props.selectedTimezone.value)
              .format("llll")}
          </div>
          <div className="classLocation">
            <i className="fas fa-map-marker-alt"></i>KickHouse -{" "}
            {this.props.wpLocationData.as_franchiseName}
          </div>
          <div className="classTimezone">
            <i className="fas fa-globe"></i>Timezone -
            <strong>{this.props.selectedTimezone.label}</strong>
          </div>
        </div>
        <div className="col-12 text-center">
          <div className="row navigationButtons">
            <div className="col-12">
              <button
                className="btn btn-dark btn-block"
                onClick={() => {
                  this.props.bookAppointmentOnHL(this.props.selectedSlot);
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
