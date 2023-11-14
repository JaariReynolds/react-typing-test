https://JaariReynolds.github.io/react-typing-test
-

# Typi
### Monkeytype-inspired minimal typing test app created with Typscript, React, Firebase, Firestore. Still a work in progress.


README.md last updated: 14/11/2023

<details>
 <summary>Updates (click to view)</summary>

* v2.2.2
  * added a palette randomise button
  * added a few new palettes, shifted newer ones towards to the front
  * added a border to the "words" test option icon
  * added app logo next to app name 
* v2.2.1
  * fixed bug where punctuation checkbox was not working
  * updated more appropriate empty leaderboard text
* v2.2.0
  * app name: Typi
  * app logo/mascott: frog on keyboard
    * logo shown at low opacity in background of app 
  * added funbox modes: "emojis" and "alphabet" modes added
    * currently only submits to a leaderboard
    * does not update user average statistics or experience level 
  * test options styling overhaul 
  * styling changes to "averages" tab on dashboard - rows more defined
  * box shadow opacity reduced - much softer appearance
  * some component cleanups and refactors
* v2.1.5
  * more visually defined and appropriately responsive test options
* v2.1.4
  * selected colour palette now shown in the footer
* v2.1.3 
  * significantly reduced rerenders by syncing completion bar width changes to its width transition duration
  * swapped test types options around to match the transition of the completion bar
* v2.1.2
  * added a border around test options, shifted afk and capslock indicators accordingly
* v2.1.1
  * wpm graph x axis label added, y axis label moved more left, left and right graph margins equal
* v2.1.0
  * removed 'spacebar' from wpm calculation - wpm now purely based on correct letters per second * 5
* v2.0.2
  * reduced transition time for test letter colour change - flows better when resetting test
* v2.0.1
  * fixed component opacity issue when refocusing to the test after focus was on the reset button
* v2.0.0
  * authentication branch merged with master

 <br/>
 
- v1.0.0 - minimum viable product with functional typing test and results screen
</details>

<br/>

Currently contains:
* Standard randomised word-length and timed tests
  * checkboxes to include punctuation and numbers
* Funbox modes
  * currently includes: "emojis" and "alphabet"
* Colour palette selector! More lapettes to come
* Live WPM counter
* Live progress bar
* Smooth caret 
* WPM graph and statistics on results screen
* Leaderboards per test type and length on results screen
* Login and user dashboard
  * levelling and experience system (with currently no purpose)
  * overall and per-test averaged statistics
* LocalStorage user preferences
* Loading states for fetches/waiting periods

Work in progress:  
* Hover statistics for additional information
* User dashboard tab to show wpm/accuracy/consistency progression over x amount of games 
* Number and punctuation option overhaul, currently feels too random/inconsistent
* Firestore/firebase retries
* More funbox modes
* Rendering optimisations
  
  


