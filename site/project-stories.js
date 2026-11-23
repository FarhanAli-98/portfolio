(() => {
  const story = (layout, color, heading, points) => ({ layout, color, heading, points });
  window.PORTFOLIO_STORIES = {
    'sukuk-capital': story('app', '#90d5b3', 'From funding to portfolio activity', [
      ['Browse', 'Compare Sukuk opportunities and inspect the terms before investing.'],
      ['Fund', 'Connect the Flutter wallet to payment and custodian banking workflows.'],
      ['Release', 'Maintain the app’s release pipeline with GitHub Actions and Shorebird.'],
    ]),
    retaildesk: story('site', '#f3cc83', 'A day on the shop floor', [
      ['Stock', 'Find products and review what is available before opening checkout.'],
      ['Checkout', 'Build a basket and follow the transaction through the live workspace.'],
    ]),
    'dispatch-ops': story('workflow', '#8ec6ff', 'Follow a delivery', [
      ['Assign', 'Choose a driver for a fictional order in the dispatch queue.'],
      ['Confirm', 'Record pickup and validate the recipient code at drop-off.'],
      ['Recover', 'Reopen a failed delivery and review the recorded status history.'],
    ]),
    entertainment: story('app', '#ee94b4', 'The member experience', [
      ['Discover', 'Browse offers for dining, shopping, and travel.'],
      ['Redeem', 'Follow the offer and coupon flows I helped develop and maintain.'],
      ['Release', 'Support application service integration and reliability fixes.'],
    ]),
    'quit-must': story('app', '#b7aaff', 'AI on the device', [
      ['Classify', 'Connect image-model outputs to Flutter screens.'],
      ['Run in the background', 'Integrate prediction results with background processing.'],
      ['See the app', 'The published Google Play listing includes the performance report shown here.'],
    ]),
    bespokely: story('app', '#e4bb93', 'A platform for guest experiences', [
      ['Configure', 'Reuse Flutter building blocks across hospitality experiences.'],
      ['Connect', 'Integrate application APIs, payment services, and third-party features.'],
      ['See an example', 'The Art Hotel image is an example guest app published by Bespokely.'],
    ]),
    vaulta: story('site', '#7be3e7', 'The product site', [
      ['Understand', 'See how the public page introduces the cross-platform download manager.'],
      ['Explore', 'Open the site or inspect its landing-page source.'],
    ]),
    'grant-cms': story('workflow', '#c3d58c', 'From legacy record to published page', [
      ['Import', 'Bring a fictional grant into the editorial workspace.'],
      ['Review', 'Inspect and publish the draft with its review history.'],
      ['Redirect', 'Follow the old URL to the new public page.'],
    ]),
    'investment-wallet': story('app', '#89c8bd', 'Reconcile a demo wallet', [
      ['Deposit', 'Add sample cash and check the available balance.'],
      ['Allocate', 'Move sample money into fictional holdings using exact minor units.'],
      ['Reconcile', 'Compare the activity feed with cash and holdings.'],
    ]),
    'giving-ops': story('workflow', '#f0a987', 'What happens after a payment fails', [
      ['Schedule', 'Advance the demo clock to make recurring gifts due.'],
      ['Retry', 'Trigger a simulated gateway failure and rerun the scheduler.'],
      ['Reconcile', 'Inspect receipts and confirm the retry did not create a duplicate charge.'],
    ]),
    'transaction-review': story('analysis', '#8abaff', 'Inspect a review score', [
      ['Later test window', 'The demo evaluates the model on a later batch of synthetic wallet activity.'],
      ['Score drivers', 'The example view explains which input features pushed a score higher.'],
      ['Queue size', 'Compare review thresholds to see how the investigation queue changes.'],
    ]),
    'support-assistant': story('chat', '#92afff', 'Follow the answer back to its source', [
      ['Question', 'Ask where to find a donation receipt in the fictional help center.'],
      ['Answer', 'The demo selects and quotes a relevant passage using BM25.'],
      ['Clarification', 'When the evidence is weak, the assistant asks for more detail.'],
    ]),
    kynami: story('system', '#acdb89', 'Recurring donation processing', [
      ['Donation', 'Capture gift details and recurring preferences in the mobile flow.'],
      ['Scheduled job', 'Process due subscriptions with TypeScript Cloud Functions.'],
      ['Subscription', 'Connect payment events back to the subscription record.'],
    ]),
    'devex-delivery': story('workflow', '#91d5f4', 'A driver’s order lifecycle', [
      ['Order status', 'Integrate order and driver status with the app’s API.'],
      ['Confirmation', 'Support the driver’s delivery completion workflow.'],
      ['Release', 'Test and release changes to the mobile app.'],
    ]),
    'flutter-product-assessment': story('system', '#9fbcff', 'Inside the Flutter assessment', [
      ['State', 'Manage product-listing state with Riverpod.'],
      ['Network', 'Use Dio for requests, including product deletion.'],
      ['Environments', 'Separate development, staging, and production entry points.'],
    ]),
    'fusion-torch': story('system', '#f2d08c', 'Follow the native call', [
      ['Flutter', 'Tap the switch in the app interface.'],
      ['Platform bridge', 'Call the native Kotlin implementation.'],
      ['Android', 'Turn the device flashlight on or off.'],
    ]),
    'agent-control-room': story('review', '#b6a0fb', 'Review an agent action', [
      ['Waiting step', 'Locate the operation that requires a human decision.'],
      ['Evidence', 'Review the proposed action and the environment it would run in.'],
      ['Audit trail', 'The design records who decided and when, using fictional runs.'],
    ]),
    'distributed-systems': story('system', '#8bd3e7', 'Trace a slow request', [
      ['Topology', 'Inspect connected services and current incidents.'],
      ['Release timeline', 'Compare a change with latency and error-budget signals.'],
      ['Representative trace', 'Identify where time was spent in the sample request.'],
    ]),
    'investment-portfolio': story('gallery', '#a5b5f6', 'An investor’s questions', [
      ['Value', 'Check the sample balance and the last valuation time.'],
      ['Position', 'Inspect holdings and distinguish available cash from investments.'],
      ['Allocation', 'See how the fictional holdings are distributed.'],
    ]),
    'user-access': story('review', '#aacaff', 'Before changing a role', [
      ['Roster', 'Inspect the team and pending invitations.'],
      ['Permissions', 'Preview effective access before approving a role change.'],
      ['History', 'Review how the proposed audit panel records the change.'],
    ]),
    'policy-qa': story('chat', '#a8b8ff', 'Check the policy evidence', [
      ['Question', 'Can I book a hotel above the sample $180 limit?'],
      ['Answer', 'The example explains when manager approval is required.'],
      ['Evidence', 'The design points to the rule, its edition, and the related exception procedure.'],
    ]),
    'visual-inspection': story('review', '#efbe91', 'Inside the review screen', [
      ['Photo evidence', 'Inspect an illustrative parcel and the marked corner damage.'],
      ['Coverage', 'Upload front, top, and back photos and see which recommended views are missing.'],
      ['Decision', 'Record a reviewer decision and see it persist across restarts.'],
    ]),
    'incident-triage': story('workflow', '#c4a6ff', 'Reconstruct the incident', [
      ['Deploy', 'See when the fictional checkout service release occurred.'],
      ['Signal', 'Compare the latency increase with the payment wait-time alert.'],
      ['Review', 'An engineer checks the evidence before confirming the incident assessment.'],
    ]),
    'voice-intake': story('review', '#c392f2', 'From a call to a ticket', [
      ['Listen', 'Review the sample English and Urdu call segments by timestamp.'],
      ['Draft', 'Inspect the proposed delivery issue and rescheduling request.'],
      ['Confirm', 'Check the uncertain reference against the call before submitting.'],
    ]),
    'delivery-eta': story('map', '#8fc8ff', 'Make the uncertainty visible', [
      ['Assigned route', 'Follow fictional order DL-604 on the dispatch map.'],
      ['Arrival estimate', 'Compare 16:42 with the illustrated 16:36–16:51 arrival window.'],
      ['Decision', 'Use the window to decide when a follow-up is useful.'],
    ]),
    'nearby-offers': story('map', '#83d3a9', 'Why an offer appears', [
      ['Eligibility', 'Start with a fictional catalog filtered to a two-kilometer radius.'],
      ['Ranking', 'Compare nearby places by relevance and availability.'],
      ['Explanation', 'See the reason shown alongside each sample recommendation.'],
    ]),
    'inventory-forecast': story('analysis', '#90b9f2', 'From forecast to reorder', [
      ['Range', 'Compare a week of synthetic demand estimates and their uncertainty.'],
      ['Inventory position', 'Reconcile on-hand units and confirmed inbound stock.'],
      ['Order size', 'The illustrated 56-unit order includes the buffer and existing stock.'],
    ]),
    'edge-classification': story('app', '#9faefc', 'What the offline model would show', [
      ['Input', 'Classify a sample headline on the device.'],
      ['Scores', 'Compare the illustrated probabilities for four categories.'],
      ['Abstain', 'The preview requests review when the highest score falls below the threshold.'],
    ]),
    'rollout-experiment': story('analysis', '#c3a0fa', 'Read the rollout decision', [
      ['Activation', 'Compare sample seven-day activation in control and checklist groups.'],
      ['Uncertainty', 'Read the interval alongside the illustrated lift.'],
      ['Guardrails', 'Consider setup errors and abandonment before expanding the rollout.'],
    ]),
    'subscription-cohorts': story('analysis', '#83e3d3', 'Explain the change in revenue', [
      ['Tenure', 'Compare synthetic retention by months since signup.'],
      ['Revenue bridge', 'Reconcile opening MRR with new revenue, expansion, contraction, and churn.'],
      ['Closing MRR', 'Confirm the illustrated closing balance against the movement totals.'],
    ]),
    'mobility-access': story('map', '#83ccbd', 'Compare timetable scenarios', [
      ['Baseline', 'See a fictional corridor’s current 45-minute access to clinics.'],
      ['Earlier trip', 'Compare access after moving the first bus earlier.'],
      ['Timed transfer', 'See the illustrated change for a coordinated connection.'],
    ]),
    'marketplace-liquidity': story('analysis', '#f1bb80', 'Find the largest funnel drop', [
      ['Demand', 'Start with qualified requests in four fictional service zones.'],
      ['Response', 'Track provider eligibility and whether a provider responds.'],
      ['Bookings', 'Compare completed bookings by zone to narrow the next investigation.'],
    ]),
  };
})();
