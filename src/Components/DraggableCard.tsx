import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { ToDoItem } from "../atoms";

const Card = styled.div`
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 5px;
  user-select: none;
`;

interface DraggableCardProps {
  toDo: ToDoItem;
  index: number;
}

function DraggableCard({ toDo, index }: DraggableCardProps) {
  return (
    <Draggable key={toDo.id} draggableId={toDo.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}>
          {toDo.text}
        </Card>
      )}
    </Draggable>
  );
}

export default DraggableCard;
