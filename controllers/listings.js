const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.index = async (req, res) => {
  let alllistings = await Listing.find({}); // it will contain all the data

  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

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
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const newlisting = new Listing(req.body.listing); // for adding data into the database
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedLisitng = await Listing.findByIdAndDelete(id);
  console.log(deletedLisitng);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

module.exports.BookListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/booking.ejs", { listing });
};

module.exports.createBooking = async (req, res) => {
  
  const listingId = req.params.id;
  const { checkIn, checkOut, guests } = req.body;
  const userId = req.user._id;

  // Validate dates
  const today = new Date();
  if (new Date(checkIn) < today || new Date(checkOut) <= new Date(checkIn)) {
    req.flash("error", "Invalid check-in/check-out dates.");
    return res.redirect(`/listings/${listingId}`);
  }

  // Check for overlaps
  const existingBookings = await Booking.find({ listingId });
  for (const booking of existingBookings) {
    if (
      new Date(booking.checkIn) <= new Date(checkOut) &&
      new Date(checkIn) <= new Date(booking.checkOut)
    ) {
      req.flash("error", "This listing is already booked for these dates.");
      return res.redirect(`/listings/${listingId}/booking`);
    }
  }

  // If all good, create the booking
  await Booking.create({
    listingId,
    userId,
    checkIn,
    checkOut,
    guests
  });

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${listingId}`);
};

module.exports.myBookings = async (req, res) => {
  const booking = await Booking.find({ userId: req.user._id })
    .populate("listingId"); // brings in listing details

  res.render("listings/mybooking.ejs", { booking });
};
