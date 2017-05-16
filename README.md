# Twitch TV search web app sample

## Details
* This aims for creating webapp with vanilla JS. It doesn't use any libraries like jQeury, Bootstrap, AngularJS or eve ES6(including Promise)
* Second condition I adopted is to use jsonp api to avoid CORS. I implemented a standard way to load jsonp:
    * Create script tag, set the search api call url to src attribute and attatch/remove the element
* You need to create and input (copy&paste) client ID on the top left box
    * To create client ID of Twitch TV, please see https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843
* The app is hosted at: https://doc0s.github.io/twitch-tv-search/

## Going forward
* Inplement page cache and reuse the result with the same query (Currently "Prev" action causes the api call again)
* The results composition was done in a loop which can be improved with "setTimeout"
* Show loading indicator until the response arrives
* Support responsive design