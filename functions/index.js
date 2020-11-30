const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const functions = require('firebase-functions');
const express= require('express');
var admin = require("firebase-admin");
const cors = require('cors');
const { response } = require('express');
const engines=require('consolidate');
const campaign=require('./campaign.js')



var serviceAccount = require("../config/serviceAccountKey.json");
const { requires } = require("consolidate");

firebaseApp=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialinfluencer-10d72.firebaseio.com",
});
const db=firebaseApp.database();
const csrfMiddleware = csrf({ cookie: true });
const app=express(); //allows to the listen to the reuest and response



app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.engine('hbs',engines.handlebars);//creating the engine
app.set('views','./views');//setting the views folder
app.set('view engine','hbs');//using the engine created

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get("/",(req,res)=>{
 
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      getCamapigns()
      .then(campaign=>{
        console.log(campaign)
        res.render("home", { campaign });
      })
    })
    .catch((error) => {
      res.redirect("/login");
    });
})
app.post("/campaign-details",(req,res)=>{
  var campID=req.query.campID;
    getCamapignsbyID(campID)
      .then(campaigns=>{
        console.log(campaigns)
        res.render("scampaign", { campaigns });
      })

})

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register");
})

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});


app.get("/home", function (req, res) {
  const sessionCookie = req.cookies.session || "";
  var user=req.query.user;
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      getCamapigns()
      .then(campaign=>{
        console.log(campaign)
        res.render("home", { campaign });
      })
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.get("/userDetails",function(req,res){
  var user=req.query.user;
  admin
  .auth()
  .getUser(user)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    res.render("home",{userRecord})
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
    res.send({"data":"Failed to fecth the user details"})
  });
});


app.get('/timestamp',(request,response)=>{
response.send(`${Date.now()}`)
}); 

app.get('/campaign',(req,res)=>{
  var campid=req.query.campID;
  getCamapignsbyID(campid)
  .then(campaigns=>{
    res.render("campaign",campaigns)
  })
  .catch((error) => {
    console.log("Error"+error)
  });
}); 

function getCamapigns()
{
    const ref= firebaseApp.database().ref('Campaigns'); 
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
    //once for the getting data once since it returns the promise get the snapshot and unwrap the value
}

function getCamapignsbyID(campid)
{
    const ref= firebaseApp.database().ref('Campaigns/'+campid)
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
    //once for the getting data once since it returns the promise get the snapshot and unwrap the value
}
exports.app = functions.https.onRequest(app); //on request call the function in the parameter list
