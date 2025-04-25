"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";

// Dynamic import to prevent SSR
const Editable = dynamic(() => import("slate-react").then((mod) => mod.Editable), { ssr: false });

export default function ClientSlateEditor({ value, onChange }) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Serialize initial value properly
  const initialValue = useMemo(() => {
    try {
      // If value is already Slate JSON, parse it
      if (value && typeof value === "object") return value;
      // If empty or plain text, create basic structure
      return [
        {
          type: "paragraph",
          children: [{ text: value || "" }],
        },
      ];
    } catch {
      return [{ type: "paragraph", children: [{ text: "" }] }];
    }
  }, [value]);

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        // Convert Slate value to plain text
        const text = value.map((n) => n.children.map((c) => c.text).join("\n"));
        onChange(text);
      }}
    >
      <Editable className="editor-input border rounded p-2 min-h-[200px]" placeholder="Enter article body…" />
    </Slate>
  );
}
