import React, { Component } from "react";
import moment from "moment-timezone";
import { DayPickerInput } from "react-day-picker/DayPickerInput";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
class ChangeDateInput extends Component {
  constructor(props) {
    super(props);
    let { value, onChange, onFocus, onBlur } = props;
    //console.log(props);
  } 
  focus = () => {
    this.input.focus();
  };
  render() {
    let { value, onFocus, onBlur } = this.props;
    return (
      <button
        className="btn btn-link d-none d-sm-inline"
        ref={(el) => (this.input = el)}
        onBlur={onBlur}
        onClick={onFocus}
      >
        Change Date
      </button>
    );
  }
}

export default class ClassFilters extends Component {
  state = {
    selectedDate: moment().tz("America/Los_Angeles").format("l"),
    selectedClassType: "kickstart",
    visibleReset: false,
  };

  updatePrevDate() {
    let currentDate = this.state.selectedDate;
    let prevDate = moment(currentDate).subtract(1, "d");
    this.setState({
      selectedDate: moment(prevDate).format("l"),
    });
    this.props.updateFilteredClasses(moment(prevDate).format("l"));
  }

  updateNextDate() {
    let currentDate = this.state.selectedDate;
    let nextDate = moment(currentDate).add(1, "d");
    this.setState({
      selectedDate: moment(nextDate).format("l"),
    });
    this.props.updateFilteredClasses(moment(nextDate).format("l"));
  }
  handleDayChange = (selectedDay, modifiers, dayPickerInput) => {
    const input = dayPickerInput.getInput();
    const selectedDate = moment(selectedDay).format("l");
    this.setState({ selectedDate: selectedDate });
    this.setState({ visibleReset: true });
    this.props.updateFilteredClasses(
      selectedDate
      /* this.state.selectedClassType */
    );
  };
  handleResetBtnClick = () => {
    this.setState({ visibleReset: false });
    this.props.updateFilteredClasses("");
  };
  render() {
    return (
      <div className="row classFilters">
        <div className="col-6">
          <div className="mobilePrevNextBtn">
            <DayPickerInput
              value={this.state.selectedDate}
              component={ChangeDateInput}
              dayPickerProps={{
                disabledDays: {
                  after: moment().add(2, "months").toDate(),
                  before: moment().toDate(),
                },
              }}
              component={(props) => <ChangeDateInput {...props} />}
              onDayChange={this.handleDayChange}
            />
            {/* <button
              className="btn btn-outline-dark"
              onClick={() => this.updatePrevDate()}
              disabled={
                this.state.selectedDate ===
                moment().tz("America/Los_Angeles").format("l")
                  ? true
                  : false
              }
            >
              <i class="fas fa-chevron-left"></i>prev
            </button>
            <button
              className="btn btn-outline-dark"
              onClick={() => this.updateNextDate()}
            >
              next<i class="fas fa-chevron-right"></i>
            </button> */}
          </div>
        </div>
        {this.state.visibleReset && (
          <div className="col-6">
            <span className="selectedDate">
              <button class="btn btn-link" onClick={this.handleResetBtnClick}>
                Reset
              </button>
            </span>
          </div>
        )}
      </div>
    );
  }
}
