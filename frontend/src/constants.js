export const FIGHT_STATS_FANTASY_POINTS = {
  sigStrikesLanded: {
    displayName: "Significant Strikes",
    fantasyMultiplier: 0.1,
  },
  knockDowns: {
    displayName: "Knockdowns",
    fantasyMultiplier: 0.75,
  },
  takedownsLanded: {
    displayName: "Takedowns",
    fantasyMultiplier: 0.25,
  },
  submissions: {
    displayName: "Submissions",
    fantasyMultiplier: 0.5,
  },
  timeInControl: {
    displayName: "Control Time",
    fantasyMultiplier: 0.01,
  },
};

export const FIGHT_RESULT_FANTASY_POINTS = {
  win: {
    displayName: "Win",
    fantasyMultiplier: 3,
  },
  win_by_finish: {
    displayName: "Win by Finish",
    fantasyMultiplier: 5,
  },
  loss: {
    displayName: "Loss",
    fantasyMultiplier: -2,
  },
  loss_by_finish: {
    displayName: "Loss by Finish",
    fantasyMultiplier: -3,
  },
  draw: {
    displayName: "Draw",
    fantasyMultiplier: 0,
  },
  no_contest: {
    displayName: "No Contest",
    fantasyMultiplier: 0,
  },
};
