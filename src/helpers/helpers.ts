import { PointTuple } from "leaflet";
import { data } from "./data";


export function getCenter(points: PointTuple[]): PointTuple {
    const maxX = Math.max(...points.map((p) => p[0]));
    const minX = Math.min(...points.map((p) => p[0]));
    const maxY = Math.max(...points.map((p) => p[1]));
    const minY = Math.min(...points.map((p) => p[1]));

    return [(maxX + minX) / 2, (maxY + minY) / 2];
  }
  
export const precisionRound = (number: number, precision: number) => {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

const keyGen = () => {
  let cache = data.length;
  return () => {
      cache++;
      return cache.toString();
  };
};

export const getKey = keyGen();
