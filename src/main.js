import { handleGPXParse } from "./gpx.js";
import { drawMap } from "./canvas.js";
import { calculateTotalDistancePerSegment, calculateTotalDistancePerTrack, calculateElevationGainPerSegment, calculateElevationGainPerTrack } from "./calculations.js";

import Trip from "./Trip.js"

const uploadedFiles = document.getElementById("gpx");

const canvas = document.getElementById("gpx_map");
const canvasDimensions = {
  width: canvas.width,
  height: canvas.height,
};

const canvasCtx = canvas.getContext("2d");
let destructureGPXFile = null;

let trips = []
localStorage.setItem("trips", JSON.stringify(trips))

uploadedFiles.addEventListener("change", async () => {
  let file = await handleGPXParse(uploadedFiles);

  if (destructureGPXFile) {
    canvasCtx.reset();
  }

  destructureGPXFile = file;
  drawMap(file, canvasCtx, canvasDimensions);


  const trip = {
    name: destructureGPXFile.metadata?.name || "New trip",
    date: destructureGPXFile.metadata?.time || Date.now(),
    route: destructureGPXFile,
    notes: "some notes"
  }

   trips.push(new Trip(trip))
  localStorage.setItem("trips", JSON.stringify(trips))
  

});
