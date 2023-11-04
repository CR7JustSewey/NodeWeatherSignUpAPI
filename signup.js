const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const https=require("https");
const request=require("request");
require("dotenv").config();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})
app.post("/",function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.emailAccount;

    const data={
        members:[
                {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                "FNANE":firstName,
                "LNAME":lastName
            }
                }
        ]
    };
    const jsonData=JSON.stringify(data);

    const url="https://us14.api.mailchimp.com/3.0/lists/"+process.env.MC_LIST_ID;
    const options={
        method:"POST",
        headers:{
            Authorization:"auth "+process.env.MC_API_KEY
        }
    }
    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})
app.post("/success",function(req,res){
    res.redirect("/");
})
app.post("/failure",function(req,res){
   res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(req,res){
    console.log("Server is running on Port 3000");
})