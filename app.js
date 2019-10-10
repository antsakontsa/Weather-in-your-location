window.addEventListener('load', () => {
  let lat;
  let long;
  let temperatureDescription = document.querySelector(
    '.temperature-description'
  );
  let temperatureDegree = document.querySelector('.temperature-degree');
  let locationTimezone = document.querySelector('.location-timezone');
  let temperatureSection = document.querySelector('.temperature');
  const temperatureSpan = document.querySelector('.temperature span');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      long = position.coords.longitude;

      // Proxy is needed, because for some reason daksky API won't allow localhosting
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/d1926605e2929808d5389bcf0cbaa698/${lat},${long}`;
      const api_url_location = `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${long}&key=AIzaSyBS8Z-8AK_LrD_4VR-G5OecJgwv1G3CPhg`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          const { temperature, summary, icon } = data.currently;

          console.log(data);

          // Set DOM elements with corresponding data
          temperatureDegree.textContent = temperature;
          temperatureDescription.textContent = summary;
          locationTimezone.textContent = data.timezone;

          // Count Celsius from Fahrenheit
          let celsius = Math.floor((temperature - 32) * (5 / 9));
          temperatureDegree.textContent = celsius + ' C';

          // Background colors for different degreeses
          if (celsius >= 20) {
            document.body.style.backgroundColor = '#f03224';
          } else if (celsius >= 15 && celsius < 20) {
            document.body.style.backgroundColor = '#ff6100';
          } else if (celsius >= 10 && celsius < 15) {
            document.body.style.backgroundColor = '#b54e1f';
          } else if (celsius > 0 && celsius < 10) {
            document.body.style.backgroundColor = '#2f96a3';
          } else if (celsius <= 0) {
            document.body.style.backgroundColor = '#257099';
          }

          // Set animated icon
          setIcons(icon, document.querySelector('.icon'));
        });

      // Set location into HTML
      async function getLocation() {
        // Fetch the data
        const response2 = await fetch(api_url_location);

        // Convert data into JSON
        const data2 = await response2.json();

        console.log(data2);

        // Insert data into HTML
        document.querySelector('.city').textContent =
          data2.results[0].formatted_address;
      }

      getLocation();
    });

    function setIcons(icon, iconID) {
      const skycons = new Skycons({ color: 'white' });
      const currentIcon = icon.replace(/-/g, '_').toUpperCase();
      skycons.play();

      return skycons.set(iconID, Skycons[currentIcon]);
    }
  }
});
