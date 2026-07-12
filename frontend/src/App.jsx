import { useEffect, useState } from "react";
import fw_logo2 from "./assets/logos/fw_logo2.png";
import { calculateFantasyPoints } from "./utils/fantasy";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import FighterModal from "./FighterModal.jsx";
import CreateGameModal from "./CreateGameModal.jsx";
import Scorecard from "./Scorecard.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

function getSerpentineIndex(pickNumber, playerCount) {
  const round = Math.floor(pickNumber / playerCount);
  const positionInRound = pickNumber % playerCount;
  const isReversedRound = round % 2 === 1;
  return isReversedRound ? playerCount - 1 - positionInRound : positionInRound;
}

export default function App() {
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFighterId, setSelectedFighterId] = useState(null);
  const [isCreateGameModalOpen, setCreateGameModalOpen] = useState(false);

  const [gameCreated, setGameCreated] = useState(() => {
    return localStorage.getItem("fightwise_game_created") === "true";
  });

  useEffect(() => {
    localStorage.setItem("fightwise_game_created", gameCreated);
  }, [gameCreated]);

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("fightwise_players");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "", drafted_fighters: [] },
          { id: 2, name: "", drafted_fighters: [] },
        ];
  });

  useEffect(() => {
    localStorage.setItem("fightwise_players", JSON.stringify(players));
  }, [players]);

  // Mode of Draft
  const [draftMode, setDraftMode] = useState(() => {
    const saved = localStorage.getItem("fightwise_draft_mode");

    return saved === "Serpentine" || saved === "Fixed" ? saved : "Serpentine";
  });

  useEffect(() => {
    localStorage.setItem("fightwise_draft_mode", draftMode);
  }, [draftMode]);

  // Draft Order Setting
  const [draftOrderSetting, setDraftOrderSetting] = useState(() => {
    const saved = localStorage.getItem("fightwise_draft_order_setting");

    return saved === "Random" || saved === "InOrder" ? saved : "Random";
  });

  useEffect(() => {
    localStorage.setItem("fightwise_draft_order_setting", draftOrderSetting);
  }, [draftOrderSetting]);

  const handleDeleteGame = () => {
    setPlayers([
      { id: 1, name: "", drafted_fighters: [] },
      { id: 2, name: "", drafted_fighters: [] },
    ]);
    setGameCreated(false);
    setDraftMode("Serpentine");
    setDraftOrderSetting("Random");
    localStorage.removeItem("fightwise_players");
    localStorage.removeItem("fightwise_game_created");
    setCreateGameModalOpen(false);
  };

  useEffect(() => {
    const fetchScorecard = () => {
      return fetch("http://localhost:8000/api/scorecard")
        .then((res) => res.json())
        .then((scorecard) => {
          const updatedScorecard = calculateFantasyPoints(scorecard);
          setScorecard(updatedScorecard);
        })
        .catch(() => setScorecard("Scorecard not found"));
    };

    // Initial load: wait for both the fetch AND a minimum 500ms delay
    const minDelay = new Promise((resolve) => setTimeout(resolve, 500));

    Promise.all([fetchScorecard(), minDelay]).then(() => {
      setLoading(false);
    });

    // Poll every 2 minutes after that (background refreshes, no loading screen)
    const intervalId = setInterval(fetchScorecard, 2 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const eventStartTime = scorecard?.date ? new Date(scorecard.date).getTime() : null;
  const numFighters = scorecard?.competitions ? 2 * scorecard.competitions.length : null;

  const now = Date.now();

  const eventTooFarAway = false; //eventStartTime && now < eventStartTime - 24 * 60 * 60 * 1000
  const eventAlreadyStarted = false; //now > eventStartTime

  const [isDraftActive, setIsDraftActive] = useState(() => {
    return localStorage.getItem("fightwise_draft_active") === "true";
  });

  useEffect(() => {
    localStorage.setItem("fightwise_draft_active", isDraftActive);
  }, [isDraftActive]);

  const [draftOrder, setDraftOrder] = useState(() => {
    const saved = localStorage.getItem("fightwise_draft_order");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fightwise_draft_order", JSON.stringify(draftOrder));
  }, [draftOrder]);

  const [picksMade, setPicksMade] = useState(() => {
    const saved = localStorage.getItem("fightwise_picks_made");
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("fightwise_picks_made", picksMade);
  }, [picksMade]);

  const totalPicksAllowed =
    numFighters && players.length > 0
      ? Math.floor(numFighters / players.length) * players.length
      : 0;

  const picksRemaining = totalPicksAllowed - picksMade;
  const numRounds = totalPicksAllowed / players.length;
  const isDraftFinished = !isDraftActive && picksMade > 0 && picksMade >= totalPicksAllowed;

  const currentPlayer =
    isDraftActive && draftOrder.length > 0
      ? players.find((p) => {
          const index =
            draftMode === "Serpentine"
              ? getSerpentineIndex(picksMade, draftOrder.length)
              : picksMade % draftOrder.length;
          return p.id === draftOrder[index];
        })
      : null;

  const draftedFighterIds = new Set(players.flatMap((p) => p.drafted_fighters.map((f) => f.id)));

  const draftedByMap = players.reduce((map, player) => {
    player.drafted_fighters.forEach((fighter) => {
      map[fighter.id] = player.name;
    });
    return map;
  }, {});

  const handleStartDraft = () => {
    const order = players.map((p) => p.id);

    setDraftOrder(order);
    setPicksMade(0);
    setIsDraftActive(true);
  };

  const handleDraftFighter = (fighter) => {
    if (!isDraftActive || !currentPlayer) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === currentPlayer.id ? { ...p, drafted_fighters: [...p.drafted_fighters, fighter] } : p
      )
    );

    const newPicksMade = picksMade + 1;
    setPicksMade(newPicksMade);

    if (newPicksMade >= totalPicksAllowed) {
      setIsDraftActive(false);
    }
  };

  useEffect(() => {
    if (picksMade > 0) {
      window.scrollTo({ top: 375, behavior: "smooth" });
    }
  }, [picksMade]);

  const getFighterStatistics = (fighterId) => {
    if (!scorecard) return null;
    for (const competition of scorecard.competitions) {
      const match = competition.competitors.find((c) => c.id === fighterId);
      console.log(match)
      if (match) return match.statistics;
    }
    return null;
  };

  const playerFantasyTotals = players.reduce((totals, player) => {
    const total = player.drafted_fighters.reduce((sum, fighter) => {
      const liveStats = getFighterStatistics(fighter.id);
      return sum + (liveStats?.fantasyTotalValue || 0);
    }, 0);
    totals[player.id] = total;
    return totals;
  }, {});

  const handleResetAll = () => {
    if (
      !window.confirm(
        "This will reset everything — players, draft settings, and all picks. Continue?"
      )
    ) {
      return;
    }

    setPlayers([
      { id: 1, name: "", drafted_fighters: [] },
      { id: 2, name: "", drafted_fighters: [] },
    ]);
    setGameCreated(false);
    setDraftMode("Serpentine");
    setDraftOrderSetting("Random");
    setDraftOrder([]);
    setPicksMade(0);
    setIsDraftActive(false);

    localStorage.removeItem("fightwise_players");
    localStorage.removeItem("fightwise_game_created");
    localStorage.removeItem("fightwise_draft_mode");
    localStorage.removeItem("fightwise_draft_order_setting");
    localStorage.removeItem("fightwise_draft_active");
    localStorage.removeItem("fightwise_draft_order");
    localStorage.removeItem("fightwise_picks_made");

    setCreateGameModalOpen(false);
  };

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
              {!isDraftActive && !isDraftFinished && (
                <button
                  disabled={eventAlreadyStarted}
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
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseDown={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.transform = "scale(0.9)";
                  }}
                  onMouseUp={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {gameCreated ? "Update Game" : "Create Game"}
                </button>
              )}
              {eventAlreadyStarted && !gameCreated && (
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
              {!isDraftFinished && gameCreated && (
                <button
                  disabled={eventTooFarAway || isDraftActive}
                  onClick={handleStartDraft}
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
                    if (!gameCreated || eventTooFarAway || isDraftActive) return;
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    if (!gameCreated || eventTooFarAway || isDraftActive) return;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseDown={(e) => {
                    if (!gameCreated || eventTooFarAway || isDraftActive) return;
                    e.currentTarget.style.transform = "scale(0.9)";
                  }}
                  onMouseUp={(e) => {
                    if (!gameCreated || eventTooFarAway || isDraftActive) return;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {isDraftActive ? "Draft in Progress" : "Start Draft"}
                </button>
              )}
              {eventTooFarAway && gameCreated && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#888",
                  }}
                >
                  Start Draft is available 24 hours before the event.
                </p>
              )}
              {
                <button
                  disabled={eventAlreadyStarted}
                  onClick={handleResetAll}
                  style={{
                    marginTop: "1rem",
                    padding: "0.6rem 1rem",
                    fontSize: "1rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    border: "2px solid black",
                    background: "red",
                    borderRadius: "8px",
                    margin: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";
                    e.currentTarget.style.backgroundColor = "black";
                    e.currentTarget.style.color = "#ff0000";
                  }}
                  onMouseLeave={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "red";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseDown={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.transform = "scale(0.9)";
                  }}
                  onMouseUp={(e) => {
                    if (eventAlreadyStarted) return;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {"Reset"}
                </button>
              }
            </div>

            {isDraftFinished && (
              <table
                style={{
                  margin: "2rem auto",
                  borderCollapse: "collapse",
                  width: "100%",
                  maxWidth: "400px",
                  fontFamily: "sans-serif",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "0.6rem 1rem",
                        borderBottom: "2px solid black",
                        fontSize: "0.9rem",
                      }}
                    >
                      PLAYER
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "0.6rem 1rem",
                        borderBottom: "2px solid black",
                        fontSize: "0.9rem",
                      }}
                    >
                      POINTS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .slice()
                    .sort((a, b) => playerFantasyTotals[b.id] - playerFantasyTotals[a.id])
                    .map((player, index) => (
                      <tr key={player.id}>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "0.6rem 1rem",
                            borderBottom: "1px solid #ddd",
                            fontWeight:
                              index === 0 && playerFantasyTotals[player.id].toFixed(2) > 0
                                ? 700
                                : 400,
                          }}
                        >
                          {index === 0 && playerFantasyTotals[player.id].toFixed(2) > 0 && "🏆 "}
                          {player.name}
                        </td>
                        <td
                          style={{
                            textAlign: "right",
                            padding: "0.6rem 1rem",
                            borderBottom: "1px solid #ddd",
                            fontWeight:
                              index === 0 && playerFantasyTotals[player.id].toFixed(1) > 0
                                ? 700
                                : 400,
                          }}
                        >
                          {playerFantasyTotals[player.id].toFixed(2)} pts
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            <Scorecard
              scorecard={scorecard}
              onSelectFighter={setSelectedFighterId}
              isDraftActive={isDraftActive}
              currentPlayerName={currentPlayer?.name}
              draftedFighterIds={draftedFighterIds}
              draftedByMap={draftedByMap}
              onDraftFighter={handleDraftFighter}
              picksRemaining={picksRemaining}
              isDraftFinished={isDraftFinished}
              draftOrder={draftOrder}
              numRounds={players.length > 0 ? totalPicksAllowed / players.length : 0}
              players={players}
            />

            <FighterModal
              fighterId={selectedFighterId}
              onClose={() => setSelectedFighterId(null)}
            />

            {isCreateGameModalOpen && (
              <div className="modal-backdrop">
                <div className="modal-content animate-from-button">
                  <CreateGameModal
                    onClose={() => setCreateGameModalOpen(false)}
                    onSubmit={() => setGameCreated(true)}
                    onDelete={handleDeleteGame}
                    numFighters={numFighters}
                    players={players}
                    setPlayers={setPlayers}
                    draftMode={draftMode}
                    setDraftMode={setDraftMode}
                    draftOrderSetting={draftOrderSetting}
                    setDraftOrderSetting={setDraftOrderSetting}
                    gameCreated={gameCreated}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
