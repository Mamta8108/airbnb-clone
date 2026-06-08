const express = require("express");
const app = express();
//const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
  secret:"mysecretstring",
  resave:false,
  saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use((res,req,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
})

app.get("/register",(req,res)=>{
  let {name = "anynomous"} = req.query ;
 req.session.name = name;
 if(name === "anpnymous"){
  req.flash("error","user not registered");
 }
 else{
  req.flash("success","user registered successfully!")
 }
 
 res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
 res.render("page.ejs",{name:req.session.name})
})


// app.use(session({
//   secret:"mysupersecretstring",
//   resave:false,
//   saveUninitialized:true,
// }));

// app.get("/reqCount",(req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }
//   else{
//   req.session.count = 1;
//   }
   
//   res.send(`your cookies visited for x ${req.session.count} time`);
// })

// app.get("/test",(req,res)=>{
//   res.send("test successful!");
// });


app.listen(3000,()=>{
  console.log("server is listening to the port 3000");

})