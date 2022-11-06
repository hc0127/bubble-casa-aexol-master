import { BubbleNode, Position } from "../../../types";

export const toArrayOfBubbles = (bubble: BubbleNode): BubbleNode[] => {
  const children =
    bubble.child?.child
      .map((c) => toArrayOfBubbles(c))
      .reduce((a, b) => [...a, ...b]) || [];
  return [bubble, ...children];
};
