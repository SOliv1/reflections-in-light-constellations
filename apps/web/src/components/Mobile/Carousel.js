import React, { useRef, useEffect } from "react";
import "../../styles/mobile.css";

export default function Carousel({
  items = 30,
  activeIndex = 1,
  onSelectItem
}) {
  const carouselRef = useRef(null);

  // Auto-scroll active item into view
  useEffect(() => {
    if (!carouselRef.current) return;

    const activeItem = carouselRef.current.querySelector(
      `.carousel-item.active`
    );
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeIndex]);

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-ribbon">
        {Array.from({ length: items }).map((_, i) => {
          const itemNum = i + 1;
          return (
            <button
              key={itemNum}
              className={`carousel-item ${
                itemNum === activeIndex ? "active" : ""
              }`}
              onClick={() => onSelectItem(itemNum)}
              aria-label={`Reflection ${itemNum}`}
              aria-current={itemNum === activeIndex ? "true" : "false"}
            >
              {itemNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
