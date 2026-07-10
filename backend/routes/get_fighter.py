import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/fighters/{fighter_id}")
def get_fighter(fighter_id: str):
    resp = requests.get(
        f"https://site.web.api.espn.com/apis/common/v3/sports/mma/ufc/athletes/{fighter_id}/overview"
    )

    data = resp.json()

    upcoming_fight = data.get("upcomingFight")
    competitors = upcoming_fight.get("competitors", []) if upcoming_fight else []

    competitor = next(
        (c for c in competitors if c["id"] == fighter_id),
        None
    )
    print(competitor.get("winner"))
    print(competitor)
    if not competitor:
        # Fallback: at least give the headshot, since that's constructible without any lookup
        return {
            "id": fighter_id,
            "name": None,
            "record": None,
            "height": None,
            "weight": None,
            "age": None,
            "fighting_style": None,
            "headshot_url": f"https://a.espncdn.com/i/headshots/mma/players/full/{fighter_id}.png",
            "country_flag_url": None,
            "has_upcoming_fight": False,
        }

    return {
        "id": competitor.get("id"),
        "name": competitor.get("displayName"),
        "record": competitor.get("record"),
        "height": competitor.get("displayHeight"),
        "weight": competitor.get("displayWeight"),
        "age": competitor.get("age"),
        "fighting_style": competitor.get("displayFightingStyle"),
        "headshot_url": competitor.get("headshot"),
        "country_flag_url": competitor.get("logo"),
        "has_upcoming_fight": True,
    }