import { useEffect, useState } from "react";

export default function FighterModal({ fighterId, onClose }) {
  const [fighter, setFighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!fighterId) return;

    setLoading(true);
    setError(false);

    fetch(`http://localhost:8000/api/fighters/${fighterId}`)
      .then((res) => res.json())
      .then((data) => {
        setFighter(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [fighterId]);

  if (!fighterId) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(114, 114, 114, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "2rem",
          width: "500px",
          maxWidth: "90%",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 30px rgba(255, 255, 255, 0.3)",
          border: "2px solid black",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            border: "none",
            background: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>

        {loading && <p>Loading fighter...</p>}
        {error && <p>Could not load fighter info.</p>}

        {fighter && !loading && !error && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "2rem",
              }}
            >
              <img
                src={fighter.headshot_url}
                alt={fighter.name || "Fighter"}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10%",
                  objectFit: "cover",
                  border: "5px solid #000000",
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                  alignItems: "flex-start",
                  height: "150px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {(() => {
                    const name = (fighter.name || "Unknown Fighter").toUpperCase();
                    const parts = name.split(" ");

                    const first = parts[0];
                    const rest = parts.slice(1).join(" ");

                    return (
                      <>
                        <div
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            fontWeight: 800,
                            fontSize: "2rem",
                            letterSpacing: "1.5px",
                            lineHeight: 1,
                          }}
                        >
                          {first}
                        </div>

                        {rest && (
                          <div
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              fontWeight: 800,
                              fontSize: "2rem",
                              letterSpacing: "1.5px",
                              lineHeight: 1,
                            }}
                          >
                            {rest}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {fighter.country_flag_url && (
                  <img
                    src={fighter.country_flag_url}
                    alt="country"
                    style={{
                      width: "100px",
                    }}
                  />
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "max-content max-content",
                rowGap: "0.5rem",
                columnGap: "65px",
                fontSize: "1rem",
                marginTop: "1rem",
                width: "100%",
                justifyItems: "start",
                textAlign: "left",
              }}
            >
              <div>
                <strong>Height:</strong> {fighter.height || "N/A"}
              </div>
              <div>
                <strong>Record:</strong> {fighter.record || "N/A"}
              </div>
              <div>
                <strong>Weight:</strong> {fighter.weight || "N/A"}
              </div>
              <div>
                <strong>Style:</strong> {fighter.fighting_style || "N/A"}
              </div>
              <div>
                <strong>Age:</strong> {fighter.age || "N/A"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
