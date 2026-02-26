# Specification

## Summary
**Goal:** Fix the Spin the Wheel feature by removing the cooldown timer, restricting prizes to trophies and points only, and wiring trophy wins to Total Score and point wins to the Virtual Pet.

**Planned changes:**
- Remove the 20-minute cooldown/wait timer so the Spin button is immediately available after each spin
- Restrict wheel segments and outcome logic to only two reward types: trophies and points (remove all others)
- When trophies are won, add them to the user's Total Score and display the message "Keep playing and Spinning to earn more!"
- When points are won, add them to the Virtual Pet's progress/experience and display the message "Grow your pet by earning points from games and spin rewards!"
- Persist trophy and point rewards to the backend and update the relevant UI sections accordingly

**User-visible outcome:** Users can spin the wheel repeatedly without waiting, will only ever win trophies or points, see their Total Score update on trophy wins, and see their Virtual Pet progress update on point wins.
