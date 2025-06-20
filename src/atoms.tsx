import { atom, selector } from "recoil";

export interface ToDoItem {
  id: string;
  text: string;
}

export const toDoState = atom<ToDoItem[]>({
  key: "todo",
  default: [
    { id: "1", text: "a" },
    { id: "2", text: "b" },
    { id: "3", text: "c" },
    { id: "4", text: "d" },
    { id: "5", text: "e" },
    { id: "6", text: "f" },
    { id: "7", text: "g" },
  ],
});
