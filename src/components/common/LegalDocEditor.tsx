"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { generateDraft, reviewDocument, researchQuery } from "../../lib/gemini";
import { 
  FileText, 
  Download, 
  Mail, 
  Copy, 
  Wand2, 
  Loader2, 
  CheckCircle,
  Sparkles,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FolderOpen,
  Eye,
  Edit3,
  MessageSquare,
  Search,
  Brain,
  Scale,
  AlertCircle
} from 'lucide-react';

// --- UI Components (using Lucide icons and Tailwind) ---
const Btn = ({ children, onClick, variant = "outline", disabled, icon: Icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      "px-3 py-1.5 text-sm rounded-lg border shadow-sm mr-2 flex items-center gap-2 transition-colors " +
      (variant === "primary"
        ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
        : variant === "success"
        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
        : variant === "danger"
        ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50")
    }
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// ============ Types ============
export type JSONContent = any;

export interface Clause {
  id: string;
  title: string;
  body: string; // plain text or minimal HTML; will be inserted
  variables?: Record<string, string>; // e.g. { PartyName: "Acme" }
}

export interface AuditEvent {
  id: string;
  docId: string;
  actor: string;
  type:
    | "insertion:create"
    | "insertion:accept"
    | "insertion:reject"
    | "deletion:create"
    | "deletion:accept"
    | "deletion:reject"
    | "comment:create"
    | "comment:resolve"
    | "export:pdf"
    | "export:docx"
    | "ai:draft"
    | "ai:review"
    | "ai:research";
  payload?: Record<string, any>;
  at: string; // ISO timestamp
}

export interface SuggestionItem {
  id: string;
  kind: "insertion" | "deletion";
  author: string;
  createdAt: string; // ISO
  from: number; // doc position
  to: number; // doc position (for insertion, to === from + text length)
  text?: string; // inserted text OR deleted text
}

export interface AIHandlers {
  // Haki Draft — generate a new draft from metadata
  generateDraft?: (args: { metadata: Record<string, string> }) => Promise<JSONContent>;
  // Haki Reviews — return suggestions to apply or comments
  reviewDoc?: (args: { content: JSONContent; metadata: Record<string, string> }) => Promise<{
    suggestions?: Array<Pick<SuggestionItem, "kind" | "text"> & { at?: number }>;
    summary?: string;
  }>;
  // Haki Lens — research helper
  research?: (args: { query: string; content: JSONContent }) => Promise<{ answer: string; sources?: any[] }>;
}

export interface LegalDocEditorProps {
  docId: string;
  currentUser: { id: string; name: string };
  initialContent: JSONContent;
  mode?: "edit" | "suggest" | "view";
  clauses?: Clause[];
  metadata?: Record<string, string>;
  readOnly?: boolean;
  // Callbacks to bubble state up to HakiChain
  onChange?: (updated: JSONContent) => void;
  onAudit?: (event: AuditEvent) => void;
  onSuggestionsChange?: (items: SuggestionItem[]) => void;
  // AI integrations (Haki Draft / Reviews / Lens)
  ai?: AIHandlers;
}

// ============ Suggestion Mark Extension (visuals via decorations) ============
const suggestionPluginKey = new PluginKey("hakichain-suggestions");

const SuggestionMarks = Extension.create({
  name: "hakichainSuggestionMarks",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: suggestionPluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            // keep decorations mapped through document changes
            return old.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations: (state) => {
            const decos: Decoration[] = [];
            state.doc.descendants((node: any, pos: number) => {
              if (!node.marks) return;
              node.marks.forEach((m: any) => {
                if (m.type.name === "insertionMark") {
                  decos.push(Decoration.inline(pos, pos + node.nodeSize, { class: "bg-green-100 border-l-2 border-green-500" }));
                }
                if (m.type.name === "deletionMark") {
                  decos.push(Decoration.inline(pos, pos + node.nodeSize, { class: "bg-red-100 border-l-2 border-red-500 line-through" }));
                }
              });
            });
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

const InsertionMark = Extension.create({
  name: "insertionMark",
  addOptions() {
    return { HTMLAttributes: { class: "" } };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle", "paragraph", "heading"],
        attributes: {
          suggestionId: { default: null },
          author: { default: null },
          createdAt: { default: null },
        },
      },
    ];
  },
});

const DeletionMark = Extension.create({
  name: "deletionMark",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle", "paragraph", "heading"],
        attributes: {
          suggestionId: { default: null },
          author: { default: null },
          createdAt: { default: null },
          deletedText: { default: null },
        },
      },
    ];
  },
});

// ============ Utils ============
const iso = () => new Date().toISOString();
const rid = (p = "sug") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

// Apply insertion mark to current selection content (used in Suggest mode)
function wrapSelectionAsInsertion(editor: any, userName: string): SuggestionItem | null {
  const { state } = editor;
  const { from, to } = state.selection;
  if (from === to) return null;
  const suggestionId = rid("ins");
  const createdAt = iso();
  const text = state.doc.textBetween(from, to, " ");
  editor.chain().setMark("insertionMark", { suggestionId, author: userName, createdAt }).run();
  return { id: suggestionId, kind: "insertion", author: userName, createdAt, from, to, text };
}

// Replace selection with a redlined deletion ghost (keeps text visible with strikethrough)
function replaceSelectionAsDeletion(editor: any, userName: string): SuggestionItem | null {
  const { state } = editor;
  const { from, to } = state.selection;
  if (from === to) return null;
  const suggestionId = rid("del");
  const createdAt = iso();
  const text = state.doc.textBetween(from, to, " ");
  // Mark current selection with deletion
  editor.chain().setMark("deletionMark", { suggestionId, author: userName, createdAt, deletedText: text }).run();
  return { id: suggestionId, kind: "deletion", author: userName, createdAt, from, to, text };
}

// Accept / Reject helpers (simplified; good starting point for prod hardening)
function acceptSuggestion(editor: any, s: SuggestionItem) {
  if (s.kind === "insertion") {
    // remove insertion marks only
    editor.commands.unsetMark("insertionMark");
  } else {
    // deletion accepted => actually delete the range
    editor.commands.deleteRange({ from: s.from, to: s.to });
  }
}

function rejectSuggestion(editor: any, s: SuggestionItem) {
  if (s.kind === "insertion") {
    // remove the inserted text entirely
    editor.commands.deleteRange({ from: s.from, to: s.to });
  } else {
    // deletion rejected => remove deletion mark (restore as normal text)
    editor.commands.unsetMark("deletionMark");
  }
}

// ============ Component ============
export default function LegalDocEditor({
  docId,
  currentUser,
  initialContent,
  mode = "edit",
  clauses = [],
  metadata = {},
  readOnly = false,
  onChange,
  onAudit,
  onSuggestionsChange,
  ai,
}: LegalDocEditorProps) {
  const [editorMode, setEditorMode] = useState<typeof mode>(mode);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [lensQuery, setLensQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<string>("");

  const editor = useEditor({
    editable: !readOnly && editorMode !== "view",
    extensions: [
      StarterKit.configure({ 
        history: true, // Use StarterKit's built-in history
        table: false, // Disable table for now to avoid import issues
      }),
      Placeholder.configure({ placeholder: "Draft your legal document…" }),
      Link.configure({ openOnClick: true }),
      InsertionMark,
      DeletionMark,
      SuggestionMarks,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly && editorMode !== "view");
  }, [editor, editorMode, readOnly]);

  useEffect(() => {
    onSuggestionsChange?.(suggestions);
  }, [suggestions]);

  const addAudit = useCallback(
    (evt: AuditEvent["type"], payload?: Record<string, any>) => {
      onAudit?.({ id: rid("aud"), docId, actor: currentUser.name, type: evt, payload, at: iso() });
    },
    [docId, currentUser, onAudit]
  );

  // ------- Editing helpers -------
  const applyClause = useCallback(
    (clause: Clause) => {
      if (!editor) return;
      let text = clause.body;
      Object.entries(clause.variables || {}).forEach(([k, v]) => {
        const val = metadata[k] ?? v ?? "";
        text = text.replaceAll(`{{${k}}}`, val);
      });
      editor.chain().focus().insertContent(text).run();
    },
    [editor, metadata]
  );

  const makeInsertion = useCallback(() => {
    if (!editor || editorMode !== "suggest") return;
    const sug = wrapSelectionAsInsertion(editor, currentUser.name);
    if (sug) {
      setSuggestions((prev) => [...prev, sug]);
      addAudit("insertion:create", { suggestionId: sug.id, text: sug.text, from: sug.from, to: sug.to });
    }
  }, [editor, editorMode, currentUser]);

  const makeDeletion = useCallback(() => {
    if (!editor || editorMode !== "suggest") return;
    const sug = replaceSelectionAsDeletion(editor, currentUser.name);
    if (sug) {
      setSuggestions((prev) => [...prev, sug]);
      addAudit("deletion:create", { suggestionId: sug.id, text: sug.text, from: sug.from, to: sug.to });
    }
  }, [editor, editorMode, currentUser]);

  const accept = useCallback(
    (id: string) => {
      if (!editor) return;
      const s = suggestions.find((x) => x.id === id);
      if (!s) return;
      acceptSuggestion(editor, s);
      setSuggestions((prev) => prev.filter((x) => x.id !== id));
      addAudit(s.kind === "insertion" ? "insertion:accept" : "deletion:accept", { suggestionId: id });
      onChange?.(editor.getJSON());
    },
    [editor, suggestions]
  );

  const reject = useCallback(
    (id: string) => {
      if (!editor) return;
      const s = suggestions.find((x) => x.id === id);
      if (!s) return;
      rejectSuggestion(editor, s);
      setSuggestions((prev) => prev.filter((x) => x.id !== id));
      addAudit(s.kind === "insertion" ? "insertion:reject" : "deletion:reject", { suggestionId: id });
      onChange?.(editor.getJSON());
    },
    [editor, suggestions]
  );

  // ------- AI Hooks (Haki Draft / Reviews / Lens) -------
  const runDraft = useCallback(async () => {
    if (!editor) return;
    setBusy("draft");
    try {
      const content = await generateDraft(metadata);
      editor.commands.setContent(content);
      addAudit("ai:draft", { metadata });
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setBusy(null);
    }
  }, [editor, metadata]);

  const runReview = useCallback(async () => {
    if (!editor) return;
    setBusy("review");
    try {
      const payload = await reviewDocument(editor.getJSON(), metadata);
      setReviewSummary(payload.summary || "");
      
      // naive application: for each suggested insertion, place at selection start; for deletion, select a small range
      const created: SuggestionItem[] = [];
      payload.suggestions?.forEach((sg) => {
        if (!editor) return;
        if (sg.kind === "insertion" && sg.text) {
          const id = rid("ins");
          editor.chain().focus().insertContent(sg.text).run();
          const { from, to } = editor.state.selection;
          editor.chain().setMark("insertionMark", { suggestionId: id, author: "Haki Reviews", createdAt: iso() }).run();
          created.push({ id, kind: "insertion", author: "Haki Reviews", createdAt: iso(), from, to, text: sg.text });
        }
      });
      if (created.length) setSuggestions((prev) => [...prev, ...created]);
      addAudit("ai:review", { count: created.length, summary: payload.summary });
    } catch (error) {
      console.error('Error reviewing document:', error);
    } finally {
      setBusy(null);
    }
  }, [editor, metadata]);

  const runResearch = useCallback(async () => {
    if (!editor || !lensQuery.trim()) return;
    setBusy("research");
    try {
      const res = await researchQuery(lensQuery, editor.getJSON());
      // Insert a callout block with the research answer
      editor.chain().focus().insertContent(`\n[Research Note] ${res.answer}\n`).run();
      addAudit("ai:research", { query: lensQuery, sources: (res as any).sources?.length || 0 });
      setLensQuery("");
    } catch (error) {
      console.error('Error researching query:', error);
    } finally {
      setBusy(null);
    }
  }, [editor, lensQuery]);

  // Export functions
  const handleDownload = useCallback(() => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const fileName = `legal_document_${new Date().toISOString().split('T')[0]}.html`;
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addAudit("export:docx");
  }, [editor]);

  const handleCopy = useCallback(async () => {
    if (!editor) return;
    await navigator.clipboard.writeText(editor.getText());
  }, [editor]);

  if (!editor) return <div className="p-4">Loading editor…</div>;

  return (
    <div className={`flex flex-col h-full border rounded-2xl overflow-hidden bg-white ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2">
          <Btn 
            variant={editorMode === "edit" ? "primary" : "outline"} 
            onClick={() => setEditorMode("edit")}
            icon={Edit3}
          >
            Edit
          </Btn>
          <Btn 
            variant={editorMode === "suggest" ? "primary" : "outline"} 
            onClick={() => setEditorMode("suggest")}
            icon={MessageSquare}
          >
            Suggest
          </Btn>
          <Btn 
            variant={editorMode === "view" ? "primary" : "outline"} 
            onClick={() => setEditorMode("view")}
            icon={Eye}
          >
            View
          </Btn>
          {editorMode === "suggest" && (
            <>
              <Btn onClick={makeInsertion} icon={Plus}>Mark Insertion</Btn>
              <Btn onClick={makeDeletion} icon={X}>Mark Deletion</Btn>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Btn onClick={handleCopy} icon={Copy}>Copy</Btn>
          <Btn onClick={handleDownload} icon={Download}>Export</Btn>
          <Btn 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            icon={isFullscreen ? Minimize2 : Maximize2}
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </Btn>
        </div>
      </div>

      {/* Secondary Toolbar (Clauses + AI) */}
      <div className="flex items-center gap-2 border-b px-4 py-3 bg-white">
        {/* Clauses */}
        <details className="relative">
          <summary className="cursor-pointer text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Insert Clause
          </summary>
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 min-w-64 max-h-44 overflow-auto z-10">
            {clauses.map((c) => (
              <div key={c.id} className="py-2 px-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => applyClause(c)}>
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-gray-500 truncate">{c.body.substring(0, 50)}...</div>
              </div>
            ))}
            {clauses.length === 0 && (
              <div className="py-2 px-2 text-sm text-gray-500">No clauses available</div>
            )}
          </div>
        </details>
        
        {/* AI Tools */}
        <div className="ml-auto flex items-center gap-2">
          {/* Haki Draft - Commented out for now
          <Btn 
            onClick={runDraft} 
            disabled={!!busy}
            icon={Wand2}
            variant="primary"
          >
            {busy === "draft" ? "Drafting…" : "Haki Draft"}
          </Btn>
          */}
          
          {/* Haki Reviews - Commented out for now
          <Btn 
            onClick={runReview} 
            disabled={!!busy}
            icon={Scale}
            variant="success"
          >
            {busy === "review" ? "Reviewing…" : "Haki Reviews"}
          </Btn>
          */}
          
          <div className="flex items-center gap-2">
            <input
              className="border rounded-lg px-3 py-1.5 text-sm w-64"
              placeholder="Haki Lens: ask a research question"
              value={lensQuery}
              onChange={(e) => setLensQuery(e.target.value)}
            />
            <Btn 
              onClick={runResearch} 
              disabled={!!busy || !lensQuery.trim()}
              icon={Search}
            >
              {busy === "research" ? "Researching…" : "Ask"}
            </Btn>
          </div>
        </div>
      </div>

      {/* Review Summary - Commented out for now (related to Haki Reviews)
      {reviewSummary && (
        <div className="border-b px-4 py-3 bg-blue-50">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900 mb-1">AI Review Summary</div>
              <div className="text-sm text-blue-800">{reviewSummary}</div>
            </div>
            <button 
              onClick={() => setReviewSummary("")}
              className="text-blue-600 hover:text-blue-800"
              title="Close review summary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      */}

      {/* Editor */}
      <div className={`overflow-auto p-6 prose prose-sm max-w-none ${
        isFullscreen ? 'h-[calc(100vh-200px)]' : 'flex-1'
      }`}>
        <EditorContent editor={editor} />
      </div>

      {/* Suggestions Panel */}
      {suggestions.length > 0 && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Suggestions ({suggestions.length})
            </h4>
            <div className="text-xs text-gray-500">Redline preview only — accepting will apply changes.</div>
          </div>
          <div className="grid gap-3">
            {suggestions.map((s) => (
              <div key={s.id} className="border rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{s.author}</span>
                    <span className="text-gray-500"> proposed a {s.kind} at {new Date(s.createdAt).toLocaleString()}.</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    s.kind === "insertion" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {s.kind === "insertion" ? "Insertion" : "Deletion"}
                  </div>
                </div>
                {s.text && (
                  <div className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                    <span className="font-medium">{s.kind === "insertion" ? "Insert: " : "Delete: "}</span>
                    {s.text}
                  </div>
                )}
                <div className="flex gap-2">
                  <Btn variant="success" onClick={() => accept(s.id)} icon={CheckCircle}>
                    Accept
                  </Btn>
                  <Btn variant="danger" onClick={() => reject(s.id)} icon={X}>
                    Reject
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ================= Example Usage =================
export function ExampleHakiChainScreen() {
  return (
    <div className="h-[90vh]">
      <LegalDocEditor
        docId="case-123"
        currentUser={{ id: "u1", name: "Adv. Wanjiku" }}
        initialContent={{ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Start drafting the NDA…" }] }] }}
        mode="suggest"
        clauses={[
          {
            id: "nda-conf",
            title: "Confidentiality",
            body: "The Parties agree to keep {{InformationType}} confidential until {{ExpiryDate}}.",
            variables: { InformationType: "Confidential Information", ExpiryDate: "2026-12-31" },
          },
        ]}
        metadata={{ InformationType: "trade secrets and know‑how", ExpiryDate: "2027-01-31" }}
        onChange={(json) => console.log("doc updated", json)}
        onAudit={(evt) => console.log("AUDIT", evt)}
        onSuggestionsChange={(items) => console.log("SUGGESTIONS", items)}
      />
    </div>
  );
}
