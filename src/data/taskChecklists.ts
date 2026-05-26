import type { TaskId } from "../types";

export type ChecklistItemNode = { kind: "item"; id: string; label: string };

export type ChecklistSectionNode = {
  kind: "section";
  label: string;
  children: ChecklistItemNode[];
};

export type ChecklistCategoryNode = {
  kind: "category";
  label: string;
  children: Array<ChecklistSectionNode | ChecklistItemNode>;
};

export type ChecklistNode = ChecklistCategoryNode | ChecklistSectionNode | ChecklistItemNode;

function item(id: string, label: string): ChecklistItemNode {
  return { kind: "item", id, label };
}

function section(
  label: string,
  children: ChecklistItemNode[],
): ChecklistSectionNode {
  return { kind: "section", label, children };
}

function category(
  label: string,
  children: Array<ChecklistSectionNode | ChecklistItemNode>,
): ChecklistCategoryNode {
  return { kind: "category", label, children };
}

const LAUNDRY = category(" ", [
  section("Dryer", [
    item("laundry.dryer.stale", "STALE → Run dryer refresh"),
    item("laundry.dryer.fresh", "FRESH → empty to hamper, move to bed"),
  ]),
  section("Collect", [
    item("laundry.collect.clothes", "Clothes - discard zones, reuse stations"),
    item("laundry.collect.towels", "Towels - racks, kitchen"),
    item("laundry.collect.sheets", "Sheets"),
  ]),
  section("Washer", [
    item("laundry.washer.empty", "EMPTY → add pod + dirties, start"),
    item("laundry.washer.clean", "CLEAN → transfer to dryer"),
    item("laundry.washer.sour", "SOUR → add pod, restart"),
  ]),
  section("Folding", [
    item("laundry.folding.dump", "Dump onto unfolded sheet"),
    item("laundry.folding.sort", "Sort"),
    item("laundry.folding.fold", "Fold + hangerize"),
    item("laundry.folding.putaway", "Put away"),
  ]),
]);

const DISHES = category(" ", [
  section("CLEAN", [item("dishes.clean.putaway", "Put dishes away")]),
  section("DIRTY", [
    item("dishes.dirty.pod", "Ensure pod is in"),
    item("dishes.dirty.sink", "Load from sink"),
    item("dishes.dirty.counters", "Load from counters"),
    item("dishes.dirty.stragglers", "Check for stragglers"),
    item("dishes.dirty.run", "Run"),
  ]),
  section("CLEAR", [
    item("dishes.clear.stack", "Stack remaining dishes into left sink"),
  ]),
]);

const DECLUTTER = category(" ", [
  item("declutter.bins", "Bring Residents + Newcomers bins"),
  item("declutter.trash", "Trash + Recycle"),
  item("declutter.boxes", "Break Boxes"),
  item("declutter.sort", "Sort objects into bins"),
  item("declutter.residents", "Put away Residents"),
  item("declutter.newcomers", "Optional: home Newcomers"),
  item("declutter.putaway", "Put away bins"),
]);

const ADULTING = category(" ", [
  section("BEGIN", [
    item("adulting.begin.why", "Name why the scary task arrived"),
    item("adulting.begin.externalize", "Externalize fears of reputation impact"),
    item("adulting.begin.recognize", "Recognize these are normal feelings"),
    item("adulting.begin.open", "Open the scary"),
    item("adulting.begin.query", "Identify query"),
  ]),
  section("RESPONSE ONLY", [
    item("adulting.response.draft", "Draft response in ChatGPT, send"),
  ]),
  section("ACTION, QUICK", [
    item("adulting.quick.perform", "Perform task"),
    item("adulting.quick.draft", "Draft response in ChatGPT, send"),
  ]),
  section("ACTION, BLOCKED", [
    item("adulting.blocked.forward", "Forward any external dependencies"),
    item(
      "adulting.blocked.copy",
      "Copy remaining steps to Keep/Calendar/Alarms",
    ),
    item(
      "adulting.blocked.draft",
      "Draft holding response in ChatGPT, send",
    ),
  ]),
]);

export const TASK_CHECKLISTS: Record<TaskId, ChecklistCategoryNode> = {
  laundry: LAUNDRY,
  dishes: DISHES,
  declutter: DECLUTTER,
  adulting: ADULTING,
};

function collectFromChildren(
  children: Array<ChecklistSectionNode | ChecklistItemNode>,
): string[] {
  const ids: string[] = [];
  for (const child of children) {
    if (child.kind === "item") {
      ids.push(child.id);
    } else {
      ids.push(...child.children.map((c) => c.id));
    }
  }
  return ids;
}

export function collectChecklistIds(root: ChecklistCategoryNode): string[] {
  return collectFromChildren(root.children);
}

export function initialChecklistState(taskId: TaskId): Record<string, boolean> {
  return Object.fromEntries(
    collectChecklistIds(TASK_CHECKLISTS[taskId]).map((id) => [id, false]),
  );
}
