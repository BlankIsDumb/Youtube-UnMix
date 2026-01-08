## A Simple chrome extension that automatically redirects you away from Youtube's Automix and Radio

Very simple extension, uses MV3, minimal effect on browser performance
What it does:
- only operates under youtube URLs
- if current URL contains `&list=` AND `&start_radio=1`, trim that URL and redirect to only the video page

This helps improves the TAB's performance for a user with multiple user scripts, as it skips loading the long playlist html, also stop autoplay from working.

## Installation
- Clone the repo ```git clone https://github.com/BlankIsDumb/Youtube-UnMix.git```
- Navigate to your chromium browser's extension page
- Click `Load Unpacked` 
- Navigate to the cloned repo's directory and select it
- Profit
