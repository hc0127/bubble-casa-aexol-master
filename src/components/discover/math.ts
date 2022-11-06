import { Position } from "../../types";

interface determineChildPositionParentProps {
  parentPosition: Position;
  distance: number;
  maxNodes: number;
}

interface determineChildPositionProps {
  index: number;
  startingAngle?: number;
}

export const determineChildPosition =
  ({ parentPosition, maxNodes, distance }: determineChildPositionParentProps) =>
  ({ index, startingAngle = 0 }: determineChildPositionProps) => {
    const fullDegree = Math.PI * 2;
    const degreeInRadians =
      startingAngle + (fullDegree * (index + 1)) / maxNodes;
    return {
      x: parentPosition.x + Math.cos(degreeInRadians) * distance,
      y: parentPosition.y + Math.sin(degreeInRadians) * distance,
    } as Position;
  };

export const calculateDistance = (v1: Position, v2: Position) => {
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
};

export const calculateScale = (maxDistance: number) => (distance: number) => {
  return distance > maxDistance
    ? 0
    : calculateDistanceFactor(maxDistance)(distance);
};
export const calculateDistanceFactor =
  (maxDistance: number) => (distance: number) => {
    return Math.max(
      Math.sin((Math.PI / 2.0) * (1.0 - distance / maxDistance)),
      0.01
    );
  };

export const Vector = () => {
  const dot = (v1: Position) => (v2: Position) => v1.x * v2.x + v1.y * v2.y;
  const length = (v: Position) => Math.sqrt(dot(v)(v));
  const angle = (v1: Position) => (v2: Position) =>
    Math.acos(dot(v1)(v2) / (length(v1) * length(v2)));
  const vectorFrom = (v1: Position) => (v2: Position) =>
    ({ x: v1.x - v2.x, y: v2.y - v1.y } as Position);
  const scalarMultiply = (v1: Position) => (s: number) =>
    ({
      x: v1.x * s,
      y: v1.y * s,
    } as Position);
  return {
    dot,
    length,
    angle,
    vectorFrom,
    scalarMultiply,
  };
};
