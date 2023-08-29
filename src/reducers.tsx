import type { DraftSettings, InitialStateType } from "./context";
import { ActionType } from "./context";
import { type Teams } from "./context";
import { cloneDeep } from "lodash";

export function draftReducer(
  state: InitialStateType,
  action: DraftSettings
): InitialStateType {
  switch (action.type) {
    case ActionType.changeNumTeams:
      const obj: Record<number, Teams> = {};
      for (let i = 1; i <= action.payload; i++) {
        obj[i] = {
          QB: [],
          WR: [],
          TE: [],
          RB: [],
          DST: [],
          K: [],
        };
      }
      return { ...state, Rosters: obj };
    case ActionType.changePickNumber:
      return { ...state, PickNumber: action.payload };
    case ActionType.updateTeamRoster:
      const newDraftObj = cloneDeep(state.Rosters);
      const { player } = action.payload;

      const totalTeams = Object.keys(state.Rosters).length;
      state.PickedPlayers.add(player.name);
      const currentPick = state.PickedPlayers.size;

      let round;
      let pickNumber;

      // algorithm for determining whose pick it is to determine which roster to add the player to

      if (currentPick % totalTeams === 0) round = currentPick / totalTeams;
      else round = Math.floor(currentPick / totalTeams) + 1;

      if (round % 2 === 0) {
        if (currentPick % totalTeams === 0) pickNumber = 1;
        else pickNumber = totalTeams - (currentPick % totalTeams) + 1;
      } else {
        if (currentPick % totalTeams === 0) pickNumber = totalTeams;
        else pickNumber = currentPick % totalTeams;
      }

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
      console.log(newDraftObj);

      return {
        ...state,
        PickedPlayers: new Set(state.PickedPlayers),
        Rosters: { ...newDraftObj },
      };

    case ActionType.updatePick:
      return { ...state, Pick: state.Pick + 1 };

    default:
      return state;
  }
}
