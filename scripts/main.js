/**
 *  Authors:    Adam Smith, Daniel Ford
 *  Date:       2 Dec 2014
 */

var loadedWorkouts = document.getElementById('loadedWorkouts');
var workouts = JSON.parse(localStorage.getItem('workoutNames'));
var hasTempWorkout = false;

/**
 * For each workout stored in the Local Storage, create the DOM elements and add event handlers
 */
$.each(workouts, function(index) {
    if (workouts[index] == "temp") {
        hasTempWorkout = true;
    } else {
        var button = document.createElement('button');
        button.className = 'loadedWorkout center';
        button.innerHTML = workouts[index];
        button.onclick = function() {document.location.href = "edit.html?wo=" + workouts[index];};
        loadedWorkouts.appendChild(button);
    }
});

/**
 * If we see a Temp workout, automatically delete it
 */
if (hasTempWorkout) {
    workouts.remove("temp");
    localStorage.setItem('workoutNames', JSON.stringify(workouts));
    localStorage.removeItem("temp");
}

// Make the list of workouts sortable
$(document.getElementById('exercises')).sortable();
