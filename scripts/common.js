/**
 *  Authors:    Adam Smith, Daniel Ford
 *  Date:       20 Nov 2014
 */

// Removes a particular value from an array
Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) {
        return this.splice(idx, 1); // The second parameter is the number of elements to remove.
    }
    return false;
}

// Data stored with each exercise in a workout
var exercise = {
    name: "",
    activeSeconds: 0,
    restSeconds: 0
}

/**
 *  Navigate to a particular page
 * @param name              The name of the page to go to
 */
function goToPage(name) {
    if (name == 'main'){
        document.location.href = "main.html";
    } else if(name == 'edit') {
        document.location.href = "edit.html";
    } else if(name == 'timer'){
        document.location.href = "timer.html";
    } else{
        // Unknown page...just go to the main page
        document.location.href = "main.html";
    }
}

/**
 *  Display a toastr message as stationary (user must acknowledge before disappearing)
 * @param elemId            Name of the div to be used in the toastr
 * @param toastMessage      Message to show in the toastr
 * @param callback          Callback function when 'Yes' is pressed
 * @param params            Parameters to supply the callback function
 */
function confirmToast(elemId, toastMessage, callback, params) {
    if (!document.getElementById(elemId)) {
        toastr.options = stationaryToast;
        toastr.info('<div id=' + elemId + '>' +
        '<button type="button" class="btn btn-primary" id="close">No</button>' +
        '&nbsp&nbsp' +
        '<button type="button" id="verifyYes" class="btn">Yes</button>' +
        '</div>', toastMessage);
        $(document.getElementById('verifyYes')).click(function () {
            callback(params);
        });
    }
}

/**
 * Returns an array of all exercises stored in the LocalStorage DB for a given workout
 * @param workoutName       The name of the workout to get the exercises for
 * @returns {*}             returns the workout exercises (null if workout doesn't exist)
 */
function getSavedExercises(workoutName){

    // Get the names of all the workouts we have saved
    var allWorkouts = JSON.parse(localStorage.getItem('workoutNames'));

    // If the name of the workout is saved by us, look for the workout's exercises. Otherwise, return null
    if($.inArray(workoutName, allWorkouts) == -1){
        return null;
    } else{
        var workoutExercises = JSON.parse(localStorage.getItem(workoutName));
        // Return an array of exercises saved for the workout
        return workoutExercises;
    }

}

/**
 * Remove the workout from local storage. Shows a toastr message if the workout does not exist in the DB
 * @param workoutToDelete       The name of the workout to delete
 */
function deleteWorkout(workoutToDelete) {
    // Set the options for the toaster message
    toastr.options = temporaryToast;

    // Retrieve the list of workout names to check
    var workoutNames = localStorage.getItem('workoutNames');
    // If the list of workout names already exists
    if (workoutNames) {
        // Parse the JSON data to an array
        var workoutNamesArray = JSON.parse(workoutNames);
        // If the workout is actually a saved workout name delete
        if ($.inArray(workoutToDelete, workoutNamesArray) > -1) {
            workoutNamesArray.remove(workoutToDelete);
            localStorage.setItem('workoutNames', JSON.stringify(workoutNamesArray));
            localStorage.removeItem(workoutToDelete);
            goToPage('main');
        } else {
            toastr.warning('Workout Does Not Exist', 'Unsuccessful');
        }
    } else {
        toastr.warning('Workout Does Not Exist', 'Unsuccessful');
    }
}

/**
 * Retrieve the value of a parameter that was passed in a URL
 * @param parameterName     Name of the parameter to get the value for
 * @returns {*}             Value of the parameter (blank string if parameter was not found
 */
function getURLParameter(parameterName){
    // Get the current URL and all of its parameters
    var pageURL = decodeURI(window.location.search.substring(1));
    var URLVariables = pageURL.split('&');

    // Separate each of the parameters from their respective values
    for(var i = 0; i < URLVariables.length; i++) {
        var curParamName = URLVariables[i].split('=');
        // If we found the parameter we're looking for, return it immediately
        if (curParamName[0] == parameterName) {
            return curParamName[1];
        }
    }
    // The parameter was not found, return empty string
    return '';
}

// Stationary (must acknowledge) toastr options
var stationaryToast = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-bottom-full-width",
    "onclick": null,
    "showDuration": "0",
    "hideDuration": "0",
    "timeOut": "0",
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn"
};

// Temporary (auto-disappear) toastr options
var temporaryToast = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-bottom-full-width",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "2000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
