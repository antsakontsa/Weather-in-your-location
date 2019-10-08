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
          let celsius = (temperature - 32) * (5 / 9);
          temperatureDegree.textContent = Math.floor(celsius);

          // Set animated icon
          setIcons(icon, document.querySelector('.icon'));
        });
    });

    function setIcons(icon, iconID) {
      const skycons = new Skycons({ color: 'white' });
      const currentIcon = icon.replace(/-/g, '_').toUpperCase();
      skycons.play();

      return skycons.set(iconID, Skycons[currentIcon]);
    }
  }
});
