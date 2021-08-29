import React, { useState } from "react";
// import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import FocusTimer from "./FocusTimer";
import BreakTimer from "./BreakTimer";
import TimerControls from "./TimerControls";

// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore more likely to be pure

/**
 * Update the session state with new state after each tick of the interval
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function formatTime(totalTime) {
  // return time formatted in minutes (left) and seconds, if seconds are greater than 9, update seconds to 0 and add to minutes
  return (totalTime - (totalTime %= 60))/60 + (9 < totalTime ? ':' + totalTime : ':0' + totalTime)
};

function Pomodoro() {
  // Timer starts out NOT running / paused **
  // Set state for isTimerRunning
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // Timer starts out paused
  // Set state for isTimerPaused
  const [isTimerPaused, setIsTimerPaused] = useState(true);
  // The current session - null where there is no session running
  // Set state for session
  const [session, setSession] = useState(null);
  // Set state for break
  const [takingBreak, setTakingBreak] = useState(false);
  // Set state for focusDuration
  const [focusDuration, setFocusDuration] = useState(25);
  // Set state for breakSession
  const [breakDuration, setBreakDuration] = useState(5);
    // Set state for aria
  const [aria, setAria] = useState(0);
  // Set state for elapsedTime
  const [elapsedTime, setElapsedTime] = useState(0);
  // Set state for timeRemaining
  const [timeRemaining, setTimeRemaining] = useState(focusDuration * 60);
  // Set state for breakTimeRemaining
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);

    /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will *NOT* need to make changes to the callback function
   */
     useInterval(() => {
      // If the time remaining for the session is 0
       setBreakTimeRemaining(breakTimeRemaining + 1)
      if (session.timeRemaining === 0) {
        // play the audio file
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        setSession(nextSession(focusDuration, breakDuration));
      }
       setSession(nextTick);
      if (session.label === "Focusing") {
        setAria(100*(focusDuration * 60 - session.timeRemaining)/(focusDuration * 60))
      } else {
        setAria(100*(breakDuration * 60 - session.timeRemaining)/(breakDuration * 60))
      }
    },
    isTimerRunning ? 1000 : null
  );
  
  useInterval(() => {
    if(session && session.timeRemaining) {
      return setElapsedTime(elapsedTime + 1)
    }
  }, 1000)
  // Called whenever the play/pause button is clicked
// default playPause function
// Called whenever the play/pause button is clicked
   function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
  

// Create a stop function for TimerControls component
// Stop current session
  function stop() {
    // If the session is not currently running, return
    if(!session) return;
    // Otherwise, update session state
    setSession(false);
    // Update break state
    setTakingBreak(false);
    // Update isTimerRunning state
    setIsTimerRunning(false);
    // Update isTimerPaused
    setIsTimerPaused(false);
    // Update TimeRemaining state to initial focusDuration value of sixty minutes
    setTimeRemaining(focusDuration * 60);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          {/* // FocusTimer -- check props and complete this component */}
          <FocusTimer 
          focusDuration={focusDuration}
          setFocusDuration={setFocusDuration}
          />
          </div>
          <div className="col">
          <div className="float-right">
            {/* // BreakTimer -- check props and complete this component */}
            <BreakTimer 
            breakDuration={breakDuration}
            setBreakDuration={setBreakDuration}
            />
            </div>
            {/* TimerControls -- check props and complete this component, add stop function: stop={stop} */}
            <TimerControls 
            isTimerRunning={isTimerRunning} 
            playPause = {playPause} 
            stop={stop} 
            />
          </div>
        <div>
        { session && (<div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
              {session && session.label} for {("0" + ((session.label === "Focusing") ? focusDuration : breakDuration)).substr(-2)}:00 minutes
            </h2>
            {/* *** TODO: *** Update message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
              {session && formatTime(session.timeRemaining)} remaining
            </p>
          </div>
        </div>)}
       { session && <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={aria} // *** TODO: *** Increase aria-valuenow as elapsed time increases
                style={{ width: `${ aria }%` }} // *** TODO: *** Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>}
      </div>
      </div>
    </div>
  );
}

export default Pomodoro;