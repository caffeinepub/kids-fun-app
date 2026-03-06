# Specification

## Summary
**Goal:** Fix the Spin the Wheel feature by enforcing a 20-minute cooldown between spins and routing any points earned directly to the Virtual Pet.

**Planned changes:**
- Backend: Record the timestamp of each spin per user and reject new spin attempts until 20 minutes have elapsed, returning the remaining cooldown in seconds.
- Backend: When a spin yields points, add them exclusively to the Virtual Pet's points/experience field (not to any other score or reward field).
- Frontend (SpinWheelPage): Disable the spin button and show a live MM:SS countdown when the cooldown is active; re-enable the button automatically when it expires.
- Frontend (SpinWheelPage): After a points-winning spin, call only the Virtual Pet update mutation with the earned points — no other score or reward mutation.

**User-visible outcome:** Users must wait 20 minutes between spins and will see a countdown timer on the disabled spin button. Points won from spinning are reflected on the Virtual Pet Hub page.
