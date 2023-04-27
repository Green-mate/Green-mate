const convert = require('xml-js');
const request = require('request');
import { SERVICE_KEY } from './service-key';
const HOST = 'http://api.nongsaro.go.kr/service/garden/gardenList';
const service_key = SERVICE_KEY;
const DETAIL_HOST = 'http://api.nongsaro.go.kr/service/garden/gardenDtl';

module.exports = function (callback) {
  const pageNo = 1;
  const numOfRows = 100;
  const $requestUrl = `${HOST}?apiKey=${service_key}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  request.get($requestUrl, (err, response, body) => {
    if (err) {
      console.log(`err=>${err}`);
      callback(err);
    } else {
      if (response.statusCode == 200) {
        var plantData = [];
        var result = body;
        var data = convert.xml2json(result, { compact: true, spaces: 4 });
        var data = JSON.parse(data);
        var keys = Object.keys(data.response.body.items.item);
        const regex = /(https:\/\/.*?\.jpg)/;

        for (var i = 0; i < keys.length; i++) {
          var plantNumber = data.response.body.items.item[i].cntntsNo['_cdata'];
          var plantName = data.response.body.items.item[i].cntntsSj['_cdata'];
          var plantImageUrl =
            data.response.body.items.item[i].rtnFileUrl['_cdata'];
          // 유효한 URL이 아닌 경우 건너뛰기
          if (!regex.test(plantImageUrl)) {
            continue;
          }

          var minPrice = 10000;
          var maxPrice = 20000;
          var randomPrice =
            Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

          plantData.push({
            product_code: plantNumber,
            product_name: plantName,
            productImage: plantImageUrl.match(regex)[1],
            product_price: `${Math.floor(randomPrice / 1000) * 1000}원`,
          });
        }
        callback(null, plantData);
      } else {
        callback(response.statusMessage);
      }
    }
  });
};
