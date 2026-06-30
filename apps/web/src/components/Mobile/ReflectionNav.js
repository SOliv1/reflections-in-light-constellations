import React from "react";
import "../../styles/mobile.css";

export default function ReflectionNav({
  current = 1,
  total = 30,
  onPrevious,
  onNext
}) {
  return (
    <div className="reflection-nav">
      <button className="nav-button" onClick={onPrevious}>
        Previous
      </button>

      <div className="nav-spacer">
        <span>{current} of {total}</span>
      </div>

      <button className="nav-button" onClick={onNext}>
        Next
      </button>
    </div>
  );
}
