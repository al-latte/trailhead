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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

 export const calculateDistanceBetweenTwoPoints = (pointA, pointB) => {
  return haversine(pointA.latitude, pointA.longitude, pointB.latitude, pointB.longitude)
} 

export const calculateTotalDistancePerSegment = (trackSegments) => {
  const distancesPerSegment = trackSegments.map((segment) => {
    return segment.reduce(
      (accumulator, currentPoint) => {
        if (accumulator.previousPoint === null)
          return { previousPoint: currentPoint, total: 0 };

        let distance = calculateDistanceBetweenTwoPoints(accumulator.previousPoint, currentPoint)
        return {
          previousPoint: currentPoint,
          total: accumulator.total + distance,
        };
      },
      { previousPoint: null, total: 0 },
    );
  });

  return distancesPerSegment.map(distanceObj => distanceObj.total)
};

export const calculateTotalDistancePerTrack = (segmentDistances) => {
  return segmentDistances.reduce((acc, cur) => acc + cur)
}

 export const calculateElevationGainBetweenTwoPoints = (pointA, pointB) => {
  let gain = pointB.elevation - pointA.elevation
  let letIsPositive = gain > 0
  if (letIsPositive) return gain
} 

export const calculateElevationGainPerSegment = (trackSegments) => {
  let elevationsperSegment =  trackSegments.map((segment) => {
    return segment.reduce(
      (accumulator, currentPoint) => {
        if (accumulator.previousPoint === null)
          return { previousPoint: currentPoint, gain: 0 };

        let elevationGain = currentPoint?.elevation - accumulator.previousPoint?.elevation;
        let totalGain = elevationGain > 0 ? accumulator.gain + elevationGain : accumulator.gain
        return {
          previousPoint: currentPoint,
          gain: totalGain,
        };
      },
      { previousPoint: null, gain: 0 },
    );
  });

  return elevationsperSegment.map(distanceObj => distanceObj.gain)
};

export const calculateElevationGainPerTrack = (segmentElevationGains) => {
  return segmentElevationGains.reduce((acc, cur) => acc + cur)
}
