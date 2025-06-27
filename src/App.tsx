import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
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
  margin-bottom: 10px;
  position: relative;
`;

const Body = styled.div`
  width: 100%;
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
  top: 75%;
  left: 44%;
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
  const onDragEnd = ({ destination, source, type }: DropResult) => {
    // Ignore if dragged outside the list
    if (!destination) return;

    // Ignore if dropped at the same position within the same board
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Board is Dragged
    if (type === "BOARD") {
      flushSync(() => {
        setToDos((allBoards) => {
          const newBoards = [...allBoards];
          const [movedBoard] = newBoards.splice(source.index, 1);

          if (destination.droppableId.startsWith("TRASH")) {
            return newBoards;
          }

          newBoards.splice(destination.index, 0, movedBoard);
          return newBoards;
        });
      });
    }

    // Card is Dragged
    else if (type === "CARD") {
      flushSync(() => {
        setToDos((allBoards) => {
          // 1. 삭제인 경우 먼저 분기
          if (destination.droppableId.startsWith("TRASH")) {
            const sourceBoardIndex = allBoards.findIndex(
              (board) => board.id === +source.droppableId
            );
            if (sourceBoardIndex === -1) return allBoards;

            const sourceItems = [...allBoards[sourceBoardIndex].items];
            sourceItems.splice(source.index, 1); // 삭제

            const newBoards = [...allBoards];
            newBoards[sourceBoardIndex] = {
              ...newBoards[sourceBoardIndex],
              items: sourceItems,
            };

            return newBoards;
          }

          // 2. 일반 이동인 경우
          const sourceBoardIndex = allBoards.findIndex(
            (board) => board.id === +source.droppableId
          );
          const destinationBoardIndex = allBoards.findIndex(
            (board) => board.id === +destination.droppableId
          );

          if (sourceBoardIndex === -1 || destinationBoardIndex === -1) {
            return allBoards;
          }

          const sourceItems = [...allBoards[sourceBoardIndex].items];
          const [movedItem] = sourceItems.splice(source.index, 1);
          if (!movedItem) return allBoards;

          const destinationItems =
            source.droppableId === destination.droppableId
              ? sourceItems
              : [...allBoards[destinationBoardIndex].items];

          destinationItems.splice(destination.index, 0, movedItem);

          const newBoards = [...allBoards];

          newBoards[sourceBoardIndex] = {
            ...newBoards[sourceBoardIndex],
            items:
              source.droppableId === destination.droppableId
                ? destinationItems
                : sourceItems,
          };

          if (source.droppableId !== destination.droppableId) {
            newBoards[destinationBoardIndex] = {
              ...newBoards[destinationBoardIndex],
              items: destinationItems,
            };
          }

          return newBoards;
        });
      });
    }
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
      }, 100 * 1000);

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
        <Body>
          <Droppable
            droppableId="board-container"
            type="BOARD"
            direction="horizontal">
            {(provided, snapshot) => (
              <Boards ref={provided.innerRef} {...provided.droppableProps}>
                {toDos.map((board, index) => (
                  <Board
                    key={board.id}
                    boardId={board.id + ""}
                    boardName={board.boardName}
                    toDos={board.items}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Boards>
            )}
          </Droppable>
        </Body>
      </Wrapper>
    </DragDropContext>
  );
}

export default React.memo(App);
