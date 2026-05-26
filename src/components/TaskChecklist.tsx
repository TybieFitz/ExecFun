import type {
  ChecklistCategoryNode,
  ChecklistItemNode,
  ChecklistSectionNode,
} from "../data/taskChecklists";

const INDENT = 16;

type TaskChecklistProps = {
  root: ChecklistCategoryNode;
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
};

function ChecklistItems({
  items,
  depth,
  checks,
  onToggle,
}: {
  items: ChecklistItemNode[];
  depth: number;
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((node) => (
        <li key={node.id}>
          <label
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-surface-raised px-5 py-4"
            style={{ marginLeft: depth * INDENT }}
          >
            <input
              type="checkbox"
              checked={checks[node.id] ?? false}
              onChange={() => onToggle(node.id)}
              className="h-5 w-5 shrink-0 rounded border-border accent-accent"
            />
            <span className="text-lg text-text">{node.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function ChecklistSections({
  sections,
  depth,
  checks,
  onToggle,
}: {
  sections: ChecklistSectionNode[];
  depth: number;
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {sections.map((section) => (
        <div key={section.label}>
          <p
            className="py-1 text-lg font-medium text-text"
            style={{ paddingLeft: depth * INDENT }}
          >
            {section.label}
          </p>
          <ChecklistItems
            items={section.children}
            depth={depth + 1}
            checks={checks}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}

export function TaskChecklist({ root, checks, onToggle }: TaskChecklistProps) {
  const sections: ChecklistSectionNode[] = [];
  const items: ChecklistItemNode[] = [];

  for (const child of root.children) {
    if (child.kind === "section") sections.push(child);
    else items.push(child);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl font-semibold text-text">{root.label}</p>
      {sections.length > 0 && (
        <ChecklistSections
          sections={sections}
          depth={1}
          checks={checks}
          onToggle={onToggle}
        />
      )}
      {items.length > 0 && (
        <ChecklistItems
          items={items}
          depth={1}
          checks={checks}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
