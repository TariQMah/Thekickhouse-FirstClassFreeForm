import React from "react";
import "./index.scss";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
/* import "moment/locale/tr";
import Clock from "react-live-clock";
import "moment-timezone";
import "react-moment";
import moment from "react-moment"; */
import moment from "moment";
const minuteSeconds = 60;
const hourSeconds = minuteSeconds * 60;
const daySeconds = hourSeconds * 24;

const timerProps = {
  isPlaying: true,
  size: 50,
  strokeWidth: 3,
};

const renderTime = (time) => {
  return (
    <div className="time-wrapper">
      <div className="title time">{time}</div>
    </div>
  );
};

const getTimeSeconds = (time) => Math.ceil(minuteSeconds - time) - 1;
const getTimeMinutes = (time) => Math.ceil(time / minuteSeconds) - 1;
const getTimeHours = (time) => Math.ceil(time / hourSeconds) - 1;
const getTimeDays = (time) => Math.ceil(time / daySeconds) - 1;

export default function CountDown() {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  //const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const startTime = moment().unix(); // use UNIX timestamp in seconds
  console.log("startTime", startTime);
  //const endTime = startTime + 86400; // use UNIX timestamp in seconds
  const endTime = moment().endOf("day").unix();
  console.log("endTime", endTime);
  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <section className="countdown">
      <div className="all-times-bar">
        {/* <div className="timebox">
          <div className="day mr-12">
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#9000ff", 0],
                ["#0066FF", 1],
              ]}
              isLinearGradient={true}
              duration={daysDuration}
              initialRemainingTime={remainingTime}
              trailColor={[["#dbdbdb"]]}
            >
              {({ elapsedTime }) =>
                renderTime(getTimeDays(daysDuration - elapsedTime))
              }
            </CountdownCircleTimer>
          </div>
          <h3 className="title">days</h3>
        </div> */}
        <div className="timebox">
          <div className="hours mr-12">
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#61CE70", 0],
                ["#4B9560", 1],
              ]}
              isLinearGradient={true}
              duration={daySeconds}
              initialRemainingTime={remainingTime % daySeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > hourSeconds,
              ]}
              trailColor={[["#ffffff"]]}
            >
              {({ elapsedTime }) =>
                renderTime(getTimeHours(daySeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </div>
          <h5 className="title">hours</h5>
        </div>
        <div className="timebox">
          <div className="minutes mr-12">
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#61CE70", 0],
                ["#4B9560", 1],
              ]}
              isLinearGradient={true}
              duration={hourSeconds}
              initialRemainingTime={remainingTime % hourSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > minuteSeconds,
              ]}
              trailColor={[["#ffffff"]]}
            >
              {({ elapsedTime }) =>
                renderTime(getTimeMinutes(hourSeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </div>
          <h5 className="title">minutes</h5>
        </div>
        <div className="timebox">
          <div className="seconds mr-12">
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#61CE70", 0],
                ["#4B9560", 1],
              ]}
              isLinearGradient={true}
              duration={minuteSeconds}
              initialRemainingTime={remainingTime % minuteSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > 0,
              ]}
              trailColor={[["#ffffff"]]}
            >
              {({ elapsedTime }) => renderTime(getTimeSeconds(elapsedTime))}
            </CountdownCircleTimer>
          </div>
          <h5 className="title">seconds</h5>
        </div>
      </div>
    </section>
  );
}
