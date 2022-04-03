## Shorts Deflector
Why does clicking on a Short on desktop bring up the stupid interface with no video scrubbing, harder to access comments, harder to access comment, etc?

Shorts Deflector is a browser extension that redirects youtube.com/shorts/xyz to youtube.com/watch?v=xyz.

Best paired with uBlock Origin, you can use it remove the Shorts item on the YouTube navigation menu permanently.

Chromium and Mozilla store pages coming soon™

### Option Table

#### Mozilla Firefox
|           Method/API           | Open in New Tab | Open in New Window | External Hyperlinks | Reload Page |    Left Click    |  Navigation Bar  |
|:------------------------------:|:---------------:|:------------------:|:-------------------:|:-----------:|:----------------:|:----------------:|
| Requests<br>browser.webRequest |    Redirects    |      Redirects     |      Redirects      |  Redirects  | Doesn't Redirect | Doesn't Redirect |
| Page Updates<br>browser.tabs   |     Redirect    |      Redirect      |       Redirect      |  Redirects  |     Redirects    |     Redirects    |

#### Chromium
|                Method/API                |  Open in New Tab | Open in New Window | External Hyperlinks | Reload Page |    Left Click    |  Navigation Bar  |
|:----------------------------------------:|:----------------:|:------------------:|:-------------------:|:-----------:|:----------------:|:----------------:|
| Requests<br>chrome.declaritiveNetRequest |     Redirects    |      Redirects     |      Redirects      |  Redirects  | Doesn't Redirect | Doesn't Redirect |
| Page Updates<br>chrome.tabs              | Doesn't Redirect |  Doesn't Redirect  |   Doesn't Redirect  |  Redirects  |     Redirects    |     Redirects    |