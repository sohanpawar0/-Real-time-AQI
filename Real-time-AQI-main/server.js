const express= require("express");
const app= express();

const https= require("https");
var path = require('path');
const fetch = require('node-fetch');
const api_key="de4f0539cec6c36bb2c3bc2dacefdd8d9104077f";
var url="";
var weatherData=0;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1mb'}));
app.get("/",function(req,res){
   res.sendFile(__dirname+"/"+"index.html");
});
// app.post('/', function(req, res){
//     const lat=req.body.latitude;
//     const long=req.body.longitude;
//     const data={
//       status:"Success",
//       latitude:lat,
//       longitude:long
//     }
//     // url1="https://api.waqi.info/feed/geo:" + lat + ";" + long + "/?token=" + api_key + "";
//     // url2="https://api.openweathermap.org/data/2.5/air_pollution/history?lat=22.06047&lon=88.109737&start=1622246400&end=1622264400&appid=095ed0eb2eca12fc9a1de055bf7bb87b#";
//     // https.get(url1, function(response){
//     //   response.on("data",function(data){
//     //     let weatherData = JSON.parse(data);
//     //     console.log(weatherData);
//     //     res.send(weatherData);
//     //   })
//     // })
//   });
app.get('/weather/:latlong', async (request,response)=>{
  const latlong =request.params.latlong.split(',');
  const lat=latlong[0];
  const long=latlong[1];
  const start=latlong[2];
  const end=latlong[3];
  const currentAQI_url="https://api.waqi.info/feed/geo:" + lat + ";" + long + "/?token=" + api_key + "";
  const currentAQI_response= await fetch(currentAQI_url);
  const currentAQI_data= await currentAQI_response.json();
  console.log(start,end);
  const pastAQI_url="https://api.openweathermap.org/data/2.5/air_pollution/history?lat=" + lat + "&lon=" + long + "&start=" + start + "&end=" + end + "&appid=095ed0eb2eca12fc9a1de055bf7bb87b#";
  const pastAQI_response= await fetch(pastAQI_url);
  const pastAQI_data= await pastAQI_response.json();

  const data={
    current_aqi: currentAQI_data,
    past_aqi: pastAQI_data
  }
  response.json(data);

});
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
