import { STATS_TO_GET } from "../constants";

export function calculateFantasyPoints(scorecard) {
  for (const competition of scorecard.competitions) {
    for (const competitor of competition.competitors) {
      let fantasy_total = 0;
      for (const [statKey, { displayName, fantasyMultiplier }] of Object.entries(STATS_TO_GET)) {
        const fantasy_value = competitor.statistics[statKey]["value"] * fantasyMultiplier;
        competitor.statistics[statKey]["fantasyValue"] = fantasy_value;
        fantasy_total += fantasy_value;
      }
      competitor.statistics["fantasyTotalValue"] = fantasy_total;
    }
  }
  return scorecard;
}
