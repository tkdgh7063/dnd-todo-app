import { useRecoilState, useRecoilValue } from "recoil";
import {
  categoryState,
  toDoSelector,
  categoryListState,
  toDoState,
  Categories,
} from "../atoms";
import AddTodo from "./AddTodo";
import ToDo from "./ToDo";
import CreatableSelect from "react-select/creatable";
import { StylesConfig, components } from "react-select";

interface Option {
  label: string;
  value: string;
}

const darkThemeStyles: StylesConfig<Option, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1e1e1e",
    borderColor: state.isFocused ? "#3b82f6" : "#444",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    color: "#f9f9f9",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#2c2c2c",
    color: "#f9f9f9",
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "#3b3b3b"
      : state.isSelected
      ? "#3b82f6"
      : "#2c2c2c",
    color: state.isSelected ? "#ffffff" : "#f9f9f9",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#f9f9f9",
  }),
  input: (base) => ({
    ...base,
    color: "#f9f9f9",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#aaa",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#3b3b3b",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#f9f9f9",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#aaa",
    ":hover": {
      backgroundColor: "#f87171",
      color: "#fff",
    },
  }),
};

const defaultCategoryIds = Categories.map((category) => category.id);

const CustomOption = (props: any) => {
  const { data, selectProps } = props;

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (selectProps.onDeleteOption) {
      selectProps.onDeleteOption(data);
    }
  };

  const isCustomValue = !defaultCategoryIds.includes(data.value);
  const isCreateOption = data.__isNew__ === true;

  return (
    <div style={{ display: "flex" }}>
      <components.Option {...props} />
      {isCustomValue && !isCreateOption && (
        <button onClick={handleDelete}>❌</button>
      )}
    </div>
  );
};

function TodoList() {
  const toDos = useRecoilValue(toDoSelector);
  const [category, setCategory] = useRecoilState(categoryState);
  const [categories, setCategories] = useRecoilState(categoryListState);
  const setToDos = useRecoilState(toDoState)[1];

  const handleDeleteCategory = (categoryToDelete: {
    label: string;
    value: string;
  }) => {
    if (defaultCategoryIds.includes(categoryToDelete.value)) return;

    setCategories((prev) =>
      prev.filter((c) => c.id !== categoryToDelete.value)
    );

    setToDos((prev) =>
      prev.filter((td) => td.category.id !== categoryToDelete.value)
    );

    if (category?.id === categoryToDelete.value) {
      setCategory(undefined);
    }
  };

  return (
    <div>
      <h1>To Dos</h1>
      <hr />
      <CreatableSelect
        components={{ Option: CustomOption }}
        styles={darkThemeStyles}
        isClearable
        options={categories.map((c) => ({ label: c.name, value: c.id }))}
        placeholder="Select or Type a Category..."
        value={category ? { label: category.name, value: category.id } : null}
        onCreateOption={(inputValue) => {
          const newCategory = {
            id: (categories.length + 1).toString(),
            name: inputValue,
          };

          setCategories((prev) => [...prev, newCategory]);
          setCategory(newCategory);
        }}
        onChange={(option) => {
          if (option !== null) {
            setCategory({ id: option.value, name: option.label });
          } else {
            setCategory(undefined);
          }
        }}
        menuPlacement="auto"
        menuPosition="absolute"
        {...{ onDeleteOption: handleDeleteCategory }}
      />
      <hr />
      <AddTodo />
      {toDos?.map((toDo) => (
        <ToDo key={toDo.id} {...toDo} />
      ))}
    </div>
  );
}

export default TodoList;
