# Roadmap: Public Share Downloads - Frontend

This roadmap adds a public share experience at  https://sky.digiapps.com.co/shares/:token`. The query parameter `?dl=1` requests an automatic download only after access checks pass.

## 1. Routing and Page Data

- [ ] Add a public route matchin `/shares/:tokn`
- [ ] Read and validate the route token and the optiona `dl1` query parameter
- [ ] Fetch share metadata fro `GET /api/public/shares/:tokn`
- [ ] Render the share name, type, and file size; do not expose storage object keys or presigned URLs
- [ ] Show distinct UI states for loading, unavailable/expired, password required, and unexpected error
- [ ] Use a generic unavailable message for invalid, revoked, and expired tokens.

## 2. Password-Protected Shares

- [ ] Show a password form only whe `is_password_protectd` is true
- [ ] Submit the password t `POST /api/public/shares/:token/veriy` over HTTPS
- [ ] Let the backend establish the protected-download session (recommended: HttpOnly cookie); do not store the password or access token in local/session storage
- [ ] Clear the password input after submission and show a clear invalid-password message
- [ ] Apply retry handling and a rate-limit-friendly cooldown after repeated failures.

## 3. Download Interaction

- [ ] Use an ordinary browser navigation t `GET /api/public/shares/:token/contet` for file delivery
- [ ] Do not us `feth` `Blb`, or in-memory buffering to download the file
- [ ] Provide a visible Download button for every accessible file share
- [ ] Whe `?dl1` is present, navigate to the content endpoint automatically after metadata and any password verification succeed
- [ ] Prevent repeated automatic navigations on rerender, back/forward navigation, or retry loops
- [ ] Provide feedback such as “Your download is starting…” with a manual Download button as fallback
- [ ] On a content-endpoint authorization/error response that can be detected by the application, return the user to the appropriate share state and offer retry.

## 4. Folder Shares

- [ ] Agree with the backend on the first-release experience before building UI
- [ ] If individual downloads are supported, list files with name, size, and per-file Download controls
- [ ] If asynchronous ZIP archives are supported later, show preparation/progress, ready, failed, and expired-archive states
- [ ] Do not trigger multiple automatic browser downloads for a folder fro `?dl1`.

## 5. UX, Accessibility, and Safety

- [ ] Make loading/error/status text available to screen readers with an appropriate live region
- [ ] Keep keyboard focus on the password error or status message when it changes
- [ ] Ensure the Download button has an accessible name containing the file name where useful
- [ ] Make the mobile layout usable for long filenames and large size values
- [ ] Do not inject file names as HTML; render them as text
- [ ] Do not display presigned URLs in the page, browser address bar, analytics events, or client logs.

## 6. Analytics and Tests

- [ ] Track privacy-safe UI events: share page viewed, password prompt shown, password verified, download requested, and visible error
- [ ] Do not send passwords, tokens, presigned URLs, or full share URLs to analytics
- [ ] Test public, expired, revoked, and password-protected shares
- [ ] Test direct page load with and withou `?dl1`
- [ ] Test the manual fallback when automatic download is blocked or fails
- [ ] Test keyboard-only and screen-reader flows
- [ ] Test current Chrome, Safari, Firefox, and mobile browsers with small and large files.

## API Dependencies

| Purpose | Endpoint | Frontend behavior |
| --- | --- | --- |
| Share metadata  `GET /api/public/shares/:tokn` | Render public details and access state. |
| Password verification  `POST /api/public/shares/:token/veriy` | Establish protected-share access without exposing credentials in URLs. |
| File delivery  `GET /api/public/shares/:token/contet` | Navigate the browser; backend redirects to R2 or streams the file. |
   