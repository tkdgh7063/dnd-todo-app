import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface ICategory {
  id: string;
  name: string;
}

export interface IToDo {
  id: number;
  text: string;
  category: ICategory;
}

export const Categories: ICategory[] = [
  { id: "0", name: "To Do" },
  { id: "1", name: "Doing" },
  { id: "2", name: "Done" },
];

const { persistAtom } = recoilPersist({
  key: "category_todo_recoil",
  storage: localStorage,
});

export const categoryListState = atom<ICategory[]>({
  key: "categories",
  default: Categories,
  effects_UNSTABLE: [persistAtom],
});

export const categoryState = atom<ICategory | undefined>({
  key: "category",
  default: undefined,
});

export const toDoState = atom<IToDo[]>({
  key: "toDo",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(toDoState);
    const category = get(categoryState);
    return toDos.filter((toDo) => toDo.category.id === category?.id);
  },
});
