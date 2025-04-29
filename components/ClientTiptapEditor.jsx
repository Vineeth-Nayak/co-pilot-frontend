// components/ClientTiptapEditor.jsx
"use client";

import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontSize from "tiptap-fontsize-extension";
import Underline from "@tiptap/extension-underline";
import { Button, Tooltip, Select, MenuItem, ToggleButtonGroup, ToggleButton, Divider, Box, Stack } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatSize,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  StrikethroughS,
  Link,
  Image,
  Undo,
  Redo,
} from "@mui/icons-material";

export default function ClientTiptapEditor({ value, onChange }) {
  const [editorContent, setEditorContent] = useState(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
      ,
    ],
    content: editorContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-base xl:prose-lg h-[400px] min-w-full overflow-y-auto border border-slate-300 rounded-lg focus:outline-none p-4",
      },
      handlePaste: (view, event) => {
        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;

        // Try to get HTML content first
        const html = clipboardData.getData("text/html");
        if (html) {
          // Parse the HTML to extract font sizes and other formatting
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Create a temporary div to hold the parsed content
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = doc.body.innerHTML;

          // Insert the content while preserving formatting
          editor.commands.insertContent(tempDiv.innerHTML);
          return true;
        }

        // Fallback to plain text
        const text = clipboardData.getData("text/plain");
        editor.commands.insertContent(text);
        return true;
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editorContent) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 1,
          bgcolor: "background.paper",
          // borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
        }}
      >
        {/* Text Formatting */}
        <ToggleButtonGroup size="small" exclusive>
          <Tooltip title="Bold">
            <ToggleButton
              value="bold"
              selected={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBold />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Italic">
            <ToggleButton
              value="italic"
              selected={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalic />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Underline">
            <ToggleButton
              value="underline"
              selected={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlined />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Strikethrough">
            <ToggleButton
              value="strike"
              selected={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <StrikethroughS />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Text Alignment */}
        <ToggleButtonGroup size="small" exclusive>
          <Tooltip title="Align left">
            <ToggleButton
              value="left"
              selected={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <FormatAlignLeft />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Align center">
            <ToggleButton
              value="center"
              selected={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <FormatAlignCenter />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Align right">
            <ToggleButton
              value="right"
              selected={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <FormatAlignRight />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Justify">
            <ToggleButton
              value="justify"
              selected={editor.isActive({ textAlign: "justify" })}
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            >
              <FormatAlignJustify />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Lists */}
        <ToggleButtonGroup size="small" exclusive>
          <Tooltip title="Bullet list">
            <ToggleButton
              value="bullet"
              selected={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulleted />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Numbered list">
            <ToggleButton
              value="ordered"
              selected={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumbered />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Blockquote">
            <ToggleButton
              value="quote"
              selected={editor.isActive("blockquote")}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FormatQuote />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Code block">
            <ToggleButton
              value="code"
              selected={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Font Size */}
        <Tooltip title="Font size">
          <Select
            value={editor.getAttributes("textStyle").fontSize || "14px"}
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            size="small"
            IconComponent={FormatSize}
            sx={{
              width: 90,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
              },
            }}
          >
            {fontSizes.map((size) => (
              <MenuItem key={size} value={size} sx={{ fontSize: size }}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        {/* Links & Images */}
        <Tooltip title="Link">
          <Button
            size="small"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("URL", previousUrl);

              if (url === null) return;
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                return;
              }

              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}
          >
            <Link />
          </Button>
        </Tooltip>

        {/* <Tooltip title="Image">
          <Button
            size="small"
            onClick={() => {
              const url = window.prompt("Enter the URL of the image:");

              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
          >
            <Image />
          </Button>
        </Tooltip> */}

        <Divider orientation="vertical" flexItem />

        {/* Undo/Redo */}
        {/* <Tooltip title="Undo">
          <Button size="small" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo />
          </Button>
        </Tooltip>
        <Tooltip title="Redo">
          <Button size="small" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo />
          </Button>
        </Tooltip> */}
      </Stack>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
          padding: 16px;
          outline: none;
        }
        .ProseMirror p {
          margin: 0 0 1em 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding: 0 1rem;
        }
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          line-height: 1.1;
          margin: 1em 0 0.5em 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .ProseMirror blockquote {
          padding-left: 1rem;
          border-left: 2px solid rgba(0, 0, 0, 0.1);
          margin-left: 0;
          margin-right: 0;
        }
        .ProseMirror code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 0.3em;
          font-size: 0.85em;
        }
        .ProseMirror pre {
          background: #0d0d0d;
          color: #fff;
          font-family: "JetBrainsMono", monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
      `}</style>
    </Box>
  );
}
