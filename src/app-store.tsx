import { create } from "zustand";
import { type RouterOutputs } from "./utils/api";
import { cloneDeep } from "lodash";
import { type Position } from "./utils/types";

type AppState = {
  DraftPick: number;
  Rosters: Record<number, Teams>;
  PickedPlayers: Map<string, Position>;
  NumberOfRounds: number;
  NumberOfTeams: number;
  PickNumber: number;
};

type AppActions = {
  setInitialDraftSettings: (
    numTeams: number,
    draftPick: number,
    numRounds: number
  ) => void;
  updateTeamRoster: () => void;
  addPlayerToMap: (player: Player) => void;
  addPlayerToRoster: (player: Player) => void;
  incrementPickNumber: () => void;
  decrementPickNumber: () => void;
  undoPick: () => string | undefined;
};

type Teams = {
  QB: Player[];
  WR: Player[];
  RB: Player[];
  TE: Player[];
  DST: Player[];
  K: Player[];
};

const initialState: AppState = {
  DraftPick: -1,
  Rosters: {},
  PickedPlayers: new Map<string, Position>(),
  NumberOfRounds: 15,
  NumberOfTeams: -1,
  PickNumber: 0,
};

export type Player = RouterOutputs["player"]["getAll"][number];

export const useAppStore = create<AppState & AppActions>()((set, get) => ({
  ...initialState,

  setInitialDraftSettings: (numTeams, draftPick, numRounds) => {
    set({ DraftPick: draftPick });
    set({ NumberOfRounds: numRounds });
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
    set({ Rosters: obj });
    set({ NumberOfTeams: numTeams });
  },

  updateTeamRoster: () => {
    return;
  },

  addPlayerToMap: (player) => {
    const newPlayerMap = new Map<string, Position>(get().PickedPlayers);
    newPlayerMap.set(player.name, player.role);

    set({ PickedPlayers: newPlayerMap });

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
    set({ PickNumber: pickNumber });
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
      else pickNumber = (currentPick % totalTeams) + 1;
    } else {
      if (currentPick % totalTeams === 0) pickNumber = totalTeams - 1;
      else {
        pickNumber = (currentPick % totalTeams) - 1;
        if (pickNumber === 0) pickNumber = 1;
      }
    }
    set({ PickNumber: pickNumber });
  },

  addPlayerToRoster: (player) => {
    const newDraftObj = cloneDeep(get().Rosters);
    const pickNumber = get().PickNumber;
    newDraftObj[pickNumber]?.[player.role].push(player); // typescript is not great at handling nested objects - could use zod
    newDraftObj[pickNumber]?.[player.role].sort((a, b) => a.adp - b.adp);
    set({ Rosters: newDraftObj });
  },

  // when you Array.from a set it puts the values in added order so you can pop the array to get the most recent
  // value added - use this to get the player that needs to be removed
  // then filter correct team / position array to get the player that needs to go
  // could make this better by pushing a key value of name -> position to cut down on
  // the checking of all the arrays but it doesn't seem like it would save muc htime overall
  // because we should never be checking more than ~15 players regardless
  undoPick: () => {
    const playerArr = Array.from(get().PickedPlayers);
    if (playerArr.length) {
      const [removedPlayer, position] = playerArr.pop()!;
      const pickNumber = get().PickNumber;
      const newObj = cloneDeep(get().Rosters);
      const currentRoster = newObj[pickNumber];
      const positionRoster = currentRoster![position];
      positionRoster.filter((value) => value.name !== removedPlayer);
      set({
        Rosters: newObj,
        PickedPlayers: new Map<string, Position>(playerArr),
      });
      return removedPlayer;
    }
  },
}));
