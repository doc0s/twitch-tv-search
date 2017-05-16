(function() {
    'use strict';

    // Set client ID
    var clientIdInput = document.getElementById("client-id");

    // Store current results data
    var model;

    var submit = function (url) {
        if(!url) return;

        // Fetch jsonp data and call the call back
        var script = document.createElement("script");
        script.src = url;
        document.body.appendChild(script);
        document.body.removeChild(script);
    };

    // Compose full url for Twitch jsonp request.
    // Return undefined when client ID is not specified.
    var composeUrl = function(query) {
        if (clientIdInput.value && clientIdInput.value !== '') {
            // Get jsonp data with callback name: handle_callback
            return "https://api.twitch.tv/kraken/search/streams?callback=handle_callback&q="
                + encodeURIComponent(query) + "&client_id=" + clientIdInput.value;
        } else {
            alert('Please specify Client ID!!!');
            return;
        }
    };

    // Twitch api returns 10 items at maximum all at once.
    // The url for prev/next page is stored in response._links as:
    // https://api.twitch.tv/kraken/search/streams?limit=10&offset=10&q=query-term
    // This method extracts the offset value from url above.
    var getOffset = function(url) {
        // Create parameter array like ["limit=10", "offset=10", "q=query-term"]
        var pair  = url.slice(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < pair.length; i++) {
            // Find kv with ["offset", "10"]
            var kv = pair[i].split('=');
            if (kv[0] === "offset") {
                console.log("offset = " + kv[1]);
                return kv[1];
            }
        }

    };

    // Create and append dom element from a twitch stream.
    var showResultRow = function(stream) {
        var row = document.createElement('div');
        var resultsList = document.getElementById('results-list');

        row.setAttribute("class", "result-row");
        row.innerHTML = "<a href='" + stream.channel.url + "'>" +
                                "<div class='result-container'>" +
                                    "<div class='img-container'><p><img class='thumbnail' src='" + stream.preview.medium + "'/></p></div>" +
                                    "<div class='stream-info'>" +
                                        "<div class='display-name'>" + (stream.channel.display_name || "No Display name") + "</div>" +
                                        "<div class='game-name'>" + (stream.game || "No Game name") + " - " + stream.viewers + " viewers</div>" +
                                        "<div class ='status'>" + (stream.channel.status || "No description available...") + "</div>" +
                                    "</div>" +
                                "</div>" +
                        "</a>";

        resultsList.appendChild(row);
    };

    var showNoResult = function () {
        var resultsList = document.getElementById('results-list');
        resultsList.innerHTML = "<div class='no-results'>Sorry. No results available...</div>";
    };

    var clearResult = function() {
        var resultsList = document.getElementById('results-list');
        while(resultsList.firstChild) {
            resultsList.removeChild(resultsList.firstChild)
        }
    };

    var showResult = function(res) {
        var total = res._total;
        var links = res._links;
        var streams = res.streams;

        clearResult();

        // Update result controls
        document.getElementById('results-total').innerHTML = "Total Results: " + total;
        var prevButton = document.getElementById('prev-button');
        prevButton.style.visibility = links.prev ? "visible" : "hidden";

        var nextButton = document.getElementById('next-button');
        nextButton.style.visibility = (total > getOffset(links.next)) ? "visible" : "hidden";

        var pageElement = document.getElementById('page');
        var pages = Math.ceil(total / 10);
        var currentIndex = (total === 0) ? 0 :  (getOffset(links.next) / 10);
        pageElement.innerHTML =  currentIndex + " / " + pages;


        // Update results list element
        for (var i = 0; i < streams.length; i++) {
            showResultRow(streams[i]);
        }
        if(streams.length === 0) {
            showNoResult();
        }
    };


    // Setup UI event listeners
    (function() {
        var queryForm = document.getElementById('query-form');

        queryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var queryInput = document.getElementById('query-input'),
                queryValue = queryInput.value;

            submit(composeUrl(queryValue));
        });


        var prevButton = document.getElementById('prev-button');
        var nextButton = document.getElementById('next-button');
        prevButton.addEventListener('click', function() {
            submit(model._links.prev + "&client_id=" + clientIdInput.value + "&callback=handle_callback");
        }, false);

        nextButton.addEventListener('click', function() {
            submit(model._links.next + "&client_id=" + clientIdInput.value + "&callback=handle_callback");
        }, false);
    })();

    var handleCallback = function(response) {
        console.log(JSON.stringify(response));
        model = response;
        showResult(response);
    }

    // Set the callback function in global object so that jsonp call can access it
    window.handle_callback = handleCallback;
})();


