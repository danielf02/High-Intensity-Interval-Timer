High-Intensity-Interval-Timer
=============================

HIITimer Web Application

Authors:  Daniel Ford
          Adam Smith
          
Date:     12/6/2014

Application Description:
This web application is used to easily manage and execute workouts containing any number of exercises.
This was an application built for CS530 Designing User Interfaces at Drexel University. It was
coded in HTML5, Javascript, CSS3, and uses the JQuery and toastr library for messaging.

Application Goals:
This program was created for two reasons--necessity and school. Since we often perform high-intensity interval training, we found there to be to application out there that was simple, easy-to-use, and not too complex with a bunch of features you don't wan't or will never use. This application is designed to be so simple, that even the newest of new users can open and immediately know how to use. Coincidentally, we needed an idea of an application for a school project. The scope of this application, for now, is limited to desktop/laptop use. However, we fully intend of bringing this to mobile platforms as well (in a browser, and potentially in a mobile application for Android).

How to install:
Using this application is very simple! To do so, you must simply download all contents of this repository
to a local drive. From there, open main.html in any Internet browser of your choosing. This site has been
tested in all major browsers.

How to use:
As we stated in the application's goals, this is so simple to use, this section can probably safely be skipped. If you would like instructions, however, they are as follows:
1. Create a new Workout by clicking the 'Create New Workout' button at the top of the main page's screen.
2. On the 'New Workout' page, enter a workout name at the very top.
3. For each exercise you want to add, enter the exercise name, active time (how long you want to perform the exercise for) and the rest time, then click 'Add Exercise'
4. After adding all of your exercises, you may click and drag them to move them around in the list. Alternatively, you may drag them to the box at the bottom to delete them from the list.
5. When you are finished, press the 'Save Workout' button to save the workout to local storage. You may 'Begin Workout' without saving, but you will be notified that the workout you just created will become unavailable afterwards, as it will be a temporary workout.
6. After beginning the workout, you will be directed to the Timer page. Select the number of repetitions you plan on completing by using the input box in the middle of the screen. That is, how many times you wish to repeat all exercises in the workout.
7. When you are ready, press 'Start' to begin the workout. It will begin with the active portion of the exercise that is at the box at the top of the screen labelled 'Current Exercise'.
8. When the time is up, the exercises will automatically switch to rest and active, and to a new exercise. Additionally, workouts will keep cycling through until the number of repetitions selected have all been completed.
9. When the workout it complete, you will be directed to the main page.
