'use strict';

let request = require('request');
let cheerio = require('cheerio');

function getWeatherForecast(city, callback) {
  let url = `https://pogoda.yandex.ru/${city}/details`;

  let weather = {};

  request(url, (error, response, body) => {
    if (!error) {
      let $ = cheerio.load(body);

      weather.today = {
        icon: getIcon($('span.current-weather__col_type_now').children('i').attr('class').split(' ')[2]),

        temp: $('div.current-weather__thermometer_type_now').text(),
        
        after0: {
          dayPart: dayPartToTm($('.current-weather__thermometer-name').eq(0).text()),
          temp: $('.current-weather__thermometer_type_after').eq(0).text(),
          icon: $('.current-weather__col_type_after').eq(0).children('i').attr('class').split(' ')[1]
        },

        after1: {
          dayPart: dayPartToTm($('.current-weather__thermometer-name').eq(1).text()),
          temp: $('.current-weather__thermometer_type_after').eq(1).text(),
          icon: $('.current-weather__col_type_after').eq(1).children('i').attr('class').split(' ')[1]
        },

        sunrise: $('.current-weather__info-row').eq(0).text().split('Закат: ')[0].split('Восход: ')[1],
        sunset: $('.current-weather__info-row').eq(0).text().split('Закат: ')[1],
        windSpeed: $('.current-weather__info-row').eq(1).children('span.wind-speed').text().split(' ')[0] + ' m/s' ,
        windDirection: windToTm($('.current-weather__info-row').eq(1).children('abbr').text()),
        humidity: $('.current-weather__info-row').eq(2).text().split(" ")[1],
        airPressure: $('.current-weather__info-row').eq(3).text().split(" ")[1] + ' mmHg'
      }

      weather.forecast = [];

      let dd = $('dd');
      for (let i = 0; i < 10; i++) {
        let day = parseDay(dd.eq(i));
        weather.forecast.push(day);
      }
      
    } else {
      weather = {result: false, reason: error};
    }

    return callback(weather);
  });
}

function parseDay(dd) {
  
  let tbody = dd.children('table').children('tbody');
  let tr = tbody.children('tr');
  
  let morning = tr.eq(0).children('td');
  let noon = tr.eq(1).children('td');
  let evening = tr.eq(2).children('td');
  let night = tr.eq(3).children('td');

  let forecast = {
    morning: {
      temp: morning.eq(0).children().eq(1).text(),
      icon: getIcon(morning.eq(1).children('div').children('i').attr('class').split(' ')[2]),
      airPressure: morning.eq(3).text(),
      humidity: morning.eq(4).text(),
      windDirection: windToTm(morning.eq(5).children('div').children('abbr').text()),
      windSpeed: morning.eq(5).children('div').children('span').text() + ' m/s',
    },

    noon: {
      temp: noon.eq(0).children().eq(1).text(),
      icon: getIcon(noon.eq(1).children('div').children('i').attr('class').split(' ')[2]),
      airPressure: noon.eq(3).text(),
      humidity: noon.eq(4).text(),
      windDirection: windToTm(noon.eq(5).children('div').children('abbr').text()),
      windSpeed: noon.eq(5).children('div').children('span').text() + ' m/s',
    },

    evening: {
      temp: evening.eq(0).children().eq(1).text(),
      icon: getIcon(evening.eq(1).children('div').children('i').attr('class').split(' ')[2]),
      airPressure: evening.eq(3).text(),
      humidity: evening.eq(4).text(),
      windDirection: windToTm(evening.eq(5).children('div').children('abbr').text()),
      windSpeed: evening.eq(5).children('div').children('span').text() + ' m/s',
    },

    night: {
      temp: night.eq(0).children().eq(1).text(),
      icon: getIcon(night.eq(1).children('div').children('i').attr('class').split(' ')[2]),
      airPressure: night.eq(3).text(),
      humidity: night.eq(4).text(),
      windDirection: windToTm(night.eq(5).children('div').children('abbr').text()),
      windSpeed: night.eq(5).children('div').children('span').text() + ' m/s',
    },

    sunrise: dd.children('div.forecast-detailed__sunrise').children('div').text(),

    sunset: dd.children('div.forecast-detailed__sunset').children('div').text()
  };

  return forecast;
}

function dayPartToTm (ru) {
  switch (ru) {
    case 'утром':
      return 'irden';
      break;
    case 'днём':
      return 'gündiz';
      break;
    case 'вечером':
      return 'agşam';
      break;
    case 'ночью':
      return 'gije';
      break;
    default:
      return '-';
  }
}

function windToTm (ru) {
  switch (ru) {
    case 'С':
      return 'Dg';
      break;
    case 'СВ':
      return 'Dg-Gd';
      break;
    case 'СЮ':
      return 'Dg-Go';
      break;
    case 'СЗ':
      return 'Dg-Gb';
      break;
    case 'В':
      return 'Gd';
      break;
    case 'ВС':
      return 'Gd-Dg';
      break;
    case 'ВЮ':
      return 'Gd-Go';
      break;
    case 'ВЗ':
      return 'Gd-Gb';
      break;
    case 'Ю':
      return 'Go';
      break;
    case 'ЮС':
      return 'Go-Dg';
      break;
    case 'ЮВ':
      return 'Go-Gd';
      break;
    case 'ЮЗ':
      return 'Go-Gb';
      break;
    case 'З':
      return 'Gb';
      break;
    case 'ЗС':
      return 'Gb-Dg';
      break;
    case 'ЗВ':
      return 'Gb-Gd';
      break;
    case 'ЗЮ':
      return 'Gb-Go';
      break;
    default:
      return '-';
  }
}

function getIcon (iconAttr) {
  let icons = [];
  icons['icon_thumb_bkn-p-ra-d'] = 'bkn_+ra_d.svg'; 
  icons['icon_thumb_bkn-p-ra-n'] = 'bkn_+ra_n.svg'; 
  icons['icon_thumb_bkn-p-sn-d'] = 'bkn_+sn_d.svg'; 
  icons['icon_thumb_bkn-p-sn-n'] = 'bkn_+sn_n.svg'; 
  icons['icon_thumb_bkn-m-ra-d'] = 'bkn_-ra_d.svg'; 
  icons['icon_thumb_bkn-m-ra-n'] = 'bkn_-ra_n.svg'; 
  icons['icon_thumb_bkn-m-sn-d'] = 'bkn_-sn_d.svg'; 
  icons['icon_thumb_bkn-m-sn-n'] = 'bkn_-sn_n.svg'; 
  icons['icon_thumb_bkn-d'] = 'bkn_d.svg'; 
  icons['icon_thumb_bkn-n'] = 'bkn_n.svg'; 
  icons['icon_thumb_bkn-ra-d'] = 'bkn_ra_d.svg'; 
  icons['icon_thumb_bkn-ra-n'] = 'bkn_ra_n.svg'; 
  icons['icon_thumb_bkn-sn-d'] = 'bkn_sn_d.svg'; 
  icons['icon_thumb_bkn-sn-n'] = 'bkn_sn_n.svg'; 
  icons['icon_thumb_ovc'] = 'ovc.svg'; 
  icons['icon_thumb_ovc-p-ra'] = 'ovc_+ra.svg'; 
  icons['icon_thumb_ovc-p-sn'] = 'ovc_+sn.svg'; 
  icons['icon_thumb_ovc-m-ra'] = 'ovc_-ra.svg'; 
  icons['icon_thumb_ovc-m-sn'] = 'ovc_-sn.svg'; 
  icons['icon_thumb_ovc-ra'] = 'ovc_ra.svg'; 
  icons['icon_thumb_ovc-ra-sn'] = 'ovc_ra_sn.svg'; 
  icons['icon_thumb_ovc-sn'] = 'ovc_sn.svg'; 
  icons['icon_thumb_ovc-ts-ra'] = 'ovc_ts_ra.svg'; 
  icons['icon_thumb_skc-d'] = 'skc_d.svg'; 
  icons['icon_thumb_skc-n'] = 'skc_n.svg'; 
  icons['icon_thumb_wnd'] = 'wnd.svg'; 

  return 'icons/' + icons[iconAttr];
}

exports.getWeatherForecast = getWeatherForecast;