import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";

export default function RTE({ name, control, label, defaultValue = "" }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const contentStyle = isDarkMode
    ? "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #333; color: white; }"
    : "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: white; color: black; }";

  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            value={value} // keeps editor content synced
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
              content_style: contentStyle,
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
