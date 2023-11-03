import React, { Component, useState } from "react";
import moment from "moment-timezone";
//import { DayPickerInput } from "react-day-picker/DayPickerInput";
import { format, isValid, parse } from "date-fns";
import FocusTrap from "focus-trap-react";
import { usePopper } from "react-popper";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useRef } from "react";
/* class ChangeDateInput extends Component {
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
 */
export default function ClassFilters({ updateFilteredClasses }) {
  const [selectedDate, setSelectedDate] = useState();
  const [inputValue, setInputValue] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("kickstart");
  const [visibleReset, setVisibleReset] = useState(false);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const buttonRef = useRef(null);
  const [popperElement, setPopperElement] = useState(null);

  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom",
  });

  const updatePrevDate = () => {
    let currentDate = selectedDate;
    let prevDate = moment(currentDate).subtract(1, "d");
    /* this.setState({
      selectedDate: moment(prevDate).format("l"),
    }); */
    setSelectedDate(moment(prevDate).format("l"));
    updateFilteredClasses(moment(prevDate).format("l"));
  };

  const updateNextDate = () => {
    let currentDate = selectedDate;
    let nextDate = moment(currentDate).add(1, "d");
    /* this.setState({
      selectedDate: moment(nextDate).format("l"),
    }); */
    setSelectedDate(moment(nextDate).format("l"));
    updateFilteredClasses(moment(nextDate).format("l"));
  };
  const handleDayChange = (selectedDay, modifiers, dayPickerInput) => {
    const input = dayPickerInput.getInput();
    const selectedDate = moment(selectedDay).format("l");
    //this.setState({ selectedDate: selectedDate });
    setSelectedDate(selectedDate);
    //this.setState({ visibleReset: true });
    setVisibleReset(true);
    updateFilteredClasses(
      selectedDate
      /* this.state.selectedClassType */
    );
  };
  const handleResetBtnClick = () => {
    //this.setState({ visibleReset: false });
    setVisibleReset(false);
    updateFilteredClasses("");
  };
  const handleButtonClick = () => {
    // setIsPopperOpen(true);
    //this.setState({ isPopperOpen: true });
    setIsPopperOpen(true);
  };
  const handleDaySelect = (date) => {
    // setSelected(date);
    //this.setState({ selectedDate: date });
    console.log("Selected Date", date);
    const formatedDate = format(date, "P");
    console.log("Formated Date", formatedDate);
    setSelectedDate(date);
    if (date) {
      // setInputValue(format(date, "y-MM-dd"));
      updateFilteredClasses(formatedDate);
      closePopper();
    } else {
      //setInputValue("");
    }
  };
  const closePopper = () => {
    //setIsPopperOpen(false);
    //this.setState({ isPopperOpen: false });
    setIsPopperOpen(false);
    buttonRef.current.focus();
  };

  return (
    <div className="row classFilters">
      <div className="col-6">
        <div className="mobilePrevNextBtn">
          <button
            ref={buttonRef}
            type="button"
            aria-label="Pick a date"
            onClick={handleButtonClick}
          >
            Pick a date
          </button>
          {isPopperOpen && (
            <FocusTrap
              active
              focusTrapOptions={{
                initialFocus: false,
                allowOutsideClick: true,
                clickOutsideDeactivates: true,
                onDeactivate: closePopper,
                fallbackFocus: buttonRef.current,
              }}
            >
              <div
                tabIndex={-1}
                style={popper.styles.popper}
                className="dialog-sheet"
                {...popper.attributes.popper}
                ref={setPopperElement}
                role="dialog"
                aria-label="DayPicker calendar"
              >
                <DayPicker
                  initialFocus={isPopperOpen}
                  mode="single"
                  defaultMonth={selectedDate}
                  selected={selectedDate}
                  onSelect={handleDaySelect}
                />
              </div>
            </FocusTrap>
          )}
          {/* <DayPickerInput
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
            /> */}
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
      {visibleReset && (
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
