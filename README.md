# Introduction

Why does clicking on a YouTube Short on a desktop bring up the mobile-optimized interface? With no video scrubbing, harder to access comments, less accessible view count, and more, it makes no sense to use on a desktop.

Shorts Deflector is an extension that allows you to automatically OR manually change YouTube Shorts to the normal desktop interface. This is accomplished by redirecting you from www.youtube.com/shorts/xyz to www.youtube.com/watch?v=xyz.

By using the convenient "Switch to Desktop Interface" button, you can continue to watch YouTube Shorts normally while having an easy way to switch to the desktop format.

# Screenshots
<details>
  <summary><b>Chromium User Interface w/ Light Mode</b></summary>
  <img src="./assets/promo/Shorts%20Deflector%20Chromium%20Light.png">
</details>

<details>
  <summary><b>Chromium User Interface w/ Dark Mode</b></summary>
  <img src="./assets/promo/Shorts%20Deflector%20Chromium%20Dark.png">
</details>

<details>
  <summary><b>Firefox User Interface w/ Light Mode</b></summary>
  <img src="./assets/promo/Shorts%20Deflector%20Firefox%20Light.png">
</details>

<details>
  <summary><b>Firefox User Interface w/ Dark Mode</b></summary>
  <img src="./assets/promo/Shorts%20Deflector%20Firefox%20Dark.png">
</details>

# Home Page
[https://shortsdeflector.attituding.live/](https://attituding.github.io/Shorts-Deflector/)

# API Table
#### [Chromium](https://chrome.google.com/webstore/detail/shorts-deflector/gilmponliddppjjcfjmanmmfgiilikhg)
|                Method/API                |  Open in New Tab | Open in New Window | External Hyperlinks | Reload Page |    Left Click    |  Navigation Bar  |
|:----------------------------------------:|:----------------:|:------------------:|:-------------------:|:-----------:|:----------------:|:----------------:|
| Requests<br>chrome.declaritiveNetRequest |     Redirects    |      Redirects     |      Redirects      |  Redirects  | Doesn't Redirect | Doesn't Redirect |
| Page Updates<br>chrome.tabs              | Doesn't Redirect |  Doesn't Redirect  |   Doesn't Redirect  |  Redirects  |     Redirects    |     Redirects    |

#### [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/shorts-deflector/)
|           Method/API           | Open in New Tab | Open in New Window | External Hyperlinks | Reload Page |    Left Click    |  Navigation Bar  |
|:------------------------------:|:---------------:|:------------------:|:-------------------:|:-----------:|:----------------:|:----------------:|
| Requests<br>browser.webRequest |    Redirects    |      Redirects     |      Redirects      |  Redirects  | Doesn't Redirect | Doesn't Redirect |
| Page Updates<br>browser.tabs   |     Redirects   |      Redirects      |       Redirect     |  Redirects  |     Redirects    |     Redirects    |