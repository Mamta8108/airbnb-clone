

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const { Cursor } = require("mongoose");
const listingController = require("../controllers/listing.js");
const { index } = require("../controllers/listing.js");
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})



router
.route("/")
.get(wrapAsync(listingController.index))

.post(
  upload.single("image"),
  async (req, res) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await newListing.save();

    res.redirect("/listing");
  }
);
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
.route("/:id")
.get(isLoggedIn,wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// EDIT
router.get("/:id/edit",isLoggedIn,isOwner,
   wrapAsync(listingController.renderEditForm));

module.exports = router;