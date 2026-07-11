import FightStats from "./FightStats";

export default function Scorecard({
  scorecard,
  onSelectFighter,
  isDraftActive,
  currentPlayerName,
  draftedFighterIds,
  draftedByMap,
  onDraftFighter,
  picksRemaining,
  isDraftFinished,
}) {
  if (!scorecard) {
    return null;
  }

  const date = new Date(scorecard.date);

  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value;

  const time =
    get("minute") === "00"
      ? `${get("hour")}${get("dayPeriod")}`
      : `${get("hour")}:${get("minute")}${get("dayPeriod")}`;

  const formatted_date = `${get("month")} ${get("day")} | ${time} ${get("timeZoneName")}`;

  
  const location = scorecard.competitions[0].venue;
  const venue = location.fullName;
  const city = location.address.city;
  const state = location.address.state;

  const now = Date.now();
  const eventStarted = now > date.getTime()

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 800, margin: "2rem auto" }}>
      <h2>{scorecard.name}</h2>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 400,
        }}
      >
        {venue}, {city}, {state}
      </p>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 400,
        }}
      >
        {formatted_date}
      </p>

      {isDraftActive && currentPlayerName && (
        <div
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            marginBottom: "1rem",
            padding: "0.8rem 1.8rem",
            borderRadius: "15px",
            background: "#89cfa6",
            boxShadow: "0 10px 30px rgba(56, 176, 58, 0.5)",
          }}
        >
          <p
            style={{
              fontFamily: "'Tahoma', sans-serif",
              fontSize: "21px",
              fontWeight: 600,
              color: "#3b3b3b",
              margin: 0,
              letterSpacing: "0.09em",
            }}
          >
            <strong>NEXT PICK: {currentPlayerName.toUpperCase()}</strong>
          </p>
        </div>
      )}
      {isDraftActive && (
        <p
          style={{
            fontSize: "15px",
            fontWeight: 400,
            color: "#888",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          {picksRemaining} pick{picksRemaining === 1 ? "" : "s"} remaining
        </p>
      )}

      {isDraftFinished && !eventStarted && (
        <p
          style={{
            fontSize: "16px",
            fontWeight: 700,
            marginTop: "0.5rem",
            marginBottom: "1rem",
            color: "#27ae60",
          }}
        >
          Draft complete! All picks have been made.
        </p>
      )}

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
                borderBottom: "1px solid #ddd",
                padding: "1rem 0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr 100px",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {draftedByMap[redCorner.id] && (
                    <div
                      style={{
                        position: "relative",
                        zIndex: -1,
                        marginBottom: "-10px",
                        background: "#89cfa6",
                        padding: "0.3rem 1rem 0.3rem",
                        borderRadius: "5px",
                        border: "3px solid #3b3b3b",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Tahoma', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#3b3b3b",
                          margin: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {draftedByMap[redCorner.id].toUpperCase()}
                      </p>
                    </div>
                  )}
                  <img
                    src={redHeadshotUrl}
                    alt={redCorner.athlete.displayName}
                    onClick={() => onSelectFighter(redCorner.id)}
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
                    }}
                  />
                  {isDraftActive && (
                    <button
                      type="button"
                      onClick={() =>
                        onDraftFighter({
                          id: redCorner.id,
                          name: redCorner.athlete.displayName,
                          opponentId: blueCorner.id,
                          statistics: redCorner.statistics,
                        })
                      }
                      disabled={draftedFighterIds.has(redCorner.id)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: "2px solid #27ae60",
                        background: draftedFighterIds.has(redCorner.id) ? "#eee" : "white",
                        color: draftedFighterIds.has(redCorner.id) ? "#aaa" : "#27ae60",
                        cursor: draftedFighterIds.has(redCorner.id) ? "not-allowed" : "pointer",
                      }}
                    >
                      {draftedFighterIds.has(redCorner.id) ? "Drafted" : "Draft"}
                    </button>
                  )}
                </div>

                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "Monaco",
                      textTransform: "uppercase",
                      fontWeight: 800,
                      color: "#4d4d4d",
                    }}
                  >
                    {weightclass} bout
                  </p>
                  <p>
                    <strong
                      onClick={() => onSelectFighter(redCorner.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = "none";
                      }}
                      style={{ fontSize: "17px", cursor: "pointer", color: "#c0392b" }}
                    >
                      {redCorner.athlete.displayName}
                    </strong>
                    {" vs "}
                    <strong
                      onClick={() => onSelectFighter(blueCorner.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = "none";
                      }}
                      style={{ fontSize: "17px", cursor: "pointer", color: "#2980b9" }}
                    >
                      {blueCorner.athlete.displayName}
                    </strong>
                  </p>
                  <p
                    style={{
                      fontFamily: "Monaco",
                      textTransform: "uppercase",
                      fontWeight: 800,
                      fontSize: "13px",
                      color: "#767676",
                    }}
                  >
                    {status}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {draftedByMap[blueCorner.id] && (
                    <div
                      style={{
                        position: "relative",
                        zIndex: -1,
                        marginBottom: "-10px",
                        background: "#89cfa6",
                        padding: "0.3rem 1rem 0.3rem",
                        borderRadius: "5px",
                        border: "3px solid #3b3b3b",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Tahoma', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#3b3b3b",
                          margin: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {draftedByMap[blueCorner.id].toUpperCase()}
                      </p>
                    </div>
                  )}
                  <img
                    src={blueHeadshotUrl}
                    alt={blueCorner.athlete.displayName}
                    onClick={() => onSelectFighter(blueCorner.id)}
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
                    }}
                  />
                  {isDraftActive && (
                    <button
                      type="button"
                      onClick={() =>
                        onDraftFighter({
                          id: blueCorner.id,
                          name: blueCorner.athlete.displayName,
                          opponentId: redCorner.id,
                        })
                      }
                      disabled={draftedFighterIds.has(blueCorner.id)}
                      style={{
                        padding: "0.3rem 0.8rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: "2px solid #27ae60",
                        background: draftedFighterIds.has(blueCorner.id) ? "#eee" : "white",
                        color: draftedFighterIds.has(blueCorner.id) ? "#aaa" : "#27ae60",
                        cursor: draftedFighterIds.has(blueCorner.id) ? "not-allowed" : "pointer",
                      }}
                    >
                      {draftedFighterIds.has(blueCorner.id) ? "Drafted" : "Draft"}
                    </button>
                  )}
                </div>
              </div>

              <FightStats competition={competition} />
            </div>
          );
        })}
    </div>
  );
}
