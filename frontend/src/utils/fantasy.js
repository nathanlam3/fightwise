import { FIGHT_STATS_FANTASY_POINTS, FIGHT_RESULT_FANTASY_POINTS } from "../constants";

export function calculateFantasyPoints(scorecard) {
  for (const competition of scorecard.competitions) {
    const competition_status = competition.status.type.name
    const competition_display_clock = competition.status.displayClock
    for (const competitor of competition.competitors) {
      let fantasy_total = 0;
      competitor.statistics["fightResult"] = { fantasyValue: 0, displayName: "N/A" };
      for (const [statKey, { displayName, fantasyMultiplier }] of Object.entries(
        FIGHT_STATS_FANTASY_POINTS
      )) {
        const fantasy_value = Math.round(competitor.statistics[statKey]["value"] * fantasyMultiplier * 100)/ 100;
        competitor.statistics[statKey]["fantasyValue"] = fantasy_value;
        fantasy_total += fantasy_value;
      }
      
      if (competition_status === "STATUS_FINAL") {
        let fight_result;
        if (competition_display_clock === "5:00") {
          fight_result = competitor.winner ? "win": "loss" 
        }
        else {
          fight_result = competitor.winner ? "win_by_finish": "loss_by_finish"
        }
        //const fight_result = competitor.winner ? "win_by_finish": "loss_by_finish"
        const fight_result_value = Math.round(FIGHT_RESULT_FANTASY_POINTS[fight_result].fantasyMultiplier * 100) / 100;
        competitor.statistics["fightResult"]["fantasyValue"] = fight_result_value;
        competitor.statistics["fightResult"]["displayName"] = FIGHT_RESULT_FANTASY_POINTS[fight_result].displayName;
        fantasy_total += fight_result_value;
      }

      competitor.statistics["fantasyTotalValue"] = Math.round(fantasy_total * 100) / 100;
    }
  }
  return scorecard;
}
