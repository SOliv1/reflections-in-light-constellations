import { useEffect, useState } from "react";

export default function NotesPanel() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lightNotes") || "[]"); }
    catch { return []; }
  });
  const [text, setText] = useState(() => localStorage.getItem("lightNotesDraft") || "");

  useEffect(() => localStorage.setItem("lightNotes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("lightNotesDraft", text), [text]);

  const addNote = () => {
    const value = text.trim();
    if (!value) return;
    setNotes((current) => [{ id: Date.now(), text: value }, ...current]);
    setText("");
  };

  return (
    <div className="panel notes-panel">
      <label htmlFor="light-note-input">Write a light note</label>
      <textarea id="light-note-input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Let your thoughts settle here…" />
      <button type="button" className="add-button" onClick={addNote}>+ Add Note</button>

      <div className="tags-row">
        <span className="tag">Daily</span>
        <span className="tag">Dream</span>
        <span className="tag">Seasonal</span>
      </div>

      <ul className="drawer-saved-list">
        {notes.length === 0 && <li className="placeholder">Your light notes will appear here.</li>}
        {notes.map((note) => <li key={note.id}><span>{note.text}</span><button type="button" aria-label="Remove note" onClick={() => setNotes((current) => current.filter((entry) => entry.id !== note.id))}>×</button></li>)}
      </ul>
    </div>
  );
}
