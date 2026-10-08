import { useState } from "react";

const cropData = {
  Monsoon: [
    ["Rice", "🌾"],
    ["Maize", "🌽"],
    ["Soybean", "🌱"],
    ["Groundnut", "🥜"],
    ["Cotton", "🌿"]
  ],
  Winter: [
    ["Wheat", "🌾"],
    ["Onion", "🧅"],
    ["Potato", "🥔"],
    ["Tomato", "🍅"],
    ["Chickpea", "🌱"]
  ],
  Summer: [
    ["Watermelon", "🍉"],
    ["Cucumber", "🥒"],
    ["Muskmelon", "🍈"],
    ["Groundnut", "🥜"],
    ["Vegetables", "🥬"]
  ]
};

function CropDetection() {
  const [season, setSeason] = useState("");

  return (
    <main className="page-shell crop-page">
      <div className="page-heading centered">
        <div>
          <span className="eyebrow">
            SMART AGRICULTURE
          </span>
          <h1>Seasonal Crop Matching</h1>
          <p>
            Select a farming season to discover crops
            suitable for cultivation.
          </p>
        </div>
      </div>

      <div className="season-selector">
        {Object.keys(cropData).map((item) => (
          <button
            key={item}
            className={
              season === item
                ? "season-button selected"
                : "season-button"
            }
            onClick={() => setSeason(item)}
          >
            {item === "Monsoon" && "🌧️"}
            {item === "Winter" && "❄️"}
            {item === "Summer" && "☀️"} {item}
          </button>
        ))}
      </div>

      {season ? (
        <section className="crop-result-card">
          <div className="section-heading compact">
            <span className="eyebrow">RECOMMENDATIONS</span>
            <h2>Crops suitable for {season}</h2>
          </div>

          <div className="crop-grid">
            {cropData[season].map(
              ([crop, icon]) => (
                <article
                  className="crop-card"
                  key={crop}
                >
                  <span className="crop-icon">
                    {icon}
                  </span>
                  <h3>{crop}</h3>
                  <p>
                    Suitable for {season} cultivation
                  </p>
                </article>
              )
            )}
          </div>
        </section>
      ) : (
        <div className="state-card crop-empty">
          <span className="empty-icon">🌱</span>
          <h3>Choose a season</h3>
          <p>
            Your seasonal crop recommendations will
            appear here.
          </p>
        </div>
      )}
    </main>
  );
}

export default CropDetection;
