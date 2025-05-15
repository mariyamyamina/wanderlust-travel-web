const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner , validateListing} = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const {storage} = require("../cloudConfig")
const upload = multer({storage}); //saves files in cloudinary storage


//Index route & Create POST Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing,upload.single("listing[image]"), wrapAsync(listingController.createListing))
  // .post(upload.single("listing[image]"),(req,res)=>{
  //   res.send(req.file);
  // })
  
//Create Listing Route
router.get("/new",isLoggedIn,listingController.renderNewForm)

//Edit  route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//Update Route , Show Route , Delete Route
router.route("/:id")
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;