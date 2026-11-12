import { destructureGPX, handleGPXParse } from "./gpx.js";
import { drawMap } from "./canvas.js";
import {
  calculateTotalDistance,
  getTrackSegmentPoints,
} from "./calculations.js";

const uploadedFiles = document.getElementById("gpx");

const canvas = document.getElementById("gpx_map");
const canvasDimensions = {
  width: canvas.width,
  height: canvas.height,
};

const canvasCtx = canvas.getContext("2d");
let destructureGPXFile = null;

uploadedFiles.addEventListener("change", async () => {
  let file = await handleGPXParse(uploadedFiles, destructureGPX);
  destructureGPXFile = file;

  drawMap(file, canvasCtx, canvasDimensions);

  let trackPoints = getTrackSegmentPoints(destructureGPXFile.tracks);
  console.log(
    "Total Distance",
    trackPoints.map((points) => {
      return calculateTotalDistance(points);
    }).reduce((acc, current) => acc + current.total, 0)
  );
});
