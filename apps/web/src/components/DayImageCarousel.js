import { useState, useEffect } from "react";
import "./DayImageCarousel.css";
import { fetchFromApi } from "../api";


const DayImageCarousel = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const response = await fetchFromApi("/api/gallery");
    const items = await response.json();

    const allPhotos = items.flatMap((item) => {
      if (Array.isArray(item?.photos)) {
        return item.photos;
      }

      return [item?.photoUrl || item?.imageUrl || item?.url];
    }).filter(Boolean);

    setImages(allPhotos);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="carousel">
      {images.map((src, i) => (
        <img key={i} src={src} alt="Day" />
      ))}
    </div>
  );
};

export default DayImageCarousel;
