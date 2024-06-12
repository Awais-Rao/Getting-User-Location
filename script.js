document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = "9d7bf4a5ef834fe9a9037d8696385d60"; // Replace with your OpenCage API key

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerText = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // const latitude = 30.996899;
        // const longitude = 74.2376667;

        // const latitude = 31.5759538;
        // const longitude = 74.3032571;

        // const latitude = 31.465913091975903;
        // const longitude = 74.25604779400174;

        document.getElementById("latitude").innerText = "Latitude: " + latitude;
        document.getElementById("longitude").innerText = "Longitude: " + longitude;

        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {

                console.log(data);

                if (data.results.length > 0 && data.results[0].components._normalized_city) {
                    // document.getElementById("city").innerText = "City: " + data.results[0].components._normalized_city + ', ' +  data.results[0].components.county == undefined ? data.results[0].components.suburb : data.results[0].components.county + ', ' + data.results[0].components.historical_division + ', ' + data.results[0].components.state + ', ' + data.results[0].components.country;
                    document.getElementById("city").innerText = "City: " + data.results[0].formatted;
                } else {
                    document.getElementById("city").innerText = "City not found";
                }
            })
            .catch(error => {
                console.error("Error fetching location details:", error);
                document.getElementById("city").innerText = "Error fetching city information";
            });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                document.getElementById("location").innerText = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                document.getElementById("location").innerText = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                document.getElementById("location").innerText = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                document.getElementById("location").innerText = "An unknown error occurred.";
                break;
        }
    }
});
