import { useEffect, useState } from "react";

export default function ActionsPanel() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("quietActions") || "[]"); }
    catch { return []; }
  });
  const [text, setText] = useState(() => localStorage.getItem("quietActionsDraft") || "");

  useEffect(() => localStorage.setItem("quietActions", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("quietActionsDraft", text), [text]);

  const addItem = () => {
    const value = text.trim();
    if (!value) return;
    setItems((current) => [{ id: Date.now(), text: value }, ...current]);
    setText("");
  };

  return (
    <div className="panel actions-panel">
      <label htmlFor="quiet-action-input">Add a quiet action</label>
      <div className="drawer-entry-row">
        <input id="quiet-action-input" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addItem(); }} placeholder="Add a gentle intention…" />
        <button type="button" className="add-button" onClick={addItem}>+ Add Action</button>
      </div>

      <ul className="drawer-saved-list">
        {items.length === 0 && <li className="placeholder">Your quiet actions will gather here.</li>}
        {items.map((item) => <li key={item.id}><span>{item.text}</span><button type="button" aria-label={`Remove ${item.text}`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>×</button></li>)}
      </ul>
    </div>
  );
}
