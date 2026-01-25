"use client";

import { useRef, useState } from "react";

type Props = {
  id: string;
  title: string;
  onSave: (id: string, title: string) => Promise<void>;
  disabled?: boolean;
};

export default function EditableTaskTitle({ id, title, onSave, disabled = false }: Props) {
  const [value, setValue] = useState(title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    if (disabled) return;
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const cancel = () => {
    setValue(title);
    setEditing(false);
  };

  const save = async () => {
    if (value.trim() === title) return setEditing(false);

    try {
      setLoading(true);
      await onSave(id, value.trim());
    } finally {
      setLoading(false);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        disabled={loading || disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className="w-full border-b border-gray-300 bg-transparent focus:outline-none"
      />
    );
  }

  return (
    <span
      onClick={startEdit}
      className={disabled ? "cursor-default" : "cursor-pointer hover:underline"}
    >
      {title}
    </span>
  );
}
