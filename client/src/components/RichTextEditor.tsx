"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { useEffect, useImperativeHandle, forwardRef, useState } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface RichTextEditorRef {
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    toggleStrike: () => void;
    toggleCode: () => void;
    toggleBulletList: () => void;
    setLink: () => void;
    unsetLink: () => void;
    setHorizontalRule: () => void;
    clearFormat: () => void;
    focus: () => void;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
    ({ value, onChange, placeholder = "Start typing...", className = "" }, ref) => {
        const [wordCount, setWordCount] = useState(0);
        const [charCount, setCharCount] = useState(0);
        const [isSaved, setIsSaved] = useState(true);
        const [isMounted, setIsMounted] = useState(false);

        // Ensure we only run on client
        useEffect(() => {
            setIsMounted(true);
        }, []);

        const editor = useEditor({
            extensions: [
                StarterKit,
                Underline,
                Link.configure({
                    openOnClick: false,
                    HTMLAttributes: {
                        class: "text-blue-500 underline cursor-pointer",
                    },
                }),
                Placeholder.configure({
                    placeholder,
                    emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0",
                }),
                Markdown,
            ],
            content: value, // Initial content as markdown (thanks to extension)
            editorProps: {
                attributes: {
                    class: "prose prose-sm sm:prose-base focus:outline-none min-h-[400px] sm:min-h-[700px] w-full max-w-none px-4 sm:px-6 py-3 sm:py-4 text-slate-900",
                },
            },
            onUpdate: ({ editor: ed }) => {
                const markdown = (ed.storage as any).markdown.getMarkdown();
                const text = ed.getText();

                // Update counts based on text content
                const words = text.trim().split(/\s+/).filter(Boolean);
                setWordCount(words.length);
                setCharCount(text.length);

                // Call onChange with Markdown
                onChange(markdown);
                setIsSaved(false);
            },
            // Only create editor when mounted on client
            immediatelyRender: false,
        });

        // Sync external value changes to editor content
        useEffect(() => {
            if (editor && value !== (editor.storage as any).markdown.getMarkdown()) {
                // If content differs significantly (e.g. initial load or external update)
                // We compare length to avoid cursor jumps on small formatting changes that might result in different markdown escaping
                if (Math.abs(value.length - (editor.storage as any).markdown.getMarkdown().length) > 5 || editor.getText() === "") {
                    editor.commands.setContent(value);
                }
            }
        }, [value, editor]);

        // Expose commands to parent via ref
        useImperativeHandle(ref, () => ({
            toggleBold: () => editor?.chain().focus().toggleBold().run(),
            toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
            toggleUnderline: () => editor?.chain().focus().toggleUnderline().run(),
            toggleStrike: () => editor?.chain().focus().toggleStrike().run(),
            toggleCode: () => editor?.chain().focus().toggleCode().run(),
            toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
            setLink: () => {
                const previousUrl = editor?.getAttributes("link").href;
                const url = window.prompt("URL", previousUrl);
                if (url === null) return;
                if (url === "") {
                    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
                    return;
                }
                editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            },
            unsetLink: () => editor?.chain().focus().unsetLink().run(),
            setHorizontalRule: () => editor?.chain().focus().setHorizontalRule().run(),
            clearFormat: () => editor?.chain().focus().unsetAllMarks().run(),
            focus: () => editor?.commands.focus(),
        }));

        // Auto-save simulation
        useEffect(() => {
            if (!isSaved) {
                const timer = setTimeout(() => {
                    localStorage.setItem("draft-content", value);
                    setIsSaved(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }, [value, isSaved]);

        if (!editor || !isMounted) {
            return (
                <div className="flex flex-col gap-4 animate-pulse">
                    <div className="h-12 bg-slate-100 rounded-2xl" />
                    <div className="min-h-[350px] sm:min-h-[600px] bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center">
                        <span className="text-slate-400 text-sm">Loading editor...</span>
                    </div>
                    <div className="h-12 bg-slate-100 rounded-2xl" />
                </div>
            );
        }

        return (
            <div className={`flex flex-col gap-4 ${className}`}>
                <style>{`
                    .ProseMirror p { margin-bottom: 0.75em; line-height: 1.7; }
                    .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
                    .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
                    .ProseMirror li p { margin-bottom: 0.25em; }
                    .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 { font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #0f172a; }
                    .ProseMirror h1 { font-size: 1.875rem; line-height: 1.25; }
                    .ProseMirror h2 { font-size: 1.5rem; line-height: 1.33; }
                    .ProseMirror h3 { font-size: 1.25rem; line-height: 1.6; }
                    .ProseMirror code { background-color: #f1f5f9; padding: 0.2em 0.4em; border-radius: 0.25rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875em; color: #ef4444; }
                    .ProseMirror pre { background-color: #0f172a; color: #f8fafc; padding: 1em; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1em; }
                    .ProseMirror pre code { color: inherit; background: transparent; padding: 0; }
                    .ProseMirror blockquote { border-left: 4px solid #cbd5e1; padding-left: 1em; font-style: italic; color: #475569; margin-bottom: 1em; }
                    .ProseMirror a { color: #2563eb; text-decoration: underline; cursor: pointer; }
                `}</style>
                {/* Editor Header */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/50 px-4 py-2 text-xs">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-600">
                            <span className="font-semibold text-slate-900">{wordCount}</span>{" "}
                            words
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">
                            <span className="font-semibold text-slate-900">{charCount}</span>{" "}
                            characters
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaved ? (
                            <span className="flex items-center gap-2 text-emerald-600">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Saved
                            </span>
                        ) : (
                            <span className="flex items-center gap-2 text-amber-600">
                                <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Saving...
                            </span>
                        )}
                    </div>
                </div>

                <div className="relative min-h-[350px] sm:min-h-[600px] w-full rounded-2xl border border-slate-200 bg-white/80 transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200 overflow-auto overscroll-contain touch-pan-y">
                    <EditorContent editor={editor} className="min-h-full" />
                </div>

                {/* Editor Footer */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-xs text-white">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-300">
                            Reading time: ~{Math.ceil(wordCount / 200)} min
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-amber-300">
                            💡 Tip: Select text to apply formatting
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
