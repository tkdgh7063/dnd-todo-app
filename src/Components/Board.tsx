import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { isAddToTopState, ToDoItem, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div<WrapperProps>`
  background-color: ${(props) => (props.$isDragging ? "#74b9ff" : "#DFE6E9")};
  border-radius: 5px;
  min-height: 300px;
  width: 300px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  //transition: background-color 0.3s ease-in-out;
  opacity: ${(props) => (props.$isDeleting ? 0.8 : 1)};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h2<TitleProps>`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
  -webkit-user-select: none; // user-select
`;

const BoardInput = styled.input`
  text-align: center;
`;

const EditButton = styled.button`
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 10px;
`;

interface AreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThisWith: boolean;
  $isDragging: boolean;
}

const Area = styled.div<AreaProps>`
  flex-grow: 1;
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "#b2bec3"
      : props.$isDraggingFromThisWith
      ? "transparent"
      : "#dfe6e9"};
  transition: ${(props) =>
    props.$isDragging ? "none" : "background-color 0.3s ease-in-out"};
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
    -webkit-user-select: none; // user-select
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

interface WrapperProps {
  $isDragging: boolean;
  $isDeleting: boolean;
}

interface TitleProps {
  $isDeleting: boolean;
}

function Board({ toDos, boardId, boardName, index }: BoardProps) {
  const [allToDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<FormProps>();
  const onValid = ({ toDo }: FormProps) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos((allBoards) => {
      const newBoards = [...allBoards];
      const newItems = isTop
        ? [newToDo, ...newBoards[index].items]
        : [...newBoards[index].items, newToDo];
      newBoards[index] = {
        ...newBoards[index],
        items: newItems,
      };
      return newBoards;
    });
    setValue("toDo", "");
  };

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(boardName);
  const isTop = useRecoilValue(isAddToTopState);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    setText(boardName);
    return;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setText(boardName);
    setText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      // set text new Value
      const newValue = text.trim();
      if (
        newValue === "" ||
        allToDos.some((todo) => todo.boardName === newValue)
      ) {
        setText(boardName);
        return;
      }
      setText(newValue);

      setToDos((allBoards) => {
        const newBoards = [...allBoards];

        const boardIndex = newBoards.findIndex(
          (board) => board.id === +boardId
        );
        if (boardIndex === -1) return allBoards;

        const [targetBoard] = newBoards.splice(boardIndex, 1);
        const newBoard = {
          id: targetBoard.id,
          boardName: text,
          items: targetBoard.items,
        };
        newBoards.splice(boardIndex, 0, newBoard);

        return newBoards;
      });
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(boardName);
    }
  };

  const onClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, snapshot) => {
        const isBoardDragging = snapshot.isDragging;
        const isDeleting = snapshot.draggingOver === "TRASH-BOARD";
        return (
          <Wrapper
            $isDragging={isBoardDragging}
            $isDeleting={isDeleting}
            ref={provided.innerRef}
            {...provided.draggableProps}>
            <Header {...provided.dragHandleProps}>
              {isEditing ? (
                <BoardInput
                  ref={inputRef}
                  onBlur={onBlur}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  type="text"
                  value={text}
                />
              ) : (
                <Title $isDeleting={isDeleting} ref={h2Ref}>
                  {text}
                </Title>
              )}
              <EditButton onClick={onClick}>
                <span>✏️</span>
              </EditButton>
            </Header>
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
                  $isDraggingFromThisWith={Boolean(
                    snapshot.draggingFromThisWith
                  )}
                  $isDragging={isBoardDragging}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {toDos.map((toDo, index) => (
                    <DraggableCard
                      key={toDo.id}
                      toDo={toDo}
                      index={index}
                      boardId={+boardId}
                    />
                  ))}
                  {provided.placeholder}
                </Area>
              )}
            </Droppable>
          </Wrapper>
        );
      }}
    </Draggable>
  );
}

export default Board;
