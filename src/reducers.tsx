import type { DraftSettings, InitialStateType } from "./context";
import { ActionType } from "./context";
import { type Teams } from "./context";
import { cloneDeep } from "lodash";

export function draftReducer(
  state: InitialStateType,
  action: DraftSettings
): InitialStateType {
  switch (action.type) {
    case ActionType.setInitialDraftSettings:
      const { numTeams, draftPick, numRounds } = action.payload;
      const obj: Record<number, Teams> = {};
      for (let i = 1; i <= numTeams; i++) {
        obj[i] = {
          QB: [],
          WR: [],
          TE: [],
          RB: [],
          DST: [],
          K: [],
        };
      }
      return {
        ...state,
        PickNumber: draftPick,
        NumberOfRounds: numRounds,
        Rosters: obj,
      };
    case ActionType.updateTeamRoster:
      const newDraftObj = cloneDeep(state.Rosters);
      const { player } = action.payload;

      const totalTeams = Object.keys(state.Rosters).length;
      state.PickedPlayers.add(player.name);
      const currentPick = state.PickedPlayers.size;

      let round;
      let pickNumber;

      // algorithm for determining whose pick it is to determine which roster to add the player to
      // TODO: need to split this into another function to determine the pick we're on

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
      newDraftObj[pickNumber]?.[player.role].push(player); // typescript is not great at handling nested objects - could use zod
      newDraftObj[pickNumber]?.[player.role].sort((a, b) => a.adp - b.adp);
      // console.log(newDraftObj);

      return {
        ...state,
        PickedPlayers: new Set(state.PickedPlayers),
        Rosters: { ...newDraftObj },
      };

    case ActionType.undoPick: // this method is complete cancer but i had a deadline
      const playerArr = Array.from(state.PickedPlayers);
      const removedPlayer = playerArr.pop();
      const newObj = cloneDeep(state.Rosters);

      const teams = Object.keys(state.Rosters).length;
      const pick = state.PickedPlayers.size;

      let roundNum;
      let pickNum;

      // algorithm for determining whose pick it is to determine which roster to add the player to
      // TODO: need to split this into another function to determine the pick we're on

      if (pick % teams === 0) roundNum = pick / teams;
      else roundNum = Math.floor(pick / teams) + 1;

      if (roundNum % 2 === 0) {
        if (pick % teams === 0) pickNum = 1;
        else pickNum = teams - (pick % teams) + 1;
      } else {
        if (pick % teams === 0) pickNum = teams;
        else pickNum = pick % teams;
      }

      if (!newObj[Number(pickNum)]) {
        newObj[Number(pickNum)] = {
          QB: [],
          WR: [],
          TE: [],
          RB: [],
          DST: [],
          K: [],
        };
      }

      console.log("before", newObj[pickNum]);

      const positions: (keyof Teams)[] = ["QB", "WR", "RB", "TE", "DST", "K"];

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < positions.length; i++) {
        const position = positions[i]!;
        const teamArr = newObj[pickNum]![position];

        if (Array.isArray(teamArr)) {
          // Use array filtering to remove the player
          newObj[pickNum]![position] = teamArr.filter(
            (player) => player.name !== removedPlayer
          );
        }
      }

      console.log("after", newObj[pickNum]);

      return {
        ...state,
        PickedPlayers: new Set([...playerArr]),
        Rosters: { ...newObj },
      };

    default:
      return state;
  }
}
