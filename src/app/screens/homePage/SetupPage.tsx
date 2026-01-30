import React from "react";

export default function FurnitureShowcase() {
  return (
    <section className="furniture-showcase">
      <div className="title-section">
        <p className="subtitle">Share your setup with</p>
        <h1 className="main-title">#ComfyZoneFurniture</h1>
      </div>

      <div className="image-grid">
        <div className="grid-item shelf">
          <img src="/img/hashtag-1.png" alt="Shelf" />
        </div>

        <div className="grid-item desk">
          <img src="/img/hashtag-2.png" alt="Desk" />
        </div>

        <div className="grid-item chair">
          <img src="/img/hashtag-3.png" alt="Chair" />
        </div>

        <div className="grid-item tables">
          <img src="/img/hashtag-4.png" alt="Tables" />
        </div>

        <div className="grid-item dining">
          <img src="/img/hashtag-5.png" alt="Dining" />
        </div>

        <div className="grid-item bedroom">
          <img src="/img/hashtag-6.png" alt="Bedroom" />
        </div>

        <div className="grid-item decor">
          <img src="/img/hashtag-7.png" alt="Decor" />
        </div>

        <div className="grid-item kitchen">
          <img src="/img/hashtag-8.png" alt="Kitchen" />
        </div>
      </div>
    </section>
  );
}
