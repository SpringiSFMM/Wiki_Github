import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
}

// Eine Wrapper-Komponente für ReactQuill, die die findDOMNode-Warnung vermeidet
export const RichTextEditor = forwardRef<ReactQuill, RichTextEditorProps>(
  ({ value, onChange, className, style, placeholder }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    // Expose the quill instance to parent components
    useImperativeHandle(ref, () => quillRef.current as ReactQuill);

    const modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }]
      ]
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video',
      'color', 'background',
      'align'
    ];

    return (
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className={`bg-white text-dark-950 ${className || ''}`}
        style={style}
        placeholder={placeholder}
      />
    );
  }
);

export default RichTextEditor;
