import { atom, selector } from "recoil";

export interface ToDoItem {
  id: number;
  text: string;
}

export interface ToDoStateProps {
  [key: string]: ToDoItem[];
}

export const toDoState = atom<ToDoStateProps>({
  key: "todo",
  default: {
    "To do": [
      { id: 1, text: "a" },
      { id: 2, text: "b" },
      { id: 3, text: "c" },
      { id: 6, text: "f" },
      { id: 7, text: "g" },
    ],
    Doing: [
      { id: 4, text: "d" },
      { id: 5, text: "e" },
    ],
    Done: [],
  },
});
