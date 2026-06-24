// components/ui/CkEditor.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autosave,
  Essentials,
  Paragraph,
  Autoformat,
  ImageInsertViaUrl,
  ImageBlock,
  ImageToolbar,
  AutoImage,
  BlockQuote,
  Bold,
  CloudServices,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Link,
  ImageUpload,
  Heading,
  ImageCaption,
  ImageInline,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  Indent,
  IndentBlock,
  Italic,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  PasteFromOffice,
  Table,
  TableToolbar,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TextTransformation,
  TodoList,
  Underline,
  Mention,
  BalloonToolbar,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "../../ckeditor.css";

const LICENSE_KEY = "GPL";

interface CkEditorProps<T extends FieldValues> {
  title?: string;
  name: Path<T>;
  placeholder?: string;
  control: Control<T>;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
  defaultValue?: string;
}

export default function CkEditor<T extends FieldValues>({
  title,
  name,
  placeholder = "Type or paste your content here!",
  control,
  required = false,
  className = "",
  disabled = false,
  minHeight = "200px",
  defaultValue = "",
}: CkEditorProps<T>) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = useMemo(() => {
    if (!isLayoutReady) {
      return null;
    }

    return {
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "link",
          "mediaEmbed",
          "insertTable",
          "blockQuote",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Autoformat,
        AutoImage,
        Autosave,
        BalloonToolbar,
        BlockQuote,
        Bold,
        CloudServices,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Essentials,
        Heading,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
      ],
      balloonToolbar: [
        "bold",
        "italic",
        "|",
        "link",
        "|",
        "bulletedList",
        "numberedList",
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5",
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6",
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      image: {
        toolbar: [
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
          toggleDownloadable: {
            mode: "manual",
            label: "Downloadable",
            attributes: {
              download: "file",
            },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      mention: {
        feeds: [
          {
            marker: "@",
            feed: [],
          },
        ],
      },
      placeholder,
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
    };
  }, [isLayoutReady, placeholder]);

  return (
    <div className={className}>
      {title && (
        <label className="mb-2 block text-sm font-medium">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue as any}
        rules={{
          required: required ? `${title || "This field"} is required` : false,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div
              ref={editorContainerRef}
              style={{
                border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
                borderRadius: "0.375rem",
                overflow: "hidden",
              }}
            >
              <div ref={editorRef}>
                {editorConfig && (
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={field.value || defaultValue || ""}
                    disabled={disabled}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      field.onChange(data);
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              </div>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
            <style>{`
              .ck-editor__editable {
                min-height: ${minHeight};
                max-height: 500px;
              }
            `}</style>
          </>
        )}
      />
    </div>
  );
}
