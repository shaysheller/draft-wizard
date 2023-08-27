import type { DraftSettings, InitialStateType } from "./context";
import { ActionType } from "./context";

export function draftReducer(
  state: InitialStateType,
  action: DraftSettings
): InitialStateType {
  switch (action.type) {
    case ActionType.changeNumTeams:
      return { ...state, NumTeams: action.payload };
    case ActionType.changePickNumber:
      return { ...state, PickNumber: action.payload };

    default:
      return state;
  }
}
