import "./style.css";

import { handleGPXParse } from "./gpx.js";
import { drawMap } from "./canvas.js";
import {
  calculateTotalDistancePerSegment,
  calculateTotalDistancePerTrack,
  calculateElevationGainPerSegment,
  calculateElevationGainPerTrack,
} from "./calculations.js";

import Trip from "./Trip.js";

const fileUpload = document.getElementById("gpx");

const canvas = document.getElementById("gpx_map");
const canvasDimensions = {
  width: canvas.width,
  height: canvas.height,
};

const canvasCtx = canvas.getContext("2d");
const saveBtn = document.getElementById('save-trip-btn');
const statGain = document.getElementById('stat-gain');
const statDistance = document.getElementById('stat-distance');
const tripsSection = document.getElementById('trips');
let destructureGPXFile = null;

let savedTrips = JSON.parse(localStorage.getItem('saved_trips') || '[]');

renderTrips();

fileUpload.addEventListener("change", async () => {
  try {
    let file = await handleGPXParse(fileUpload);

    if (destructureGPXFile) {
      canvasCtx.reset();
    }

    destructureGPXFile = file;
    drawMap(file, canvasCtx, canvasDimensions);

    const segmentDistances = calculateTotalDistancePerSegment(
      destructureGPXFile.tracks[0].segments,
    );
    const totalDistance = calculateTotalDistancePerTrack(segmentDistances);
    statDistance.textContent = `${totalDistance.toFixed(2)} km`;

    const segmentElevationGains = calculateElevationGainPerSegment(
      destructureGPXFile.tracks[0].segments,
    );
    const totalElevationGain = calculateElevationGainPerTrack(
      segmentElevationGains,
    );
    statGain.textContent = `${totalElevationGain.toFixed(2)} m`;
  } catch (error) {
    console.error(error.message);
  }
});

saveBtn.addEventListener('click', () => {
  if (!destructureGPXFile) {
    alert('No trip data to save. Please upload a GPX file first.');
    return;
  }

  const newTrip = new Trip({
    name: destructureGPXFile.metadata?.name || "New trip",
    date: destructureGPXFile.metadata?.time || Date.now(),
    route: destructureGPXFile,
    notes: "some notes",
    totalElevationGain: calculateElevationGainPerTrack(
      calculateElevationGainPerSegment(destructureGPXFile.tracks[0].segments)
    ),
    totalDistance: calculateTotalDistancePerTrack(
      calculateTotalDistancePerSegment(destructureGPXFile.tracks[0].segments)
    ),
  });

  savedTrips.push(newTrip);
  localStorage.setItem('saved_trips', JSON.stringify(savedTrips));
  renderTrips();
});

// Render trips list
function renderTrips() {
  if (savedTrips.length === 0) {
    tripsSection.innerHTML = `<p class="empty-state">No saved trips yet. Upload a track and click save!</p>`;
    return;
  }

  tripsSection.innerHTML = savedTrips.map(trip => `
    <div class="trip-item">
      <div class="trip-info">
        <h4>${trip.name}</h4>
        <p>Elevation Gain: <strong>${trip.totalElevationGain} m</strong> • Distance: <strong>${trip?.totalDistance.toFixed(2)} km</strong></p>
      </div>
    </div>
  `).join('');
}
