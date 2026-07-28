import React from "react";
import "../../styles/mobile.css";

export default function TodayButton({ onClick }) {
  return (
    <button className="today-button" onClick={onClick}>
      Today
    </button>
  );
}
