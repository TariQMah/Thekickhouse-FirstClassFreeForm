import React, { Component } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import moment from "moment-timezone";
import Select from "react-select";
export default class GHLAppointmentCalendar extends Component {
  state = {
    selectedDay: null,
    ghlSelectedDay: null,
    availableDays: Object.keys(this.props.slots),
    disabledDays: [],
    selectedSlot: "",
    slots: this.props.slots,
    selectedMonth: "",
  };
  componentDidMount() {
    this.setState({
      selectedDay: new Date(moment(Object.keys(this.props.slots)[0])),
      availableDays: Object.keys(this.props.slots),
      ghlSelectedDay: Object.keys(this.props.slots)[0],
    });
    console.log("days in month", moment().date());
    this.updateDisabledDays(Object.keys(this.props.slots)[0]);

    //console.log(Object.keys(this.props.slots));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.slots !== this.props.slots) {
      console.log("Changd");
      this.setState({
        slots: this.props.slots,
        availableDays: Object.keys(this.props.slots),
        ghlSelectedDay: Object.keys(this.props.slots)[0],
        selectedDay: new Date(moment(Object.keys(this.props.slots)[0])),
      });
      const firstAvailableSpot = Object.keys(this.props.slots)[0];
      this.updateDisabledDays(firstAvailableSpot);
    }

    //console.log("its updatd");
  }
  handleDayClick = (day, { selected }) => {
    // console.log("selected Day", day);
    const formatedDate = moment(day).format("YYYY-MM-DD");
    ///sconsole.log("formated", moment(day).format("YYYY-MM-DD"));
    this.setState({
      selectedDay: selected ? undefined : day,
      ghlSelectedDay: formatedDate,
    });
  };
  updateSelectedSlot = (slot) => {
    this.setState({ selectedSlot: slot });
    this.props.updateSelectedSlot(slot);
  };
  handleMonthChange = (date) => {
    console.log(date);
    const startDate = moment(date).valueOf();
    this.setState({ selectedMonth: date });
    const endDate = moment(date).endOf("month").valueOf();
    this.props.getAppointmentSlots(startDate, endDate);
  };
  updateDisabledDays = (date) => {
    let currentMonth = date;
    if (!currentMonth) {
      currentMonth = this.state.selectedMonth;
    }
    console.log("current month", currentMonth);
    var monthDate = moment(currentMonth);
    var daysInMonth = monthDate.daysInMonth();
    var arrDays = [];

    while (daysInMonth) {
      var current = moment(currentMonth).date(daysInMonth);
      arrDays.push(current.format("YYYY-MM-DD"));
      daysInMonth--;
    }

    arrDays = arrDays.filter(
      (val) => !Object.keys(this.props.slots).includes(val)
    );
    arrDays = arrDays.map((d) => new Date(moment(d)));
    this.setState({ disabledDays: arrDays });
    console.log(arrDays);
    return arrDays;
  };
  render() {
    const slots = this.state.slots;
    let self = this;
    return (
      <div className="row ghlAppointmentCalendar-component">
        <div className="calendar col-6">
          <div className="timezone">
            <h5>Select Timezone</h5>
            <Select
              value={this.props.selectedTimezone}
              onChange={this.props.updateTimeZone}
              options={this.props.timeZoneList}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "#4B9560",
                  primary: "#4B9560",
                },
              })}
            />
          </div>
          <DayPicker
            selectedDays={this.state.selectedDay}
            onDayClick={this.handleDayClick}
            disabledDays={this.state.disabledDays}
            onMonthChange={this.handleMonthChange}
            fromMonth={new Date(moment())}
            toMonth={new Date(moment().add(1, "month"))}
          />
        </div>
        {this.state.availableDays.length !== 0 && (
          <div className="availableSlots col-6">
            {Object.keys(slots).map(function (key, index) {
              if (key === self.state.ghlSelectedDay) {
                return (
                  <div className="row">
                    {slots[key].slots.map((e) => {
                      return (
                        <div className="col-12 mb-1 text-center">
                          <button
                            className={`${
                              self.state.selectedSlot === e
                                ? "btn active"
                                : "btn"
                            }`}
                            onClick={() => self.updateSelectedSlot(e)}
                          >
                            {moment
                              .tz(e, self.props.selectedTimezone.value)
                              .format("LT")}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              /* console.log(slots[key]);
            console.log(key); */
            })}
          </div>
        )}
        <div className="col-12">
          <div className="row navigationButtons">
            <div className="col-6">
              <button
                className="btn btn-outline-dark btn-block"
                onClick={() => {
                  this.props.updateStep(1);
                }}
              >
                Back
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-dark btn-block"
                onClick={() => {
                  this.props.updateStep(3);
                }}
                disabled={this.state.selectedSlot ? false : true}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
