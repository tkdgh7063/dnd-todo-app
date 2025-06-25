import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ToDoStateProps, toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoardInput = styled.input<InputProps>`
  width: 25%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  text-align: center;
  margin-bottom: ${({ $hasError }) => ($hasError ? "5px" : "30px")};
  &:focus {
    outline: none;
    border: 2px solid #74b9ff;
    padding-top: 8px;
    padding-bottom: 6px;
    margin-bottom: ${({ $hasError }) => ($hasError ? "7px" : "32px")};
  }
`;

const ErrorText = styled.p`
  color: red;
  font-weight: 600;
  margin-bottom: 20px;
`;

interface FormProps {
  board: string;
}

interface InputProps {
  $hasError?: boolean;
}

function App() {
  const onDragEnd = ({ destination, source }: DropResult) => {
    // Ignore if dragged outside the list
    if (!destination) return;

    // Ignore if dropped at the same position within the same board
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    flushSync(() => {
      setToDos((allBoards) => {
        // 1. Create a shallow copy of all boards to maintain immutability
        const copyToDos: ToDoStateProps = {};
        for (const key in allBoards) {
          copyToDos[key] = [...allBoards[key]];
        }

        // 2. Remove the moved item from the source board at the source index
        const [movedItem] = copyToDos[source.droppableId].splice(
          source.index,
          1
        );
        // If no item was found to move, return the current state unchanged
        if (!movedItem) return allBoards;

        // 3. Insert the moved item into the destination board at the destination index
        copyToDos[destination.droppableId].splice(
          destination.index,
          0,
          movedItem
        );

        // 4. Return the updated boards state
        return copyToDos;
      });
    });
  };

  const [category, setToDos] = useRecoilState(toDoState);
  const [error, setError] = useState("");
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  const onValid = ({ board }: FormProps) => {
    setToDos((allBoards) => {
      if (allBoards.hasOwnProperty(board)) {
        setError("Board already exists");
        return allBoards;
      }

      setError("");
      const newBoard = { id: Date.now(), text: board };
      return {
        ...allBoards,
        [newBoard.text]: [],
      };
    });
    setValue("board", "");
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Form onSubmit={handleSubmit(onValid)}>
          <BoardInput
            type="text"
            placeholder="Add new board"
            {...register("board", { required: true })}
            $hasError={Boolean(error)}
          />
          {error && <ErrorText>{error}</ErrorText>}
        </Form>
        <Boards>
          {Object.keys(category).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={category[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
