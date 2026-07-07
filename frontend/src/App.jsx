import { useEffect, useState } from "react";
import fw_logo2 from "./assets/logos/fw_logo2.png";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import FighterModal from "./FighterModal.jsx";
import CreateGameModal from "./CreateGameModal.jsx";
import Scorecard from "./Scorecard.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function App() {
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFighterId, setSelectedFighterId] = useState(null);
  const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/scorecard")
      .then((res) => res.json())
      .then((scorecard) => {
        setScorecard(scorecard);

        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch(() => setScorecard("Scorecard not found"));
  }, []);

  const eventStartTime = scorecard?.date ? new Date(scorecard.date).getTime() : null;

  const now = Date.now();

  const eventTooFarAway = false; //eventStartTime && now < eventStartTime - 24 * 60 * 60 * 1000
  const eventAlreadyStarted = false; //now > eventStartTime

  return (
    <>
      <AnimatePresence>{<LoadingScreen visible={loading} />}</AnimatePresence>
      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "1rem" }}>
            <motion.img
              layoutId="fw-logo"
              src={fw_logo2}
              alt="FW Logo"
              style={{
                width: "300px",
                height: "auto",
              }}
            />
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
                  margin: "6px",
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
              <button
                disabled={!gameCreated}
                onClick={() => setCreateGameModalOpen(true)}
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                  border: "2px solid black",
                  background: "white",
                  borderRadius: "8px",
                  margin: "6px",
                }}
                onMouseEnter={(e) => {
                  if (!gameCreated) return;
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
                  e.currentTarget.style.backgroundColor = "black";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  if (!gameCreated) return;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#000000";
                }}
                onMouseDown={(e) => {
                  if (!gameCreated) return;
                  e.currentTarget.style.transform = "scale(0.8)";
                }}
                onMouseUp={(e) => {
                  if (!gameCreated) return;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Start Draft
              </button>
            </div>

            <Scorecard scorecard={scorecard} onSelectFighter={setSelectedFighterId} />

            <FighterModal
              fighterId={selectedFighterId}
              onClose={() => setSelectedFighterId(null)}
            />

            {isCreateGameModalOpen && (
              <div className="modal-backdrop">
                <div className="modal-content animate-from-button">
                  <CreateGameModal onClose={() => setCreateGameModalOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
