import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import TrashZone from "./Components/TrashZone";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
`;

const BoardInput = styled.input<InputProps>`
  width: 20%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:focus {
    outline: none;
    border: 2px solid #74b9ff;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-weight: 600;
  height: 20px;
  position: absolute;
  bottom: 5px;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

interface FormProps {
  boardName: string;
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

    // Card is Dragged
    flushSync(() => {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[+source.droppableId].items];
        const [movedItem] = sourceBoard.splice(source.index, 1);

        if (!movedItem) return allBoards;

        const newBoards = [...allBoards];

        // Card is dragged into TrashZone
        if (destination.droppableId === "TRASH") {
          newBoards[+source.droppableId] = {
            ...newBoards[+source.droppableId],
            items: sourceBoard,
          };
          return newBoards;
        }

        const destinationBoard =
          source.droppableId === destination.droppableId
            ? sourceBoard
            : [...allBoards[+destination.droppableId].items];

        destinationBoard.splice(destination.index, 0, movedItem);

        newBoards[+source.droppableId] = {
          ...newBoards[+source.droppableId],
          items: sourceBoard,
        };
        newBoards[+destination.droppableId] = {
          ...newBoards[+destination.droppableId],
          items: destinationBoard,
        };
        return newBoards;
      });
    });
  };

  // const [deletedTaskId, setDeletedTaskId] = useRecoilState(deletedTaskIdState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [error, setError] = useState("");
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  const onValid = ({ boardName }: FormProps) => {
    setToDos((allBoards) => {
      if (
        allBoards.some(
          (board) => board.boardName.toLowerCase() === boardName.toLowerCase()
        )
      ) {
        setError("Board already exists");
        return allBoards;
      }

      setError("");
      const newBoard = {
        id: Date.now(),
        boardName:
          boardName.charAt(0).toUpperCase() + boardName.slice(1).toLowerCase(),
        items: [],
      };
      return [...allBoards, newBoard];
    });
    setValue("boardName", "");
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3 * 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // // for deleting animation
  // useEffect(() => {
  //   if (!deletedTaskId) return;

  //   const timer = setTimeout(() => {
  //     setToDos((prev) => {
  //       const newBoards: typeof prev = {};

  //       for (const boardId in prev) {
  //         const board = prev[boardId];
  //         if (!board) continue;

  //         newBoards[boardId] = board.filter(
  //           (item) => item.id !== deletedTaskId
  //         );
  //       }

  //       return newBoards;
  //     });

  //     setDeletedTaskId(null);
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [deletedTaskId, setToDos, setDeletedTaskId]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <Form onSubmit={handleSubmit(onValid)}>
            <BoardInput
              type="text"
              placeholder="Add new board"
              {...register("boardName", { required: true })}
              $hasError={Boolean(error)}
            />
            {error && <ErrorText>{error}</ErrorText>}
          </Form>
          <TrashZone />
        </Header>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board
              key={boardId}
              boardId={boardId}
              boardName={toDos[+boardId].boardName}
              toDos={toDos[+boardId].items}
            />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
