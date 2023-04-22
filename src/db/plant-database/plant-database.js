const convert = require('xml-js');
const request = require('request');
const express = require('express');

const HOST = 'http://api.nongsaro.go.kr/service/garden/gardenList';
const SERVICE_KEY = '20230421LJQ8SWJCLQVQU9AUCMTXKW';

const app = express();

app.get('/', (req, res) => {
  const pageNo = req.query.pageNo || 1; // 페이지 번호, 기본값 1
  const numOfRows = req.query.numOfRows || 100; // 한 페이지당 데이터 수, 기본값 100
  const $requestUrl = `${HOST}?apiKey=${SERVICE_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

  request.get($requestUrl, (err, response, body) => {
    if (err) {
      console.log(`err=>${err}`);
      res.status(500).send('Internal Server Error');
    } else {
      if (response.statusCode == 200) {
        var plantData = [];
        var result = body;
        var data = convert.xml2json(result, { compact: true, spaces: 4 });
        var data = JSON.parse(data);
        var keys = Object.keys(data.response.body.items.item);
        const regex = /(https:\/\/.*?\.jpg)/;
        const plantTypeArray = [
          '관목형',
          '직립형',
          '직립형',
          '직립형',
          '관목형',
          '관목형',
          '관목형',
          '로제트형',
          '풀모양',
          '덩굴성',
          '관목형',
          '관목형',
          '관목형',
          '풀모양',
          '관목형',
          '풀모양',
          '풀모양',
          '로제트형',
          '직립형,관목형',
          '관목형',
          '관목형,덩굴성',
          '풀모양,로제트형',
          '덩굴성',
          '관목형',
          '직립형,관목형',
          '풀모양',
          '직립형,다육형',
          '직립형,관목형',
          '관목형,풀모양,다육형',
          '풀모양',
          '관목형',
          '관목형',
          '관목형',
          '관목형',
          '관목형',
          '직립형,관목형',
          '관목형',
          '관목형',
          '직립형,관목형',
          '관목형',
          '관목형',
          '관목형',
          '직립형,관목형',
          '직립형,관목형',
          '관목형',
          '직립형,관목형',
          '풀모양',
          '풀모양',
          '직립형,관목형',
          '덩굴성,다육형',
          '풀모양',
          '덩굴성,풀모양',
          '관목형',
          '풀모양',
          '덩굴성',
          '풀모양',
          '덩굴성',
          '풀모양',
          '관목형',
          '관목형',
          '덩굴성,풀모양',
          '관목형',
          '덩굴성',
          '직립형',
          '관목형,덩굴성',
          '풀모양,로제트형',
          '직립형,관목형',
          '풀모양',
          '직립형',
          '풀모양,로제트형',
          '풀모양',
          '관목형,덩굴성',
          '덩굴성',
          '덩굴성',
          '풀모양,로제트형',
          '풀모양',
          '풀모양',
          '관목형',
          '관목형',
          '덩굴성',
          '직립형,관목형',
          '직립형,관목형',
          '직립형,관목형',
          '풀모양',
          '관목형,덩굴성',
          '관목형',
          '로제트형',
          '다육형',
          '다육형',
          '관목형,덩굴성',
          '직립형,관목형',
          '풀모양',
          '로제트형',
          '풀모양,로제트형',
          '덩굴성,다육형',
        ];
        for (var i = 0; i < keys.length; i++) {
          var plantNumber = data.response.body.items.item[i].cntntsNo['_cdata'];
          var plantName = data.response.body.items.item[i].cntntsSj['_cdata'];
          var plantImageUrl =
            data.response.body.items.item[i].rtnFileUrl['_cdata'];
          var plantType = plantTypeArray[i % plantTypeArray.length];
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
            category: plantType,
          });
        }
        res.json(plantData);
      } else {
        res.status(response.statusCode).send(response.statusMessage);
      }
    }
  });
});

// 데이터값 확인할때
// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });
