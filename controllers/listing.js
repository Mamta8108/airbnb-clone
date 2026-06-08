

const Listing = require("../models/listing");
const fetch = require("node-fetch");

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {

  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listing");
  }

  console.log(listing);

  res.render("show.ejs", { listing });
};

// CREATE
module.exports.createListing = async (req, res) => {
  try {
    const location = req.body.listing.location;

    const response = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAP_TOKEN}`
    );

    const data = await response.json();

    const coordinates = data.features[0].center;

    const newListing = new Listing(req.body.listing);

    newListing.geometry = {
      type: "Point",
      coordinates: coordinates,
    };

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "New Listing Created");

    res.redirect("/listing");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong while creating listing");
    res.redirect("/listing");
  }
};
// UPDATE
module.exports.updateListing = async (req, res) => {

  let { id } = req.params;
 if(typeof req.file !== 'undefined'){
 let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 let url = req.file.filename;
 listing.image = {url,filename};
 req.flash("success","Listing Updated!");
 req.redirect(`/listing/$(id)`);
 await listing.save();
 }
  req.flash("success", "Listing Updated Successfully!");

  res.redirect(`/listing/${id}`);
};

// DELETE
module.exports.destroyListing = async (req, res) => {

  let { id } = req.params;

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");

  res.redirect("/listing");
};