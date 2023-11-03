import React, { Component } from "react";
import axios from "axios";
import { apiURL } from "../../config";
import ClassFilters from "./classFilters";
import moment from "moment-timezone";
export default class ClassList extends Component {
  state = {
    isLoading: true,
    classList: [],
    filteredClassList: null,
    introClassList: [],
    noClasses: false,
    classType: "kickstart",
    error: "",
    selectedDate: moment().tz("America/Los_Angeles").format("l"),
  };
  async askhGetClassList() {
    let k_business = this.props.businessID;
    const response = await axios.get(apiURL, {
      params: {
        askhGetClassTab: true,
        k_business: k_business,
      },
    });
    const data = await response.data;
    if (data.status === "ok") {
      this.setState({ isLoading: false });
      const a_session = response.data.a_session;

      const uniqueSessions = [
        ...new Set(a_session.map((o) => JSON.stringify(o))),
      ].map((string) => JSON.parse(string));
      this.setState({ classList: uniqueSessions });
      //console.log(uniqueSessions);
      return uniqueSessions;
    } else {
      return false;
    }

    //GetClass List
    /* const response = await axios.get(apiURL, {
      params: {
        askhGetClassList: true,
        k_business: k_business,
      },
    });
    const data = await response.data;
    if (data.status === "ok") {
      this.setState({ isLoading: false });
      this.setState({ classList: response.data.a_session });
      return data.a_session;
    } else {
      return false;
    } */
  }
  async askhGetClassInfo(k_class_period, dt_date) {
    const response = await axios.get(apiURL, {
      params: {
        askhGetClassInfo: true,
        k_class_period: k_class_period,
        dt_date: dt_date,
      },
    });
    const data = await response.data;
    // console.log(data);
    if (data.status === "ok") {
      return data;
    } else {
      return false;
    }
  }

  updateFilteredClasses = (
    selectedDate,
    classSessions = this.state.classList
  ) => {
    //console.log("Insier Filtered Classes");
    this.setState({ isLoading: true });
    this.setState({ noClasses: true });
    let classType = this.state.classType;
    if (this.props.isMember) {
      classType = "";
    }
    //let classSessions = this.state.classList;
    let filteredClassList = [];
    if (classSessions.length) {
      //console.log("Insier Filtered Classes");
      classSessions.forEach((element) => {
        if (
          moment(element.dtl_date).format("l") === selectedDate &&
          element.s_title.toLowerCase().includes(classType)
        ) {
          // console.log("matched classes found");
          this.setState({ noClasses: false });
          filteredClassList.push(element);
        }
      });
      filteredClassList.sort(
        (a, b) => moment(a.dtl_date).format() - moment(b.dtl_date).format()
      );
      this.updateIntroClassInfo(filteredClassList);
    } else {
      this.setState({ noClasses: true });
      this.setState({ isLoading: false });
    }

    this.setState({ filteredClassList: filteredClassList });
  };

  async updateIntroClassInfo(filteredClassList) {
    let classItems = [];
    let classCounts = 1;
    this.setState({ isLoading: true });
    this.setState({ introClassList: [] });
    await Promise.all(
      filteredClassList.map(async (element) => {
        const response = await axios.get(apiURL, {
          params: {
            askhGetClassInfo: true,
            k_class_period: element.k_class_period,
            dt_date: element.dt_date,
          },
        });
        const data = await response.data;
        if (data.status === "ok") {
          let classItem = {
            s_title: element.s_title,
            i_duration: element.i_duration,
            k_class: element.k_class,
            k_class_period: element.k_class_period,
            k_staff: element.a_staff[0],
            dt_date: element.dt_date,
            dt_time: element.dt_time,
            dtl_date: element.dtl_date,
            a_staff: data.a_staff[0],
            can_book: data.a_class.can_book,
            i_book: data.a_class.i_book,
            i_book_active: data.a_class.i_book_active,
            i_capacity: data.a_class.i_capacity,
            i_wait: data.a_class.i_wait,
            is_book: data.a_class.is_book,
            is_wait_list: data.a_class.is_wait_list,
            m_price: data.a_class.m_price,
          };
          classItems.push(classItem);
          //console.log(classItems.length);
          if (classItems.length === filteredClassList.length) {
            classItems.sort((a, b) => moment(a.dtl_date) - moment(b.dtl_date));
            this.setState({ introClassList: classItems });
            this.setState({ isLoading: false });
          }
        } else {
        }
        // console.log(data);
      })
    );
    /* filteredClassList.forEach((element) => {
      //console.log(element);
      //let classItem = {};
      console.log("forech iteration");

      this.askhGetClassInfo(element.k_class_period, element.dt_date).then(
        (result) => {
          console.log("staffListExecution");
          //console.log(result);
          if (result) {
            let classItem = {
              s_title: element.s_title,
              i_duration: element.i_duration,
              k_class: element.k_class,
              k_class_period: element.k_class_period,
              k_staff: element.a_staff[0],
              dt_date: element.dt_date,
              dt_time: element.dt_time,
              dtl_date: element.dtl_date,
              a_staff: result.a_staff[0],
              can_book: result.a_class.can_book,
              i_book: result.a_class.i_book,
              i_book_active: result.a_class.i_book_active,
              i_capacity: result.a_class.i_capacity,
              i_wait: result.a_class.i_wait,
              is_book: result.a_class.is_book,
              is_wait_list: result.a_class.is_wait_list,
              m_price: result.a_class.m_price,
            };

            classItems.push(classItem);
            console.log(classItems.length);
            if (classItems.length === filteredClassList.length) {
              console.log(classItems);
              classItems.sort(
                (a, b) => moment(a.dtl_date) - moment(b.dtl_date)
              );
              console.log(classItems);
              this.setState({ introClassList: classItems });
              this.setState({ isLoading: false });
            }
          }
        }
      );
    }); */
  }
  async searchClient(email) {
    const response = await axios.get(apiURL, {
      params: {
        askhSearchClient: true,
        text_email: email,
        k_business: this.props.businessID,
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
      this.props.updateClientData(clientData);
      localStorage.setItem("askhClientData", JSON.stringify(clientData));
      return data.is_use;
    } else {
      return false;
    }
  }
  async registerClient(values) {
    const response = await axios.get(apiURL, {
      params: {
        askhPostLeadData: true,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        k_business: this.props.businessID,
      },
    });
    const data = await response.data;
    return data;
  }
  reserveClass = (item) => {
    this.props.updateClassSession(item);
    this.props.updateScreen(4);
  };
  componentDidMount() {
    //console.log(this.state.selectedDate);
    this.askhGetClassList().then((result) => {
      //console.log(result);
      let classSessions = result;
      if (classSessions.length) {
        let filteredClassList = [];
        this.updateFilteredClasses(this.state.selectedDate, classSessions);
      }
    });
  }
  render() {
    let heading = "";
    if (this.props.isProspect) {
      heading = "Free Intro Classes";
    }
    if (this.props.isMember) {
      heading = "All Classes";
    }
    let errorMessage = [];
    {
      this.state.error &&
        errorMessage.push(
          <div className="alert alert-danger">{this.state.error}</div>
        );
    }
    let currentTime = moment();

    let isLoading = this.state.isLoading;
    let bookButtonLabel = "Book Now";
    let bookMemberLabel = "Members Only";
    if (isLoading) {
      bookButtonLabel = "Booking...";
      bookMemberLabel = "Booking...";
    }
    let loadingGraphics = [];
    {
      isLoading && loadingGraphics.push(<div className="appLoader"></div>);
    }
    return (
      <div className="row classListScreen">
        {this.props.wlGuestInfo.is_customer_new && (
          <div> Can't book the classes</div>
        )}
        <div className="col-12">
          {errorMessage}
          <div className="classSetionHeading">{heading}</div>
          <ClassFilters
            updateFilteredClasses={this.updateFilteredClasses}
          ></ClassFilters>
          {loadingGraphics}

          {!isLoading &&
            this.state.introClassList.map((item) => {
              let classTime = item.dtl_date;
              let classTimingDiff = moment(classTime).diff(currentTime);
              let duration = moment.duration(classTimingDiff);
              let hoursDifference = duration.asHours();
              //console.log(classTimingDiff);
              return (
                <div className="row classListItem">
                  <div className="col-12 classInformation">
                    <div className="row">
                      <div className="col-7">
                        <div className="mobileClassTiming">
                          {moment(item.dtl_date).format("h:mm")} {"-"}
                          {moment(item.dtl_date)
                            .add(item.i_duration, "m")
                            .format("h:mmA")}
                        </div>
                        <span className="classTitle">{item.s_title} </span>
                        <span className="classInstructor">
                          (with {item.a_staff.s_name} {item.a_staff.s_family})
                        </span>
                      </div>
                      <div className="col-5 text-right">
                        <div className="bookNoBtn">
                          <button
                            className="btn btn-dark"
                            onClick={() => this.reserveClass(item)}
                            disabled={
                              hoursDifference > 3
                                ? item.i_capacity <= item.i_book
                                  ? false
                                  : false
                                : true
                            }
                          >
                            {/* {item.can_book
                              ? item.i_capacity <= item.i_book
                                ? "Class Full"
                                : bookButtonLabel
                              : item.i_capacity <= item.i_book
                              ? "Class Full"
                              : bookMemberLabel} */}
                            {item.i_capacity <= item.i_book
                              ? "Join Waitlist"
                              : "Book Now"}
                          </button>
                        </div>

                        <div className="classCapacity">
                          {item.i_capacity <= item.i_book
                            ? 0
                            : item.i_capacity - item.i_book}
                          /{item.i_capacity} Spaces left<br></br>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {this.state.noClasses && (
            <div>No sessions matching your filters.</div>
          )}
          <div className="row navigationButtons">
            <div className="col-12">
              <button
                className="btn btn-outline-dark btn-block"
                onClick={() => {
                  this.props.updateScreen(this.props.isNlpFreeIntro ? 1 : 2);
                }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
