export const findBoundry = (points) => {
  let maxLatitude = Math.max(...(points || []).map((p) => p.latitude));
  let maxLongitude = Math.max(...(points || []).map((p) => p.longitude));

  let minLatitude = Math.min(...(points || []).map((p) => p.latitude));
  let minLongitude = Math.min(...(points || []).map((p) => p.longitude));

  return { maxLatitude, maxLongitude, minLatitude, minLongitude };
};

export const convertCoordinatesToPixels = (lat, lon, boundry, canvasDimension) => {
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

export const drawMap = (gpxFileObject, canvasContext, canvasDimensions) => {
  canvasContext.lineWidth = 5;
  canvasContext.beginPath();

  gpxFileObject.tracks.forEach((trk) => {
    trk.forEach((trkseg) => {

      const boundry = findBoundry(trkseg);

      trkseg.forEach((point, index) => {
        let { x, y } = convertCoordinatesToPixels(
          point.latitude,
          point.longitude,
          boundry,
          canvasDimensions,
        );

        if (index === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }
      });

      canvasContext.stroke();
    });
  });
};
