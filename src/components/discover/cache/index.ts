const nodeCache: Record<
  number,
  Record<string, { startingAngle?: number; nodes: Record<number, number> }>
> = {};

export const getNodeIndexFromCache = (parentId: number, children: string) => {
  if (!nodeCache[parentId]) {
    nodeCache[parentId] = {};
  }
  if (!nodeCache[parentId][children]) {
    nodeCache[parentId][children] = {
      nodes: {},
    };
  }
  const getIndex = (nodeId: number, index: number) => {
    if (typeof nodeCache[parentId][children].nodes[nodeId] === "undefined") {
      nodeCache[parentId][children].nodes[nodeId] = index;
    }
    return nodeCache[parentId][children].nodes[nodeId];
  };
  const getStartingAngle = (defaultStartingAngle: number) => {
    if (typeof nodeCache[parentId][children].startingAngle === "undefined") {
      nodeCache[parentId][children].startingAngle = defaultStartingAngle;
    }
    return nodeCache[parentId][children].startingAngle as number;
  };
  return {
    getIndex,
    getStartingAngle,
  };
};
