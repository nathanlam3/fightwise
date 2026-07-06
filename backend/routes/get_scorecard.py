import requests
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/scorecard")
def get_scorecard():
    get_resp = requests.get(
        "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
    ).json()

    return get_resp["events"][0]