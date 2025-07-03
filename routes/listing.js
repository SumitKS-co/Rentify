const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // this is a middleware
const listingController = require("../controllers/listings.js");

router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get(
  "/mybook",
  isLoggedIn,
  wrapAsync(listingController.myBookings)
);

// show route
router.get("/:id", wrapAsync(listingController.showListing));

//create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

// booking route
router.get("/:id/booking", wrapAsync(listingController.BookListing));

router.post(
  "/:id/booking",
  isLoggedIn,
  wrapAsync(listingController.createBooking)
);

router.get(
  "/mybook",
  isLoggedIn,
  wrapAsync(listingController.myBookings)
);


module.exports = router;
