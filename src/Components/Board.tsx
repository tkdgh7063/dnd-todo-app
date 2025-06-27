import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { ToDoItem, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  width: 300px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  user-select: none;
`;

interface AreaProps {
  $isDraggingOver: boolean;
  $isdraggingFromThisWith: boolean;
}

const Area = styled.div<AreaProps>`
  flex-grow: 1;
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#b2bec3"
      : props.$isdraggingFromThisWith
      ? "transparent"
      : "#dfe6e9"};
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const TodoInput = styled.input`
  width: 85%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-right: 5px;
  text-align: center;
  &:focus {
    outline: none;
    border: 2px solid #74b9ff;
    padding-top: 8px;
    padding-bottom: 6px;
    margin-bottom: 2px;
  }
  &::placeholder {
    user-select: none;
  }
`;

interface BoardProps {
  toDos: ToDoItem[];
  boardId: string;
  boardName: string;
  index: number;
}

interface FormProps {
  toDo: string;
}

function Board({ toDos, boardId, boardName, index }: BoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  const onValid = ({ toDo }: FormProps) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos((allBoards) => {
      const newBoards = [...allBoards];
      newBoards[index] = {
        ...newBoards[index],
        items: [...newBoards[index].items, newToDo],
      };
      return newBoards;
    });
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, snapshot) => (
        <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
          <Title {...provided.dragHandleProps}>{boardName}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <TodoInput
              type="text"
              placeholder={`Add task on ${boardName}`}
              {...register("toDo", { required: true })}
            />
          </Form>
          <Droppable droppableId={boardId} type="CARD">
            {(provided, snapshot) => (
              <Area
                $isDraggingOver={snapshot.isDraggingOver}
                $isdraggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {toDos.map((toDo, index) => (
                  <DraggableCard key={toDo.id} toDo={toDo} index={index} />
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
