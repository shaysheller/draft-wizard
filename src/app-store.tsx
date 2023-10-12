import {create} from 'zustand';
import { type RouterOutputs } from "./utils/api";
import {cloneDeep} from 'lodash';

type AppState = {
  DraftPick: number;
  Rosters: Record<number, Teams>;
  PickedPlayers: Set<string>;
  NumberOfRounds: number;
  NumberOfTeams: number;
  PickNumber: number;
}

type AppActions = {
  setInitialDraftSettings: (numTeams: number, draftPick: number, numRounds: number) => void
  updateTeamRoster: () => void
  addPlayerToSet: (player: Player) => void
  removePlayerFromSet: (player: Player) => void
  addPlayerToRoster: (player: Player) => void
  incrementPickNumber: () => void
  decrementPickNumber: () => void

}

type Teams = {
  QB: Player[];
  WR: Player[];
  RB: Player[];
  TE: Player[];
  DST: Player[];
  K: Player[];
}

const initialState: AppState = {
  DraftPick: -1,
  Rosters: {},
  PickedPlayers: new Set<string>,
  NumberOfRounds: 15,
  NumberOfTeams: -1,
  PickNumber: 0,
}



export type Player = RouterOutputs["player"]["getAll"][number];

export const useAppStore= create<AppState & AppActions>()((set, get) => ({
  ...initialState,

  setInitialDraftSettings: (numTeams, draftPick, numRounds) => {
    set({DraftPick: draftPick})
    set({NumberOfRounds: numRounds});
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
    set({Rosters: obj})
    set({NumberOfTeams: numTeams})
  },

  updateTeamRoster: () => {
    return;
  },

  addPlayerToSet: (player) => {
    const newPlayerSet = new Set<string>(get().PickedPlayers);
    newPlayerSet.add(player.name)

    set({PickedPlayers: newPlayerSet})

    return;
  },

  removePlayerFromSet: (player) => {
    return;
  },

  incrementPickNumber: () => {

    const totalTeams = get().NumberOfTeams;
    const currentPick = get().PickedPlayers.size;

    let round;
    let pickNumber;

    if (currentPick % totalTeams === 0) round = currentPick / totalTeams;
    else round = Math.floor(currentPick / totalTeams) + 1;

    if (round % 2 === 0) {
      if (currentPick % totalTeams === 0) pickNumber = 1;
      else pickNumber = totalTeams - (currentPick % totalTeams) + 1;
    } else {
      if (currentPick % totalTeams === 0) pickNumber = totalTeams;
      else pickNumber = currentPick % totalTeams;
    }
    set({PickNumber: pickNumber});

  },

  decrementPickNumber: () => {
    const totalTeams = get().NumberOfTeams;
    const currentPick = get().PickedPlayers.size;

    let round;
    let pickNumber;

    if (currentPick % totalTeams === 0) round = currentPick / totalTeams;
    else round = Math.floor(currentPick / totalTeams) + 1;

    if (round % 2 === 0) {
      if (currentPick % totalTeams === 0) pickNumber = 2;
      else pickNumber = currentPick % totalTeams + 1;
    } else {
      if (currentPick % totalTeams === 0) pickNumber = totalTeams - 1;
      else pickNumber = currentPick % totalTeams - 1;
    }
    set({PickNumber: pickNumber});
  }, 

  addPlayerToRoster: (player) => {
    const newDraftObj = cloneDeep(get().Rosters);
      const pickNumber = get().PickNumber;
      

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
      set({Rosters: newDraftObj})
  }
  
}))