import { useEffect, useState, useRef } from "react";

interface NewNotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: { title: string; content: string }) => void;
}

export default function NewNotePopup({
  isOpen,
  onClose,
  onSave,
}: NewNotePopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSave = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    onSave({ title, content });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="
        mx-auto my-auto p-0 
        rounded-xl shadow-2xl 
        backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm 
        w-full max-w-md 
        border border-mist-500"
    >
      <div className="p-6 bg-mist-900">
        <h2 className="text-xl font-bold text-mist-100 mb-4">
          Create New Note
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-mist-200 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="
                w-full px-3 py-2 
                border border-mist-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent 
                text-sm text-mist-100 bg-mist-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-mist-200 uppercase tracking-wider mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note Content"
              rows={4}
              className="
              w-full px-3 py-2
              border border-slate-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent 
              resize-none text-sm text-mist-100 bg-mist-800"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
              px-4 py-2 text-sm font-medium 
              text-mist-300 hover:text-mist-700
              hover:bg-mist-200 rounded-lg 
              transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
              px-4 py-2 text-sm font-medium 
              text-white bg-sky-500 hover:bg-sky-600 rounded-lg
              transition shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}