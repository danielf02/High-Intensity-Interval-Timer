/**
    Authors:    Adam Smith, Daniel Ford
    Date:       25 Nov 2014
 */

const TIMER_INTERVAL = 10;      // The amount of time that passes by on each of the timer's intervals (in ms)
var workoutName = '';           // Name of the workout that this timer is for
var exerciseTimer;              // The timer for the active/rest interval
var executingTimer = false;     // Is the timer currently counting down?
var exerciseTimeLeft = 0;       // Sample Time
var exerciseList;               // Array of all remaining workouts (last one is the current one)
var isActive = false;           // If the timer is for the active workout
var currentExerciseIdx = 0;     // Index of the current exercise in our exerciseList array
var remainingReps = 0;          // The remaining number of repetitions of the workout
var workoutStarted = false;     // Whether the workout has started yet or not

/**
 * Start (or Resume) the workout that this timer has loaded
 */
function startWorkout(){

    // Perform a check to see if the user entered a valid repetition amount
    if(!workoutStarted){
        remainingReps = document.getElementById('repCount').value;
        if(remainingReps <= 0 ){
            // If the remaining number of reps is NULL, the user did not specify a valid number of reps
            toastr.options = temporaryToast;
            toastr.showDuration = 8000;
            toastr.warning('Please enter a number between 1 and 100', 'Invalid Repetitions');
            return;
        } else {
            workoutStarted = true;
            document.getElementById('repetitionEntry').style.display = "none";
            document.getElementById('repetitionDisplay').style.display = "inline";
            setRepetitionText();
        }
    }

    if(executingTimer){
        // Stop the timer execution
        executingTimer = false;
        clearInterval(exerciseTimer);
        document.getElementById('pauseWorkout').value = "Resume";
    } else {
        //Execute the method to begin taking seconds off the workout
        executingTimer = true;
        exerciseTimer = setInterval(minusTimeInterval, TIMER_INTERVAL);       //Repeat method every TIMER_INTERVAL
        document.getElementById('pauseWorkout').value = "Pause";
    }

    updateBackgroundColor();
}

/**
 * Convert seconds to a displayable time for the timer
 * @param totalSeconds      The total number of seconds to display on the timer
 * @returns {string}        A string, properly formatted for the timer
 */
function secondsToText(totalSeconds){
    // Convert the total seconds for the exercise to minutes/seconds for display
    if(totalSeconds > parseFloat(TIMER_INTERVAL / 1000)){
        var minutes = parseInt(totalSeconds / 60);
        var seconds = parseInt(totalSeconds - (60 * minutes));
        var ms = parseInt((totalSeconds % 1) * 100);

        return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds + ":" + (ms < 10 ? '0' : '') + ms;
    } else {
        return "00:00:00";
    }
}

/**
 * Decrement and display the number of repetitions left in the workout
 * This will update the DOM element and should only be called when on the last exercise
 * of the workout and are switching to the next repetition
 */
function setRepetitionText(){
    // Decrement the number of reps remaining and set element's text
    remainingReps--;
    document.getElementById('repetitionCountDisplay').innerHTML = remainingReps + (remainingReps == 1 ? " Repetition Remaining" : " Repetitions Remaining");
}

/**
 * Update the background color, depending on whether the timer is paused, active, or on rest
 */
function updateBackgroundColor(){

    if(!executingTimer){
        $('#timerContent').removeClass('activeTimer');
        $('#timerContent').removeClass('restTimer');
    } else{
        if(isActive){
            $('#timerContent').removeClass('restTimer');
            $('#timerContent').addClass('activeTimer');
        } else {
            $('#timerContent').removeClass('activeTimer');
            $('#timerContent').addClass('restTimer');
        }
    }
}

/**
 * Switch to the next cycle (Active or Rest cycles) and update the number of
 * repetitions, if necessary. If workout is complete, leave the page
 */
function switchNextCycle(){

    var newRepetition = false;

    // If this is the last exercise, see if there are more repetitions remaining
    if((currentExerciseIdx + 1) == exerciseList.length && isActive == false){
        if(remainingReps == 0) {
            goToPage('main');
        } else{
            //There are more repetitions remaining, so decrement the rep count and restart the workout
            currentExerciseIdx = 0;
            setRepetitionText();
            newRepetition = true;
        }
    }

    if (isActive == true){
        // Stay on the current exercise, but switch to the rest cycle
        isActive = false;
        exerciseTimeLeft = exerciseList[currentExerciseIdx].restSeconds;
    } else{
        // If we have workouts left in the array, set the active flag and move to the next exercise
        isActive = true;

        // If we did not just cycle through a new repetition, increment the current exercise index
        if(!newRepetition) {
            currentExerciseIdx++;
        }
        exerciseTimeLeft = exerciseList[currentExerciseIdx].activeSeconds;
        displayExercises();
    }

    updateBackgroundColor();
}

/**
 * Subtract time from the total interval of the current (active or rest) cycle.
 * If necessary, call switchToNextCycle if no time is remaining
 */
function minusTimeInterval(){
    // Subtract the (timer interval / 1000) from the current time, since timer interval is in ms
    exerciseTimeLeft -= parseFloat(TIMER_INTERVAL / 1000);

    // For aesthetics, wait until timer is below 0, so we can see 00:00:00, then switch to the next exercise
    if(exerciseTimeLeft < 0){
        // The time ran out on the current cycle, so switch to rest/active/next exercise
        switchNextCycle();
    }

    document.getElementById('timeRemaining').innerHTML = secondsToText(exerciseTimeLeft);
}

/**
 * Update the current and next exercise that is displayed on the screen
 */
function displayExercises(){
    // Display the current exercise and the upcoming exercise

    document.getElementById('currentExercise').innerHTML = "Current Exercise:   " + exerciseList[currentExerciseIdx].name;

    // If we are on the last exercise, display a generic message
    if (currentExerciseIdx + 1 == exerciseList.length){
        document.getElementById('nextExercise').innerHTML = "No Remaining Exercises";
    } else{
        document.getElementById('nextExercise').innerHTML = "Next Exercise:   " + exerciseList[currentExerciseIdx + 1].name;
    }
}

/**
 * Perform initialization on the timer. Includes:
 *      Getting the current workout name
 *      Getting all exercises that belong to the current workout
 *      Setting up the display
 */
function initializeTimer(){

    // Get the name of the workout and set the workout title for the user to see
    workoutName = getURLParameter('wo');
    document.getElementById('repetitionDisplay').style.display = "none";
    currentExerciseIdx = 0;

    exerciseList = getSavedExercises(workoutName);

    // Default the timer to the total active .001 second intervals for the current exercise (first one in the array)
    exerciseTimeLeft = exerciseList[currentExerciseIdx].activeSeconds;
    document.getElementById('timeRemaining').innerHTML = secondsToText(exerciseTimeLeft);
    isActive = true;

    // Displays the current and next exercises in their proper locations
    displayExercises();
}