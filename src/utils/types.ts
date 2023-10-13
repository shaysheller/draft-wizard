import { type RouterOutputs } from "~/utils/api";


export type Player = RouterOutputs["player"]["getAll"][number];
export type Position = RouterOutputs["player"]["getAll"][number]["role"]