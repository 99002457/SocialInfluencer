/*
Imported Package Details
cookieParser : For parsing the Session Cookies
csurf: To identifiy the cross origin request forgery and allow only athenicated users to access the data
firebase-function: To access the firebase cloud functions.
express: To use the Express instead of traditional Nodejs HTTP function.
firebase-admin: To use the Firebase Admin Function for auth,FCM,and other queries and handle the Firebase Backend.
cors: to allow the cross origin request #needed for testing and makeit work on localhost without deploying.
consolidate: To handle the handlebars, Creates a engine to render the .hbs files from NodeJS
campaign: All Campaign related functions.
*/
const cookieParser = require("cookie-parser"); 
const csrf = require("csurf");
const bodyParser = require("body-parser");
const functions = require('firebase-functions');
const express= require('express');
var admin = require("firebase-admin");
const cors = require('cors');
const { response } = require('express');
const engines=require('consolidate');
const Campaign=require('./campaign');
// import * as InfluencerProfile from "./Iprofile.js";
// import * as AdvertiserProfile from "./Aprofile.js";


/*Service Account setup usind the serviceaccount.json to use google services*/
var serviceAccount = require("./config/serviceAccountKey.json");
const { requires } = require("consolidate"); //never used but need it for further usage

//Intialize the firebase Configuration 
firebaseApp=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialinfluencer-10d72.firebaseio.com",
  authDomain: "socialinfluencer-10d72.firebaseapp.com"
});
//Storing the firebase Database function in db
const db=firebaseApp.database();
//Setting the Csrf Middleware using the cookies to avoid the Unauthorized Cross Origin Requests 
const csrfMiddleware = csrf({ cookie: true });

//Creating the APpp
const app=express(); //allows to the listen to the request and response

/*
express app uses the following function 
*/
app.use(cors());//Cross Origin Request
app.use(bodyParser.json());//parse the post request body
app.use(cookieParser());//parse the cookies
app.use(csrfMiddleware);//csrf Middleware 
app.engine('hbs',engines.handlebars);//creating the engine
app.set('views','./views');//setting the views folder
app.set('view engine','hbs');//using the engine created

/*For all the request Check there is a csrf Token or not*/
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

/* Get Request for  / */
app.get("/",(req,res)=>{
 const sessionCookie = req.cookies.__session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
        res.redirect("/home")
        return Promise.resolve("redirect");
    })
    .catch((error) => {
      res.redirect("/login");
    });
})
/* Get Request for  /campaign-details */
app.post("/campaign-details",(req,res)=>{
  var campID=req.query.campID;
    var campaigns=Campaign.getCamapignsbyID(campID)
        console.log(campaigns)
        res.render("scampaign", { campaigns });
})

/* Get Request for  login */
app.get("/login",(req,res)=>{
  const sessionCookie = req.cookies.__session || "";
  if(sessionCookie)
  {
    res.redirect("/home");
  }
  else{
  res.render("login");
  }
})

/* Get Request for Register  / */
app.get("/register",(req,res)=>{
  res.render("register");
})
/* Get Request for Register  / */
app.get("/profile",(req,res)=>{
  res.render("profile");
})
/* Post Request for  /sessionLogin */
app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn }) 
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: false,secure:true };
        // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.setHeader('Cache-Control', 'private');
        res.cookie("__session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
        return Promise.resolve("resolvrd");
      },
      (error) => {
        res.send(500,"UNAUTHORIZED REQUEST!");
      }
      
    
      
    )
    .catch(error=>{
        
    })
});

/* Post Request for  /sessionLogout */
app.get("/sessionLogout", (req, res) => {
  res.clearCookie("__session");
  res.redirect("/login");
});

/* Get Request for  /home */
app.get("/home", function (req, res) {
  const sessionCookie = req.cookies.__session || "";
  var user=req.query.user;
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      Campaign.getCamapigns()
      .then(campaign=>{
        console.log(campaign)
        res.render("home", { campaign });
        return Promise.resolve(campaign);
      })
      .catch(error=>{
        
      })
      return Promise.resolve("resolvrd");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

/* Get Request for  /userDetails */
app.get("/userDetails",function(req,res){
  var user=req.query.user;
  admin
  .auth()
  .getUser(user)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    res.render("home",{userRecord})
    return Promise.resolve(userRecord);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
    res.send({"data":"Failed to fecth the user details"})
  });
});



/* Get Request for  /campaign */
app.get('/campaign',(req,res)=>{
  var campid=req.query.campID;
  Campaign.getCamapignsbyID(campid)
  .then(campaigns=>{
    res.render("campaign",campaigns)
    return Promise.resolve(campaigns);
  })
  .catch((error) => {
    console.log("Error"+error)
  });
}); 


exports.app = functions.https.onRequest(app); //on request call the function in the parameter list
