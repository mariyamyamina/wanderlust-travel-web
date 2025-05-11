require('dotenv').config({ path: '../.env' });

const mongoose = require("mongoose");
const axios = require("axios");  // Import axios
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URI = process.env.MONGO_URI;
const MAPBOX_TOKEN = process.env.MAP_TOKEN;
console.log("MONGO_URI:", MONGO_URI); 
console.log("Mapbox Token:", MAPBOX_TOKEN); // This should print the token


main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

async function getCoordinates(location) {
  try {
    const res = await axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(location) +
      `.json?access_token=${MAPBOX_TOKEN}`);
    console.log(res.data);  // Log the response to check structure
    const coordinates = res.data.features[0]?.geometry?.coordinates;
    return coordinates || [0, 0]; // Default if not found
  } catch (error) {
    console.error("Error fetching coordinates for:", location, error.message);
    return [0, 0];
  }
}

// Adding delay function to avoid rate limit issues
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Deleted old listings");

  // Add owner and dynamic geometry with coordinates from Mapbox API
  for (let obj of initData.data) {
    const coords = await getCoordinates(obj.location);
    obj.owner = "6820757659724001c5915306";
    obj.geometry = {
      type: "Point",
      coordinates: coords,
    };
    await delay(1000);  // Adding a 1-second delay to avoid rate-limiting
  }
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
