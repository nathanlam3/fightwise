import { useEffect, useState } from "react";
import fw_logo2 from "./assets/logos/fw_logo2.png";
import FighterModal from "./FighterModal.jsx";
import CreateGameModal from "./CreateGameModal.jsx";

export default function App() {
  const [scorecard, setScorecard] = useState(null);
  const [selectedFighterId, setSelectedFighterId] = useState(null);
  const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/scorecard")
      .then((res) => res.json())
      .then((scorecard) => setScorecard(scorecard))
      .catch(() => setScorecard("Scorecard not found"));
  }, []);

  const eventStartTime = scorecard?.date ? new Date(scorecard.date).getTime() : null;

  const now = Date.now();

  const eventTooFarAway = now == eventStartTime; //eventStartTime && now < eventStartTime - 24 * 60 * 60 * 1000
  const eventAlreadyStarted = false; //now > eventStartTime

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "1rem" }}>
      <img src={fw_logo2} alt="fw_logo2" style={{ width: "300px", height: "auto" }} />
      <div>
        <button
          disabled={eventTooFarAway || eventAlreadyStarted}
          onClick={() => setCreateGameModalOpen(true)}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1rem",
            fontSize: "1rem",
            cursor: "pointer",
            border: "2px solid black",
            background: "white",
            borderRadius: "8px",
          }}
          onMouseEnter={(e) => {
            if (eventTooFarAway || eventAlreadyStarted) return;
            e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
            e.currentTarget.style.backgroundColor = "black";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            if (eventTooFarAway || eventAlreadyStarted) return;
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#000000";
          }}
          onMouseDown={(e) => {
            if (eventTooFarAway || eventAlreadyStarted) return;
            e.currentTarget.style.transform = "scale(0.8)";
          }}
          onMouseUp={(e) => {
            if (eventTooFarAway || eventAlreadyStarted) return;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Create Game
        </button>
        {eventTooFarAway && (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            Create Game is available 24 hours before the event.
          </p>
        )}
        {eventAlreadyStarted && (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#888",
            }}
          >
            Event has already started. Cannot create game.
          </p>
        )}
      </div>

      {scorecard && (
        <div style={{ fontFamily: "sans-serif", maxWidth: 800, margin: "2rem auto" }}>
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

              const redHeadshotUrl = `https://a.espncdn.com/i/headshots/mma/players/full/${redCorner.id}.png`;
              const blueHeadshotUrl = `https://a.espncdn.com/i/headshots/mma/players/full/${blueCorner.id}.png`;

              return (
                <div
                  key={competition.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 100px",
                    alignItems: "center",
                    gap: "1rem",
                    borderBottom: "1px solid #ddd",
                    padding: "1rem 0",
                  }}
                >
                  <img
                    src={redHeadshotUrl}
                    alt={redCorner.athlete.displayName}
                    onClick={() => setSelectedFighterId(redCorner.id)}
                    onError={(e) => {
                      e.target.style.visibility = "hidden";
                    }}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10%",
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "4px solid #c0392b",
                      justifySelf: "start",
                    }}
                  />

                  <div style={{ textAlign: "center" }}>
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

                  <img
                    src={blueHeadshotUrl}
                    alt={blueCorner.athlete.displayName}
                    onClick={() => setSelectedFighterId(blueCorner.id)}
                    onError={(e) => {
                      e.target.style.visibility = "hidden";
                    }}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10%",
                      objectFit: "cover",
                      cursor: "pointer",
                      border: "4px solid #2980b9",
                      justifySelf: "end",
                    }}
                  />
                </div>
              );
            })}
        </div>
      )}

      <FighterModal fighterId={selectedFighterId} onClose={() => setSelectedFighterId(null)} />

      {isCreateGameModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content animate-from-button">
            <CreateGameModal onClose={() => setCreateGameModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
