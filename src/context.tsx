import { createContext } from "react";
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
}

export interface changeNumTeams {
  type: ActionType.changeNumTeams;
  payload: number;
}

export interface changePickNumber {
  type: ActionType.changePickNumber;
  payload: number;
}

export interface draftPlayer {
  type: ActionType.updateTeamRoster;
  payload: { pickNumber: number; player: Player };
}

export interface updateNumOfRounds {
  type: ActionType.updateNumOfRounds;
  payload: number;
}

export type DraftSettings =
  | changeNumTeams
  | changePickNumber
  | draftPlayer
  | updateNumOfRounds;

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

export const draftPlayerFunction = (
  pickNumber: number,
  player: Player
): draftPlayer => ({
  type: ActionType.updateTeamRoster,
  payload: { pickNumber, player },
});
