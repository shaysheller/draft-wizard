import type { DraftSettings, InitialStateType } from "./context";
import { ActionType } from "./context";
import { type Teams } from "./context";

export function draftReducer(
  state: InitialStateType,
  action: DraftSettings
): InitialStateType {
  switch (action.type) {
    case ActionType.changeNumTeams:
      const obj: Record<number, Teams> = {};
      for (let i = 1; i <= state.NumTeams; i++) {
        obj[i] = {
          QB: [],
          WR: [],
          TE: [],
          RB: [],
          DST: [],
          K: [],
        };
      }
      return { ...state, NumTeams: action.payload, Rosters: obj };
    case ActionType.changePickNumber:
      return { ...state, PickNumber: action.payload };
    case ActionType.updateTeamRoster:
      const newDraftObj = { ...state.Rosters };
      const { pickNumber, player } = action.payload;
      const set = state.PickedPlayers;
      set.add(player.name);

      if (!newDraftObj[pickNumber]) {
        newDraftObj[pickNumber] = {
          QB: [],
          WR: [],
          TE: [],
          RB: [],
          DST: [],
          K: [],
        };
      }

      newDraftObj[pickNumber]?.[player.role].push(player); // typescript is not great at handling nested objects
      newDraftObj[pickNumber]?.[player.role].sort((a, b) => a.adp - b.adp);

      return { ...state, Rosters: { ...newDraftObj } };

    default:
      return state;
  }
}
