const express=require("express");
const app=express();
const https=require("https");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
require("dotenv").config();

app.get("/",function(req,res){
    res.sendFile(__dirname+"/weather.html");
    // console.log(process.env.APP_ID);
})
app.post("/",function(req,res){
    const cityName=req.body.cityName;

    const url="https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+process.env.WEATHER_APP_ID+"&units=metric";

    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            console.log(weatherData);
            const temp=weatherData.main.temp;
            const weatherDescription=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const image="https://openweathermap.org/img/wn/"+icon+"@4x.png";

            res.write(
                "<h1>The temperature of " +
                 cityName+" is "+
                  temp +
                  " degree celcius </h1>"
              );
              res.write(
                "<h3>The weather condition is " + weatherDescription + " currently</h3>"
              );
              res.write("<img src=" + image + ">");
        })
    })

})

app.listen(3000,function(req,res){
    console.log("Server is running on Port 3000");
})

