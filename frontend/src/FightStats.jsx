import { useState } from "react";
import { FIGHT_STATS_FANTASY_POINTS } from "./constants";
import React from "react";

export default function FightStats({ competition }) {
  const [open, setOpen] = useState(false);
  const redCornerStats = competition.competitors[0].statistics;
  const blueCornerStats = competition.competitors[1].statistics;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{
          maxHeight: open ? "300px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            rowGap: "0.9rem",
            alignItems: "center",
          }}
        >
          <FightStatsRow
            redStatValue={"N/A"}
            redFantasyValue={0}
            statLabel={"Fight Result"}
            blueFantasyValue={0}
            blueStatValue={"N/A"}
            statLabelFontWeight={800}
          />
          {Object.entries(FIGHT_STATS_FANTASY_POINTS).map(
            ([statKey, { displayName: statLabel, fantasyMultiplier }]) => (
              <React.Fragment key={statKey}>
                <FightStatsRow
                  redStatValue={redCornerStats[statKey].displayValue}
                  redFantasyValue={redCornerStats[statKey].fantasyValue}
                  statLabel={statLabel}
                  blueFantasyValue={blueCornerStats[statKey].fantasyValue}
                  blueStatValue={blueCornerStats[statKey].displayValue}
                />
              </React.Fragment>
            )
          )}
          <div
            style={{
              gridColumn: "1 / -1",
              height: "1px",
              backgroundColor: "#ddd",
            }}
          />
          <FightStatsRow
            redStatValue={redCornerStats["fantasyTotalValue"]}
            redFantasyValue={0}
            statLabel={"TOTAL"}
            blueFantasyValue={0}
            blueStatValue={blueCornerStats["fantasyTotalValue"]}
            statLabelFontWeight={800}
            showFantasyValue={false}
          />
        </div>
      </div>
    </div>
  );
}

export function FightStatsRow({
  redStatValue,
  redFantasyValue,
  statLabel,
  blueFantasyValue,
  blueStatValue,
  statLabelFontWeight = 500,
  showFantasyValue = true,
}) {
  return (
    <>
      <div
        style={{
          justifySelf: "start",
          fontWeight: 700,
        }}
      >
        {redStatValue}
        <span
          style={{
            opacity: showFantasyValue ? 1 : 0,
            marginLeft: "6px",
            fontSize: "13px",
            color: "#888",
            fontWeight: 500,
          }}
        >
          ({redFantasyValue})
        </span>
      </div>

      <div
        style={{
          fontFamily: "'Oswald', sans-serif",
          textTransform: "uppercase",
          fontWeight: statLabelFontWeight,
          fontSize: "14px",
          textAlign: "center",
          letterSpacing: "1px",
          color: "#555",
        }}
      >
        {statLabel}
      </div>

      <div
        style={{
          justifySelf: "end",
          fontWeight: 700,
        }}
      >
        <span
          style={{
            opacity: showFantasyValue ? 1 : 0,
            marginRight: "6px",
            fontSize: "13px",
            color: "#888",
            fontWeight: 500,
          }}
        >
          ({blueFantasyValue})
        </span>
        {blueStatValue}
      </div>
    </>
  );
}
