const path = require('path');
try {
  console.log("Loading mongoose...");
  const mongoose = require('mongoose');
  console.log("Mongoose loaded.");
  
  console.log("Loading CropTaluk model...");
  require('c:/GitProjects/Postal-Service/src/models/CropTaluk.js');
  console.log("CropTaluk loaded.");

  console.log("Loading AgriculturalData model...");
  require('c:/GitProjects/Postal-Service/src/models/AgriculturalData.js');
  console.log("AgriculturalData loaded.");

  console.log("Loading Event model...");
  // Let's read the Event TS file content and see if we can parse it, or check if compiling it with ts-node is needed.
  // Actually let's just see if requiring a TS file works since ts-node is not registered.
} catch (e) {
  console.error("CRITICAL ERROR:", e);
}
