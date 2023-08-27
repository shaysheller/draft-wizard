import { createContext } from "react";

export type InitialStateType = {
  NumTeams: number;
  PickNumber: number;
};

export const initialState: InitialStateType = { NumTeams: -1, PickNumber: -1 };

export enum ActionType {
  changeNumTeams,
  changePickNumber,
}

export interface changeNumTeams {
  type: ActionType.changeNumTeams;
  payload: number;
}

export interface changePickNumber {
  type: ActionType.changePickNumber;
  payload: number;
}

export type DraftSettings = changeNumTeams | changePickNumber;

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
