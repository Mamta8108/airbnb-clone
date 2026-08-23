const Listing = require("../models/listing");
//const fetch = require("node-fetch");

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

    if (!data.features || data.features.length === 0) {
      req.flash("error", "Location not found");
      return res.redirect("listing/new");
    }

    const coordinates = data.features[0].center; // [lng, lat]

    const newListing = new Listing(req.body.listing);

    newListing.geometry = {
      type: "Point",
      coordinates: coordinates,
    };

    newListing.owner = req.user._id; // req.user must exist - add isLoggedIn to route

    if (req.file) {
      newListing.image = {
        url: req.file.path, // Cloudinary gives URL in.path
        filename: req.file.filename // public_id
      };
    }

    await newListing.save();
     console.log("Saved geometry:", newListing.geometry);
    req.flash("success", "New Listing Created");
    res.redirect("/listing");
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong while creating listing");
    res.redirect("/listing/new");
  }
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing }, { new: true });

    // Re-geocode if location changed
    if (req.body.listing.location) {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json?key=${process.env.MAP_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        listing.geometry = {
          type: "Point",
          coordinates: data.features[0].center
        };
      }
    }

    // Handle new image upload
    if (typeof req.file!== 'undefined') {
      listing.image = {
        url: req.file.path, // NOT req.file.filename
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listing/${id}`); // Fixed: res.redirect, not req.redirect. Fixed: ${id} not $(id)

  } catch (err) {
    console.log(err);
    req.flash("error", "Update failed");
    res.redirect(`/listing/${req.params.id}/edit`);
  }
};

// DELETE
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listing");
};