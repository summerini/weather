const express = require('express');
const app = express();
const port = 3000;

const request = require('request');

const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, 'XYtable.csv');
const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
let dataObj = {}

app.listen(port, () => {
    console.log(`${port}포트 서버 실행`);

    for (let city of csvFile.split('\r\n')) {
        let splitedData = city.split(',');
        if (splitedData[1] == '') {
            dataObj[splitedData[0]] = [splitedData[2], splitedData[3]];
        } else {
            dataObj[splitedData[1]] = [splitedData[2], splitedData[3]];
        }
    }
});


app.get("/proxy", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json; charset=UTF-8');

    if (dataObj[req.query.search]) {
        let requestUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?" +
            "serviceKey=Tvbyv0Z9GVpznlTHgzPeYWaYyRwU7aB%2FGBsXmOKP6BCaGbD30jshwhe78Y9ngDDCtzDkKJaS2iVV8UNmR6sh7Q%3D%3D" +
            "&pageNo=1" +
            "&numOfRows=1000" +
            "&dataType=JSON" +
            "&base_date=" + req.query.today +
            "&base_time=0600" +
            "&nx=" + dataObj[req.query.search][0] +
            "&ny=" + dataObj[req.query.search][1];

        request.get({ uri: requestUrl }, (error, response, body) => {
            setTimeout(() => {
                res.send(body);
            }, 1000);
        });
    } else {
        res.status(400).send();
    }
});