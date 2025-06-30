import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import { isAddToTopState, toDoState } from "./atoms";
import Board from "./Components/Board";
import TrashZone from "./Components/TrashZone";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  width: 100vw;
  margin: 0 auto;
  margin-top: 10%;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 110px;
  margin-bottom: 10px;
  position: relative;
`;

const Form = styled.form`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15%;
  input {
    width: 100%;
  }
  &::placeholder {
    -webkit-user-select: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 250px;
  margin-left: auto;
  margin-right: 15%;
`;

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  -webkit-user-select: none;
  span {
    font-weight: 800;
  }
  margin: 3px 0;
`;

const SliderContainer = styled.div`
  position: relative;
  height: 60px;
  width: 30px;
  background-color: #ddd;
  border-radius: 15px;
  cursor: pointer;
`;

const Slider = styled.div<ToggleProps>`
  height: 28px;
  width: 28px;
  position: absolute;
  background-color: #4caf50;
  border-radius: 50%;
  left: 1px;
  top: ${(props) => (props.$isTop ? "1px" : "31px")};
  transition: top 0.3s;
  -webkit-user-select: none;
`;

const Reset = styled.button<ResetProps>`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  font-size: 30px;
  background-color: ${(props) =>
    props.$isPressed ? "#55efc4" : props.theme.boardColor};
  /* border-style: ${(props) => (props.$isPressed ? "inset" : "outset")}; */
  span {
    -webkit-user-select: none;
  }
`;

const Body = styled.div`
  width: 100%;
`;

const BoardInput = styled.input<InputProps>`
  width: 20%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  text-align: center;
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

const Boards = styled.div<BoardsProps>`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  width: 100%;
  min-height: 300px;
`;

interface FormProps {
  boardName: string;
}

interface InputProps {
  $hasError?: boolean;
}

interface BoardsProps {
  $isDraggingOver: boolean;
  $isDraggingFromThisWith: boolean;
}

interface ResetProps {
  $isPressed: boolean;
}

interface ToggleProps {
  $isTop: boolean;
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

          if (destination.droppableId === "TRASH-BOARD") {
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
          if (destination.droppableId === "TRASH-CARD") {
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
  const resetToDos = useResetRecoilState(toDoState);
  const resetIsTop = useResetRecoilState(isAddToTopState);
  const [error, setError] = useState("");
  const [isTop, setIsTop] = useRecoilState(isAddToTopState);
  const [isResetPressed, setIsResetPressed] = useState<boolean>(false);
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

  const onToggle = () => {
    setIsTop((prev) => !prev);
  };

  const onReset = () => {
    resetToDos();
    resetIsTop();
    return;
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
          <ButtonContainer>
            <ToggleContainer>
              <ToggleLabel>
                Add to <span>Top</span>
              </ToggleLabel>
              <SliderContainer onClick={onToggle}>
                <Slider $isTop={isTop} />
              </SliderContainer>
              <ToggleLabel>
                Add to <span>Bottom</span>
              </ToggleLabel>
            </ToggleContainer>
            <Reset
              onClick={onReset}
              $isPressed={isResetPressed}
              onMouseUp={() => setIsResetPressed(false)}
              onMouseDown={() => setIsResetPressed(true)}
              onMouseLeave={() => setIsResetPressed(false)}>
              <span>↻</span>
            </Reset>
            <TrashZone />
          </ButtonContainer>
        </Header>
        <Body>
          <Droppable
            droppableId="board-container"
            type="BOARD"
            direction="horizontal">
            {(provided, snapshot) => (
              <Boards
                $isDraggingOver={snapshot.isDraggingOver}
                $isDraggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}>
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

export default App;
