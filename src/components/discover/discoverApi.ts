import { callApi } from "../../api/callApi";
import { reactive } from "vue";
import { BubbleNode, DataResponse, Tag } from "../../types";

const default_position = 0;

export const tags_list = reactive<DataResponse<Tag[]>>({
  data: [],
});

export const clearTagList = () => {
  tags_list.data.length = 0;
};

export const getNodeByTag = async (tag: string) => {
  const response: { found_tag_list: Tag[] } = await callApi(
    "node",
    "findNodeByTag",
    {
      tag,
    }
  );
  tags_list.data = response.found_tag_list;
  // if (tags_list.data.length === 0) {
  //   window.location.href = '/articleList/1'
  // }
};

export const fetchSingleNodeTree = async (parent_id: number) => {
  const result = await callApi("node", "getBranch", { parent_id });
  const typedResult = result as {
    main: BubbleNode;
    child: BubbleNode[];
  };
  return {
    ...typedResult,
    child: typedResult.child
      .filter((n) => n.id !== typedResult.main.id)
      .map((c) => ({
        ...c,
        child: {
          child: c.child?.child.filter(
            (cc) =>
              !typedResult.child
                .map((tc) => tc.id)
                .concat(typedResult.main.id)
                .includes(cc.id)
          ),
        },
      })),
  };
};
export const fetchNodeTree = async (parent_id: number) => {
  const result = await callApi("node", "getBranch", { parent_id });
  const typedResult = result as {
    main: BubbleNode;
    child: BubbleNode[];
  };
  return typedResult;
};

export const fetchNodeTrees = async (parent_id: number) => {
  const result = await fetchNodeTree(parent_id);
  const child = (
    await Promise.all(result.child.map((c) => fetchNodeTree(c.id)))
  ).map((n) => ({
    ...n.main,
    child: {
      child: n.child
        .filter((n) => n.id !== result.main.id)
        .map((c) => ({
          ...c,
          child: {
            child: c.child?.child.filter(
              (cc) =>
                !result.child
                  .map((tc) => tc.id)
                  .concat(result.main.id)
                  .includes(cc.id)
            ),
          },
        })),
    },
  }));
  return {
    ...result,
    child,
  };
};
