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
        { id: 3, text: "Drag cards and boards to organize" },
        { id: 4, text: "Add cards and boards via inputs" },
        { id: 5, text: "Edit names with the pencil icon" },
      ],
    },
    {
      id: 1,
      boardName: "Doing",
      items: [
        { id: 6, text: "Drag to trash to delete" },
        { id: 7, text: "Reset to start over" },
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
