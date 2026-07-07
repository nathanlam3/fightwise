export default function Scorecard({ scorecard, onSelectFighter }) {
  if (!scorecard) {
    return null;
  }

  const date = new Date("2026-07-11T21:00Z");

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

  const formatted_date = `${get("weekday")}, ${get("month")} ${get("day")} | ${time} ${get("timeZoneName")}`;

  const location = scorecard.competitions[0].venue;
  const venue = location.fullName;
  const city = location.address.city;
  const state = location.address.state;

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
                  justifySelf: "start",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <p>
                  <strong
                    onClick={() => onSelectFighter(redCorner.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                    style={{ cursor: "pointer", color: "#c0392b" }}
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
                  justifySelf: "end",
                }}
              />
            </div>
          );
        })}
    </div>
  );
}
