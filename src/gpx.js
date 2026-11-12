const gpxParser = new DOMParser();

export const getElement = (document, tagName) => {
  return document.getElementsByTagName(tagName).item(0);
};

export const getElementText = (document, tagName, fallback = "") => {
  const element = document.getElementsByTagName(tagName).item(0);

  return element?.textContent.trim() ?? fallback;
};

const getElementCollection = (document, tagName, fallback = []) => {
  const collection = document.getElementsByTagName(tagName);

  return Array.from(collection) ?? fallback;
};

export const deconstructGPX = (gpxFileDocument) => {
  const bounds = getElement(gpxFileDocument, "bounds");

  const metadata = {
    name: getElementText(gpxFileDocument, "name"),
    description: getElementText(gpxFileDocument, "desc"),
    time: getElementText(gpxFileDocument, "time"),
    ...(bounds && {
      bounds: {
        minLatitude: Number(bounds.getAttribute("minlat")),
        minLongitude: Number(bounds.getAttribute("minlon")),
        maxLatitude: Number(bounds.getAttribute("maxlat")),
        maxLongitude: Number(bounds.getAttribute("maxlon")),
      },
    }),
  };

  function buildPointObject(point) {
    return {
      name: getElementText(point, "name"),
      description: getElementText(point, "desc"),
      latitude: Number(point.getAttribute("lat")),
      longitude: Number(point.getAttribute("lon")),
      elevation: Number(getElementText(point, "ele")),
      time: getElementText(point, "time"),
    };
  }

  function buildTrackObject(track) {
    return {
      name: getElementText(track, "name"),
      description: getElementText(track, "desc"),
      segments: buildTrackSegmentArray(track),
    };
  }

  function buildTrackSegmentArray(track) {
    let segments = getElementCollection(track, "trkseg");
    return segments.map(segment => {
      let trackPoints = getElementCollection(segment, "trkpt")
      return trackPoints.map(point => buildPointObject(point))
    })
    
  }

  return {
    metadata,

    waypoints: getElementCollection(gpxFileDocument,"wpt").map(
      (wpt) => buildPointObject(wpt),
    ),
    tracks: getElementCollection(gpxFileDocument, "trk").map((trk) =>
      buildTrackObject(trk),
    ),
  };
};

export const handleGPXParse = async (files) => {
  //uploadedFile is a File object which is a kind of Blob
  //so Blob methods work
  let uploadedFile = files.files[0];
  let file = await uploadedFile.text();

  let parsedFile = gpxParser.parseFromString(file, "text/xml");

  const destructureGPXFile = deconstructGPX(parsedFile);

  return destructureGPXFile;
};
