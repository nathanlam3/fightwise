import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/scorecard")
def get_scorecard():
    get_resp = requests.get(
        "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
    ).json()

    scorecard = get_resp["events"][0]
    event_id = scorecard["id"]
    for competition in scorecard["competitions"]:
        competition_id = competition["id"]
        for competitor in competition["competitors"]:
            competitor_id = competitor["id"]
            competitor_stats = requests.get(
                f"https://sports.core.api.espn.com/v2/sports/mma/leagues/ufc/events/{event_id}/competitions/{competition_id}/competitors/{competitor_id}/statistics"
            ).json()["splits"]["categories"][0]["stats"]

            stats_by_name = {
                stat["name"]: {k: v for k, v in stat.items() if k != "name"}
                for stat in competitor_stats
            }
            
            competitor["statistics"] = stats_by_name

    return scorecard