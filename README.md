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
  console.log(JSON.stringify(weather, null, 2));
});
```

