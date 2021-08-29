# Project description: Pomodoro timer
The Pomodoro technique is a time-management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for tomato, after the tomato-shaped kitchen timer that Cirillo used as a university student. For this project, you will implement a simplified version of Cirillo's original Pomodoro technique.

## Learning objectives
This project is designed to test your ability to work with rendering and state management using React. Before taking on this project, you should be comfortable with the learning objectives listed below:

#### + Installing packages via NPM
#### + Running tests from the command line
#### + Writing React function components
#### + Using hooks like useState()
#### + Debugging React code through console output

## Project rubric
For your project to pass, all of the following statements must be true.

#### + All props are treated as read-only.
#### + Audio plays when the focus timer expires.
#### +Audio plays when the break timer expires.
#### + All state is updated using callbacks to avoid race conditions. Allowable exceptions are cases where the next state is not determined by the current state. For example, when disabling the timer, it is okay to just call setIsTimerRunning(false).
#### + There are at least three components.
#### + Each component has a single responsibility.
#### + The main Pomodoro is free of any conditional display logic. This means that there aren't any if statements in the render function; each component determines its own visibility.
