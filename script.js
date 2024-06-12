function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => degree * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  const correctDistance = distance.toFixed(1);

  return correctDistance;
}

document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "9d7bf4a5ef834fe9a9037d8696385d60"; // Replace with your OpenCage API key

  const awais_latitide = 31.4902872;
  const awais_longitude = 74.3044764;


  const showMap = (awais_latitide, awais_longitude) => {

    let destination_latitude = awais_latitide;
    let destination_longitude = awais_longitude;

    document.getElementById("map").innerHTML = `<iframe width="600"
    height="450"
    style="border:0"
    loading="lazy"
    allowfullscreen
    src = "https://maps.google.com/maps?q=${awais_latitide},${awais_longitude}&hl=es;z=14&amp;output=embed"></iframe>`;
  };

  const showDistance = (latitude, longitude) => {
    let distance = calculateDistance(
      awais_latitide,
      awais_longitude,
      latitude,
      longitude
    );

    document.getElementById(
      "distance"
    ).innerText = `You are ${distance} km away from Awais Rao`;
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").innerText =
      "Geolocation is not supported by this browser.";
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

    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        if (
          data.results.length > 0 &&
          data.results[0].components._normalized_city
        ) {
          // document.getElementById("city").innerText = "City: " + data.results[0].components._normalized_city + ', ' +  data.results[0].components.county == undefined ? data.results[0].components.suburb : data.results[0].components.county + ', ' + data.results[0].components.historical_division + ', ' + data.results[0].components.state + ', ' + data.results[0].components.country;
          document.getElementById("city").innerText =
            "City: " + data.results[0].formatted;

          showMap(latitude, longitude);
          showDistance(latitude, longitude);
        } else {
          document.getElementById("city").innerText = "City not found";
        }
      })
      .catch((error) => {
        console.error("Error fetching location details:", error);
        document.getElementById("city").innerText =
          "Error fetching city information";
      });
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        document.getElementById("location").innerText =
          "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById("location").innerText =
          "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        document.getElementById("location").innerText =
          "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById("location").innerText =
          "An unknown error occurred.";
        break;
    }
  }
});






