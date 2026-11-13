import { expect, test } from "vitest";
import { calculateElevationGainPerSegment } from "../src/calculations";



test("Calculates elevation gain from a set of points", () => {
  const segments = [
  [
    {
      latitude: 12.0535,
      longitude: -61.7518,
      elevation: 30.5,
    },
    {
      latitude: 12.0612,
      longitude: -61.745,
      elevation: 45.2,
    },
    {
      latitude: 12.0725,
      longitude: -61.7389,
      elevation: 88.0,
    },
    {
      latitude: 12.0841,
      longitude: -61.7312,
      elevation: 142.6,
    },
    {
      latitude: 12.1002,
      longitude: -61.722,
      elevation: 210.4,
    },
  ],
];
  expect(calculateElevationGainPerSegment(segments)).toContain(179.9);
});
