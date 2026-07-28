import React from "react";
import "../../styles/mobile.css";

const CATEGORIES = [
  { id: "short-reflections", label: "Short Reflections", icon: "✨" },
  { id: "quiet-actions", label: "Quiet Actions", icon: "🌿" },
  { id: "light-notes", label: "Light Notes", icon: "📝" },
  { id: "quote-of-day", label: "Quote of the Day", icon: "💫" }
];

export default function CategoryTiles({ onSelectCategory }) {
  return (
    <div className="category-grid" id="scene-drawer">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          className="category-tile"
          onClick={() => onSelectCategory(category.id)}
          aria-label={category.label}
        >
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}
