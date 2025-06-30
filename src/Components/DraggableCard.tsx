import React, { useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { ToDoItem, toDoState } from "../atoms";

interface CardProps {
  $isDragging: boolean;
  $isDeleting: boolean;
}

const Wrapper = styled.div``;

const Card = styled.div<CardProps>`
  background-color: ${(props) =>
    props.$isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.$isDragging ? "rgba(0, 0, 0, 0.05) 0px 2px 5px;" : "none"};
  padding: 10px;
  margin-bottom: 5px;
  -webkit-user-select: none;
  opacity: ${(props) => (props.$isDeleting ? 0.8 : 1)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardInput = styled.input``;

const EditButton = styled.button`
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DraggableCardProps {
  toDo: ToDoItem;
  index: number;
  boardId: number;
}

function DraggableCard({ toDo, index, boardId }: DraggableCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(toDo.text);
  const setToDos = useSetRecoilState(toDoState);

  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    setIsEditing(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setText(toDo.text);
    setText(e.target.value);
  };

  const onBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    setText(toDo.text);
    return;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);

      const newValue = text.trim();
      if (newValue === "") {
        setText(toDo.text);
        return;
      }
      setText(newValue);

      setToDos((allBoards) => {
        const newBoards = [...allBoards];
        const boardIndex = newBoards.findIndex((board) => board.id === boardId);
        if (boardIndex === -1) return allBoards;

        const board = newBoards[boardIndex];

        const newItems = [...board.items];
        const oldItem = newItems[index];
        const updatedItem = { ...oldItem, text: newValue };

        newItems[index] = updatedItem;

        const updatedBoard = { ...board, items: newItems };
        newBoards[boardIndex] = updatedBoard;

        return newBoards;
      });
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setText(toDo.text);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <Draggable key={toDo.id} draggableId={toDo.id + ""} index={index}>
      {(provided, snapshot) => {
        const isDeleting = snapshot.draggingOver === "TRASH-CARD";

        return (
          <Wrapper>
            <Card
              $isDragging={snapshot.isDragging}
              $isDeleting={isDeleting}
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}>
              {isEditing ? (
                <CardInput
                  ref={inputRef}
                  onBlur={onBlur}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  type="text"
                  value={text}
                />
              ) : (
                <span ref={spanRef}>{text}</span>
              )}
              <EditButton onClick={onClick}>
                <span>✏️</span>
              </EditButton>
            </Card>
          </Wrapper>
        );
      }}
    </Draggable>
  );
}

export default DraggableCard;
