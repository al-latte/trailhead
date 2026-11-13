import {expect, test} from "vitest"
import { calculateDistanceBetweenTwoPoints } from "../src/calculations";

test("Calculates the distance between to points", () => {
  expect(
    calculateDistanceBetweenTwoPoints(
      { latitude: 40.76, longitude: -73.98 },
      { latitude: 40.77, longitude: -73.97 },
    ),
  ).toBeCloseTo(1.3948851844843216, 10);
});
