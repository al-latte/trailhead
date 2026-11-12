function haversine(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // kilometres

  const toRadian = (coordinate) => coordinate * (Math.PI / 180);

  const latRadian1 = toRadian(lat1);
  const latRadian2 = toRadian(lat2);

  const latRadianDifference = latRadian2 - latRadian1;

  const lonRadian1 = toRadian(lon1);
  const lonRadian2 = toRadian(lon2);

  const lonRadianDifference = lonRadian2 - lonRadian1;

  const a =
    Math.sin(latRadianDifference / 2) ** 2 +
    Math.cos(latRadian1) *
      Math.cos(latRadian2) *
      Math.sin(lonRadianDifference / 2) ** 2;
  const c = 2 * a * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export const getTrackSegmentPoints = (tracks) => {
  return tracks.map((track) => {
    return track.map((tracksegment) => tracksegment);
  });
};

export const calculateTotalDistance = (trackSegments) => {
  return trackSegments.map((segment) => {
    return segment.reduce(
      (accumulator, cuurentPoint) => {
        if (accumulator.previousPoint === null)
          return { previousPoint: cuurentPoint, total: 0 };

        let distance = haversine(
          accumulator.previousPoint?.latitude,
          accumulator.previousPoint?.longitude,
          cuurentPoint?.latitude,
          cuurentPoint?.longitude,
        );
        return {
          previousPoint: cuurentPoint,
          total: accumulator.total + distance,
        };
      },
      { previousPoint: null, total: 0 },
    );
  });
};

export const calculateElevationGain = (elevations) => {
  return elevations.reduce((acc, currentVal) => {
    if (currentVal > acc) {
      acc + currentVal;
    }
  }, elevations[0]);
};
