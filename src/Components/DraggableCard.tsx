import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { ToDoItem } from "../atoms";

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
  user-select: none;
  opacity: ${(props) => (props.$isDeleting ? 0.8 : 1)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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
}

function DraggableCard({ toDo, index }: DraggableCardProps) {
  const onClick = () => {
    console.log("Card Edit Clicked");
  };
  return (
    <Draggable key={toDo.id} draggableId={toDo.id + ""} index={index}>
      {(provided, snapshot) => {
        const isDeleting = snapshot.draggingOver === "TRASH";
        return (
          <Wrapper>
            <Card
              $isDragging={snapshot.isDragging}
              $isDeleting={isDeleting}
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}>
              <span>{toDo.text}</span>
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

export default React.memo(DraggableCard);
