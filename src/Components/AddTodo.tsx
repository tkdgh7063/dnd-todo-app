import { useForm } from "react-hook-form";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { categoryState, toDoState } from "../atoms";

interface IForm {
  toDo: string;
}

function AddTodo() {
  const setToDos = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const handleValid = ({ toDo }: IForm) => {
    if (category === undefined) {
    } else {
      setToDos((prev) => [{ id: Date.now(), text: toDo, category }, ...prev]);
      setValue("toDo", "");
    }
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", { required: "Please write a todo" })}
        placeholder="Write a todo"
      />
      <button>Add</button>
    </form>
  );
}

export default AddTodo;
