import { atom } from "recoil";

export enum TaskState {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export interface ITodoState {
  [TaskState.TODO]: string[];
  [TaskState.DOING]: string[];
  [TaskState.DONE]: string[];
}

export const todoState = atom<ITodoState>({
  key: "todoState", // unique ID (with respect to other atoms/selectors)
  default: {
    [TaskState.TODO]: [],
    [TaskState.DOING]: [],
    [TaskState.DONE]: [],
  }, // default value (aka initial value)
});

export const isReadyToDeleteState = atom({
  key: "isReadyToDelete",
  default: false,
});
