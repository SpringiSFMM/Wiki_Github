import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import './TipTapEditor.css';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  className = '',
  style,
  placeholder = 'Start writing...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'table'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className={`tiptap-editor ${className}`} style={style}>
      <div className="tiptap-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          type="button"
        >
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          type="button"
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          type="button"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          type="button"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          type="button"
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          type="button"
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          type="button"
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          type="button"
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          type="button"
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          type="button"
        >
          Right
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'is-active' : ''}
          type="button"
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          type="button"
        >
          Image
        </button>
        <div className="table-controls">
          <button
            onClick={() => {
              const rows = parseInt(window.prompt('Anzahl der Zeilen', '3') || '3');
              const cols = parseInt(window.prompt('Anzahl der Spalten', '3') || '3');
              
              editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
            }}
            type="button"
          >
            Tabelle einfügen
          </button>
          {editor.isActive('table') && (
            <>
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                type="button"
              >
                Spalte davor
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                type="button"
              >
                Spalte danach
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                type="button"
              >
                Spalte löschen
              </button>
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                type="button"
              >
                Zeile davor
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                type="button"
              >
                Zeile danach
              </button>
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                type="button"
              >
                Zeile löschen
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                type="button"
              >
                Tabelle löschen
              </button>
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                type="button"
              >
                Zellen verbinden
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                type="button"
              >
                Zelle teilen
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                type="button"
              >
                Kopfzelle umschalten
              </button>
            </>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
};

export default TipTapEditor;
