/**
 Authors:    Adam Smith, Daniel Ford
 Date:       2 Dec 2014
 */

// Variable declaration and jQuery sortable initialization
$(document.getElementById('exercises')).sortable({
    connectWith: '#exercises, #trash'
}).disableSelection();

// Functionality for removing exercise divs from the DOM
$("#trash").droppable({
    accept: "#exercises div",
    hoverClass: "ui-state-hover",
    drop: function(ev, ui) {
        ui.draggable.remove();
        toastr.options = temporaryToast;
        toastr.success('Exercise was deleted', 'Success');
    }
});

var ul = document.getElementById('exercises');
var workoutTextbox = document.getElementById('workoutName');
var loadedWorkoutName = getParameterByName('wo');

// Set the title if the workout is not new
if (loadedWorkoutName) {
    document.getElementById('workoutTitle').innerHTML = loadedWorkoutName;
    workoutTextbox.value = loadedWorkoutName;
    workoutTextbox.style.display = "none";

    var exercises = JSON.parse(localStorage.getItem(loadedWorkoutName));
    var length = exercises.length;
    for (var i = 0; i < length; ++i) {
        addExerciseToList(exercises[i]);
    }
} else {
    workoutTextbox.value = "";
}

/**
 * Add the exercise to the workout list
 */
function addExercise() {
    // Set the options for the toaster message
    toastr.options = temporaryToast;

    // Creates a new exercise from user values
    var newExercise = exercise;
    newExercise.name = $(document.getElementById('exerciseName')).val();
    newExercise.activeSeconds = $(document.getElementById('activeTime')).val();
    newExercise.restSeconds = $(document.getElementById('restTime')).val();

    // If any exercise field is invalid than throw a message and cancel adding
    if (newExercise.name == "" || newExercise.activeSeconds < 0 || newExercise.activeSeconds > 10800
        || newExercise.restSeconds < 0 || newExercise.restSeconds > 10800) {
        toastr.showDuration = 8000;
        toastr.warning('All exercise fields are required and must contain valid data', 'Add Exercise Failed');
        return false;
    }

    // Reset the values in the controls to add a new exercise
    $(document.getElementById('exerciseName')).val("");
    $(document.getElementById('activeTime')).val("0");
    $(document.getElementById('restTime')).val("0");

    // Call the helper that adds to the list
    addExerciseToList(newExercise);

    // Exercise was successfully added - display message
    toastr.success('Exercise successfully added', 'Success');
}

/**
 * Save the workout to the local storage
 */
function saveWorkout(isTempWorkout) {
    // Member variables
    toastr.options = temporaryToast;
    var workoutExercises = [];
    var workoutNamesArray;
    var workoutNames = localStorage.getItem('workoutNames');

    // Initialize workoutnamesArray to empty if this is new
    if (workoutNames) {
        workoutNamesArray = JSON.parse(workoutNames);
    } else {
        workoutNamesArray = [];
    }

    // Push the new workout to the array and save
    if ($.inArray(workoutTextbox.value, workoutNamesArray) == -1) {
        workoutNamesArray.push(document.getElementById('workoutName').value);
    }

    // Get the exercises from the DOM
    var items = $(ul.getElementsByTagName('div')).find('input');
    var length = items.length;

    // Stop the workout if there are no exercises in the list
    if (length < 1) {
        toastr.warning('Workouts must contain at least one exercise', 'Unsuccessful');
        return false;
    }

    if (!isTempWorkout) {
        // Stop the save if the user hasn't entered a name for the workout
        if (workoutTextbox.value == "") {
            toastr.warning('Please give your workout a name', 'Save Workout Failed');
            return false;
        }
    }

    // For every exercise find the hidden field
    // that contains the stringified object
    for (var i = 0; i < length; ++i) {
        var workout = JSON.parse(items[i].value);
        workoutExercises.push(workout);
    }

    // Saves the workout name to a list of names and saves
    // the workout object with the workout name as the key
    localStorage.setItem('workoutNames', JSON.stringify(workoutNamesArray));
    localStorage.setItem(workoutTextbox.value, JSON.stringify(workoutExercises));

    if (!isTempWorkout) {
        //The items were successfully saved
        toastr.success('Workout Saved', 'Success');
    }
}

/** Attempt to navigate back to the main page
 *  First, check to see if the user made any changes to the workout
 */
function navigateBack(){

    if(checkForChanges()){
        // A change has been made...ask the user
        confirmToast('quitWorkout', 'Discard unsaved changes?', goToPage, 'main');
    } else {
        // If this is a new workout or existing workout with no changes, Just go to the main page
        goToPage('main');
    }
}

/** This function checks for changes to the workout since it was last saved (or
 *  if it was saved at all)
 *  Returns: TRUE if changes occurred
 *           FALSE if no changes
 */
function checkForChanges()
{

    // Get the exercises from the DOM
    var items = $(ul.getElementsByTagName('div')).find('input');
    var length = items.length;
    var workoutExercises = [];
    var savedWorkout;

    // For every exercise find the hidden field
    // that contains the stringified object
    for (var i = 0; i < length; ++i) {
        var workout = JSON.parse(items[i].value);
        workoutExercises.push(workout);
    }

    //Get what is saved from this workout (or if it is saved)
    savedWorkout = localStorage.getItem(workoutTextbox.value);

    // If this is a new workout or existing workout with no changes, return false
    if((savedWorkout == JSON.stringify(workoutExercises)) ||
        (length == 0 && savedWorkout == null && workoutTextbox.value == "")){
        return false;
    } else {
        return true;
    }
}

/**
 * Begins the workout and passes the workout in a query string
 */
function beginWorkoutClick() {
    if (checkForChanges() || workoutTextbox.value == "") {
        confirmToast('beginTempWorkout', 'Begin workout without saving changes?', beginTempWorkout);
    } else {
        document.location.href = "timer.html?wo=" + workoutTextbox.value;
    }
}

/**
 * Begins the workout for a temporary (not permanently-saved) workout
 */
function beginTempWorkout() {
    workoutTextbox.value = "temp";
    var savedSuccessfully = saveWorkout(true);
    if (savedSuccessfully == null) {
        document.location.href = "timer.html?wo=temp";
    } else {
        workoutTextbox.value = "";
    }
}

/**
 Grabs the data from the query string
 */
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Adds exercises to the list for loading and adding new exercises
 * @param exercise
 */
function addExerciseToList(exercise) {
    // Create a hidden field to hold the stringified JSON object
    // that will be added to the list item for retrieval later.
    // This prevents having to manually track the sort order upon save.
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('value', JSON.stringify(exercise));

    // Creates the item to be added to the list of exercises
    // and then appends the hidden field from above before
    // adding the element to the DOM
    var newExerciseDiv = document.createElement('div');
    newExerciseDiv.className = "exerciseItem";
    newExerciseDiv.innerHTML = exercise.name + ': active ' + exercise.activeSeconds + ' seconds, rest ' + exercise.restSeconds + ' seconds';
    newExerciseDiv.appendChild(hiddenField);
    ul.appendChild(newExerciseDiv);
}