export const findBoundary = (points) => {
  let maxLatitude = Math.max(...(points || []).map((p) => p.latitude));
  let maxLongitude = Math.max(...(points || []).map((p) => p.longitude));

  let minLatitude = Math.min(...(points || []).map((p) => p.latitude));
  let minLongitude = Math.min(...(points || []).map((p) => p.longitude));

  return { maxLatitude, maxLongitude, minLatitude, minLongitude };
};

export const convertCoordinatesToPixels = (
  lat,
  lon,
  boundary,
  canvasDimension,
) => {
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
    boundary.minLatitude,
    boundary.maxLatitude,
    canvasDimension.height,
    0,
  );
  const lonToPixels = calculateFormula(
    lon,
    boundary.minLongitude,
    boundary.maxLongitude,
    0,
    canvasDimension.width,
  );

  return {
    x: lonToPixels,
    y: latToPixels,
  };
};

export const drawMap = (gpxFileObject, canvasContext, canvasDimensions) => {
  canvasContext.lineWidth = 5;

  const colors = ["#FF5733", "#3498DB", "#2ECC71"];

  gpxFileObject.tracks.forEach((track) => {
    track.segments.forEach((segment, index) => {
      canvasContext.beginPath();
      canvasContext.strokeStyle = colors[index % colors.length];

      const boundary = gpxFileObject.metadata.bounds
        ? gpxFileObject.metadata.bounds
        : findBoundary(segment);

      segment.forEach((point, index) => {
        let { x, y } = convertCoordinatesToPixels(
          point.latitude,
          point.longitude,
          boundary,
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

export const clearCanvas = (canvasContext) => {
  canvasContext.reset();
}
