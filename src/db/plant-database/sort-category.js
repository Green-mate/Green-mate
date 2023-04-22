const express = require('express');
const convert = require('xml-js');
const request = require('request');
const getPlantData = require('./use-plantlist');

const HOST = 'http://api.nongsaro.go.kr/service/garden/gardenDtl';
const SERVICE_KEY = '20230421LJQ8SWJCLQVQU9AUCMTXKW';

const app = express();

app.get('/', (req, res) => {
  getPlantData(function (err, plantData) {
    if (err) {
      console.log(err);
      res.status(500).send('Error fetching plant data');
    } else {
      const promises = plantData.map((data) => {
        const cntntsNo = data['product_code'];
        const pageNo = 1;
        const numOfRows = 100;
        const requestUrl = `${HOST}?apiKey=${SERVICE_KEY}&cntntsNo=${cntntsNo}&pageNo=${pageNo}&numOfRows=${numOfRows}`;

        return new Promise((resolve, reject) => {
          request.get(requestUrl, (err, response, body) => {
            if (err) {
              console.log(`err=>${err}`);
              reject(err);
            } else {
              if (response.statusCode == 200) {
                const result = body;
                const json = convert.xml2json(result, {
                  compact: true,
                  spaces: 4,
                });
                const parsedJson = JSON.parse(json);
                const grwhstleCodeNm =
                  parsedJson.response.body.item.grwhstleCodeNm._cdata;
                resolve(grwhstleCodeNm);
              } else {
                reject(
                  new Error(
                    `Request failed with status code ${response.statusCode}`,
                  ),
                );
              }
            }
          });
        });
      });

      Promise.all(promises)
        .then((results) => {
          res.json(results);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('Error fetching plant data');
        });
    }
  });
});

// app.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });
