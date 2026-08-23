const User = require("../models/user");
module.exports.renderSignup = (req,res)=>{
  res.render("users/signup.ejs");
}
module.exports.renderLogin = (req,res)=>{
  res.render("users/login.ejs");
} 

module.exports.signup = async (req, res)=>
   {
    try {
      let { username, email, password } = req.body;
  
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
     req.login(registeredUser, err => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/signup");
        }
  
      req.flash("success", "Welcome to WanderLust!");
  
      // ✅ IMPORTANT: redirect after signup
      res.redirect("/listing");
      });
  
    } catch (e) {
  console.log("SIGNUP ERROR:", e);
  req.flash("error", e.message);
  res.redirect("/signup");
}
  };

  module.exports.login =async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.reddirectUrl || "/listing";
    res.redirect(redirectUrl);
  };

  module.exports.logout =(req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listing");
  });
}
