const uploadedFiles = document.getElementById("gpx");


const canvas = document.getElementById("gpx_map");
const canvasDimensions = {
  width: canvas.width,
  height: canvas.height,
};

const canvasCtx = canvas.getContext("2d");
let destructureGPXFile = null;

function destructureGPX(gpxFileDocument) {
  function buildWaypointObject(waypoint) {
    return {
      attributes: waypoint.attributes,
    };
  }

  function buildTrackObject(track) {
    let segments = [];
    const segmentsCollection = track.getElementsByTagName("trkseg");
    for (let item of segmentsCollection) {
      let points = [];
      let trackpoints = item.getElementsByTagName("trkpt");
      for (let point of trackpoints) {
        let trkptAttr = point.attributes;
        let elevation = point.getElementsByTagName("ele");
        trkptAttr.elevation = Number(elevation.item(0).textContent);
        points.push(trkptAttr);
      }
      segments.push(points);
    }
    return segments;
  }

  return {
    waypoints: Array.from(gpxFileDocument.getElementsByTagName("wpt")).map(
      (wpt) => buildWaypointObject(wpt),
    ),
    tracks: Array.from(gpxFileDocument.getElementsByTagName("trk")).map((trk) =>
      buildTrackObject(trk),
    ),
  };
}

async function handleParse(files) {
  //uploadedFile is a File object which is a kind of Blob
  //so Blob methods work
  let uploadedFile = files.files[0];
  let file = await uploadedFile.text();

  let parsedFile = gpxParser.parseFromString(file, "text/xml");
  console.log("parsed", parsedFile);
  const destructureGPXFile = destructureGPX(parsedFile);
  console.log("file", destructureGPXFile);
  drawMap(destructureGPXFile);

  return destructureGPXFile;
}

function findBoundry(points) {
  let maxLatitude = Math.max(...(points || []).map((p) => p.latitude));
  let maxLongitude = Math.max(...(points || []).map((p) => p.longitude));

  let minLatitude = Math.min(...(points || []).map((p) => p.latitude));
  let minLongitude = Math.min(...(points || []).map((p) => p.longitude));

  return { maxLatitude, maxLongitude, minLatitude, minLongitude };
}

function convertCoordinatesToPixels(lat, lon, boundry, canvasDimension) {
  const calculateFormula = (
    value,
    inputMin,
    inputMax,
    outputMin,
    outputMax,
  ) => {
    return (
      outputMin +
      ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin)
    );
  };

  const latToPixels = calculateFormula(
    lat,
    boundry.minLatitude,
    boundry.maxLatitude,
    canvasDimension.height,
    0,
  );
  const lonToPixels = calculateFormula(
    lon,
    boundry.minLongitude,
    boundry.maxLongitude,
    0,
    canvasDimension.width,
  );

  return {
    x: lonToPixels,
    y: latToPixels,
  };
}

function calculateTotalDistance(coordinates) {
  const haversineFormula = (point1, point2) => {};
  return coordinates.map((lat, lon) => {});
}

function calculateElevationGain(elevations) {
  return elevations.reduce((acc, currentVal) => {
    if (currentVal > acc) {
      acc + currentVal;
    }
  }, elevations[0]);
}

function drawMap(gpxFileObject) {
  canvasCtx.lineWidth = 10;
  canvasCtx.beginPath();
  gpxFileObject.tracks.forEach((trk) => {
    trk.forEach((trkseg) => {
      let trackPoints = trkseg.map((trkpt) => {
        let latitude = Number(trkpt.getNamedItem("lat").value);
        let longitude = Number(trkpt.getNamedItem("lon").value);

        return {
          latitude,
          longitude,
        };
      });

      const boundry = findBoundry(trackPoints);
      console.log("boundry", boundry);

      trackPoints.forEach((point, index) => {
        let { x, y } = convertCoordinatesToPixels(
          point.latitude,
          point.longitude,
          boundry,
          canvasDimensions,
        );

        if (index === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      });

      canvasCtx.stroke();
    });
  });
}

uploadedFiles.addEventListener("change", () => {
  destructureGPXFile = handleParse(uploadedFiles);
});
