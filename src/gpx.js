const gpxParser = new DOMParser();

export const destructureGPX = (gpxFileDocument) => {
  function buildWaypointObject(waypoint) {
    return {
      attributes: waypoint.attributes,
    };
  }

  function buildTrackSegmentArray(track) {
    let segments = [];
    const segmentsCollection = track.getElementsByTagName("trkseg");
    for (let item of segmentsCollection) {
      let points = [];
      let trackpoints = item.getElementsByTagName("trkpt");
      for (let point of trackpoints) {
        let trkptAttr = {
            latitude: Number(point.attributes.getNamedItem("lat").value),
            longitude: Number(point.attributes.getNamedItem("lon").value),
        }
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
      buildTrackSegmentArray(trk),
    ),
  };
};

export const handleGPXParse = async (files, handler) => {
  //uploadedFile is a File object which is a kind of Blob
  //so Blob methods work
  let uploadedFile = files.files[0];
  let file = await uploadedFile.text();

  let parsedFile = gpxParser.parseFromString(file, "text/xml");

  const destructureGPXFile = handler(parsedFile);

  return destructureGPXFile;
};