https://JaariReynolds.github.io/react-typing-test
-

README.md last updated: 9/11/2023
<details>
<summary>Updates</summary>
* v2.0.1 - fixed component opacity issue when refocusing to the test after focus was on the reset button
* v2.0.0 - authentication branch merged with master
* v1.0.0 - minimum viable product with functional typing test and results screen
</details>

Monkeytype-inspired minimal typing test app created with Typscript, React, Firebase, Firestore. Still a work in progress.

* Currently contains:
  * Colour palette selector! More palettes to come
  * Word length and timed tests
  * Number and punctuation inclusions/additions to the test
  * WPM counter that updates dynamically during the test
  * Completion/progress bar that updates dynamically during the test
  * Smooth caret during the test
  * WPM graph and general typing test statistics on completion
    * (wpm, accuracy, consistency, errors)
  * Test words scroll to reveal more words as the test is progressed
  * LocalStorage user preferences
  * Login and user dashboard 
  * per-testType summaries of statistics
  * Per-testType leaderboards
  * Loading states for fetches/waiting periods
  * Levelling/experience system
    * experience per test based on overall performance
  * Clean up styling of results screen wpm graph

- Work in progress:  
  * Results screen statistics hover for additional information
  * User dashboard tab to show wpm/accuracy/consistency progression over x amount of games 
  * Firestore/firebase retries
  * Number and punctuation option overhaul, currently feels too random/inconsistent
  * A few visual bugs 
  * Rendering optimisations
  


