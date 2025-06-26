import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface ToDoItem {
  id: number;
  text: string;
}

export interface KanbanColumn {
  id: number;
  boardName: string;
  items: ToDoItem[];
}

const { persistAtom } = recoilPersist({
  key: "boardTasks",
  storage: localStorage,
});

export const toDoState = atom<KanbanColumn[]>({
  key: "todo",
  default: [
    {
      id: 0,
      boardName: "To do",
      items: [
        { id: 3, text: "a" },
        { id: 4, text: "b" },
        { id: 5, text: "c" },
        { id: 8, text: "f" },
        { id: 9, text: "g" },
      ],
    },
    {
      id: 1,
      boardName: "Doing",
      items: [
        { id: 6, text: "d" },
        { id: 7, text: "e" },
      ],
    },
    { id: 2, boardName: "Done", items: [] },
  ],
  effects: [persistAtom],
});

export const deletedTaskIdState = atom<number | null>({
  key: "deletedTaskId",
  default: null,
});
