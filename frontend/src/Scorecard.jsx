import { useEffect, useState } from "react";
import FighterModal from "./FighterModal.jsx";

export default function App() {
  const [scorecard, setScorecard] = useState(null);
  const [selectedFighterId, setSelectedFighterId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/scorecard")
      .then((res) => res.json())
      .then((scorecard) => setScorecard(scorecard))
      .catch(() => setScorecard("Scorecard not found"));
  }, []);

  {
    scorecard && (
      <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "2rem auto" }}>
        <h2>{scorecard.name}</h2>
        {scorecard.competitions
          .slice()
          .reverse()
          .map((competition) => {
            const weightclass = competition.type.abbreviation;
            const fighters = competition.competitors;
            const redCorner = fighters[0];
            const blueCorner = fighters[1];
            const status = competition.status.type.description;

            return (
              <div
                key={competition.id}
                style={{ borderBottom: "1px solid #ddd", padding: "1rem 0" }}
              >
                <p>
                  <strong
                    onClick={() => {
                      console.log("CLICKED", redCorner);
                      setSelectedFighterId(redCorner.id);
                    }}
                    style={{ cursor: "pointer", color: "#c0392b" }}
                  >
                    {redCorner.athlete.displayName}
                  </strong>
                  {" vs "}
                  <strong
                    onClick={() => setSelectedFighterId(blueCorner.id)}
                    style={{ cursor: "pointer", color: "#2980b9" }}
                  >
                    {blueCorner.athlete.displayName}
                  </strong>
                </p>
                <p>Weightclass: {weightclass}</p>
                <p>Status: {status}</p>
              </div>
            );
          })}
      </div>
    );
  }

  <FighterModal fighterId={selectedFighterId} onClose={() => setSelectedFighterId(null)} />;
}
