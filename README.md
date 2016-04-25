# yandexweather
Unofficial Yandex Weather API <br/>
NPM package for getting weather forecast from Yandex.

**Install:**
```
npm install yandexweather
```

**Usage:**
```
'use strict';

let yw = require('yandexweather');

yw.getWeatherForecast('Ashgabat', function(weather) {
  //weather.today - forecast for today
  //weather.forecast - forecast for the next 10 days (including today)
  console.log(JSON.stringify(weather, null, 2));
});
```

