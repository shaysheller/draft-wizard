import { createContext } from "react";
import { number } from "zod";
import { playerRouter } from "./server/api/routers/player";
import { type RouterOutputs } from "./utils/api";

export type InitialStateType = {
  PickNumber: number;
  Rosters: Record<number, Teams>;
  PickedPlayers: Set<string>;
  NumberOfRounds: number;
};

export interface Teams {
  QB: Player[];
  WR: Player[];
  RB: Player[];
  TE: Player[];
  DST: Player[];
  K: Player[];
}

export type Player = RouterOutputs["player"]["getAll"][number];
export const initialState: InitialStateType = {
  PickNumber: -1,
  Rosters: {},
  PickedPlayers: new Set<string>(),
  NumberOfRounds: 15,
};

export enum ActionType {
  changeNumTeams,
  changePickNumber,
  updateTeamRoster,
  updatePickedPlayers,
  updateNumOfRounds,
  updatePick,
  setInitialDraftSettings,
}

export interface changeNumTeams {
  type: ActionType.changeNumTeams;
  payload: number;
}

export interface setInitialDraftSettings {
  type: ActionType.setInitialDraftSettings;
  payload: { numTeams: number; draftPick: number; numRounds: number };
}

export interface changePickNumber {
  type: ActionType.changePickNumber;
  payload: number;
}

export interface draftPlayer {
  type: ActionType.updateTeamRoster;
  payload: { player: Player };
}

export interface updateNumOfRounds {
  type: ActionType.updateNumOfRounds;
  payload: number;
}

export interface updatePick {
  type: ActionType.updatePick;
  payload: undefined;
}

export type DraftSettings =
  | changeNumTeams
  | changePickNumber
  | draftPlayer
  | updateNumOfRounds
  | updatePick
  | setInitialDraftSettings;

export const DraftContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<DraftSettings>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const numTeamsFunction = (numTeams: number): changeNumTeams => ({
  type: ActionType.changeNumTeams,
  payload: numTeams,
});

export const draftPickFunction = (pickNumber: number): changePickNumber => ({
  type: ActionType.changePickNumber,
  payload: pickNumber,
});

export const numOfRoundsFunction = (rounds: number): updateNumOfRounds => ({
  type: ActionType.updateNumOfRounds,
  payload: rounds,
});

export const updatePick = (): updatePick => ({
  type: ActionType.updatePick,
  payload: undefined,
});

export const setInitialDraftSettings = (
  numTeams: number,
  draftPick: number,
  numRounds: number
): setInitialDraftSettings => ({
  type: ActionType.setInitialDraftSettings,
  payload: { numTeams, draftPick, numRounds },
});

// might not need pick number since i moved that to context
export const draftPlayerFunction = (player: Player): draftPlayer => ({
  type: ActionType.updateTeamRoster,
  payload: { player },
});
