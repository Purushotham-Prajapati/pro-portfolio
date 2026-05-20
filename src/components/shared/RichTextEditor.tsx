"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, UnderlineIcon, Link2, List } from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
        content,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'rich-editor-content',
            },
        },
    });

    if (!editor) return null;

    const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, title: string) => (
        <button type="button" title={title} onClick={onClick}
            className={`rich-toolbar-btn ${active ? 'active' : ''}`}>
            {icon}
        </button>
    );

    return (
        <div className="rich-editor-wrapper">
            <div className="rich-toolbar">
                {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold size={14} />, 'Bold')}
                {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic size={14} />, 'Italic')}
                {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={14} />, 'Underline')}
                {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List size={14} />, 'List')}
                {btn(editor.isActive('link'), () => {
                    const url = window.prompt('URL:');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                    else editor.chain().focus().unsetLink().run();
                }, <Link2 size={14} />, 'Link')}
            </div>
            <EditorContent editor={editor} />
            <style>{`
                .rich-editor-wrapper { border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; background: rgba(9,9,11,0.8); }
                .rich-toolbar { display: flex; gap: 4px; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(39,39,42,0.5); flex-wrap: wrap; }
                .rich-toolbar-btn { background: none; border: 1px solid transparent; border-radius: 4px; color: #71717A; cursor: pointer; padding: 5px 8px; transition: all 0.15s; display: flex; align-items: center; }
                .rich-toolbar-btn:hover { background: rgba(255,255,255,0.06); color: #FAFAFA; }
                .rich-toolbar-btn.active { background: rgba(37,99,235,0.2); border-color: rgba(37,99,235,0.4); color: #60A5FA; }
                .rich-editor-content { padding: 12px 16px; min-height: 100px; outline: none; color: #FAFAFA; font-size: 14px; line-height: 1.6; }
                .rich-editor-content p { margin: 0 0 8px 0; }
                .rich-editor-content ul { margin: 0 0 8px 16px; }
                .rich-editor-content a { color: #60A5FA; text-decoration: underline; }
            `}</style>
        </div>
    );
}
