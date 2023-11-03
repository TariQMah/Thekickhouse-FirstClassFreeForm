import React, { Component } from "react";
import moment from "moment-timezone";
export default class ClassFilters extends Component {
  state = {
    selectedDate: moment().tz("America/Los_Angeles").format("l"),
    selectedClassType: "kickstart",
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

  render() {
    return (
      <div className="row classFilters">
        <div className="col-8">
          <span className="selectedDate">
            {moment(this.state.selectedDate).format("dddd, MMMM D, YYYY")}
          </span>
        </div>
        <div className="col-4">
          <div className="mobilePrevNextBtn">
            <button
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
            </button>
          </div>
        </div>
      </div>
    );
  }
}
