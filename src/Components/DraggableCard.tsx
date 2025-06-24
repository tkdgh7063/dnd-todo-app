import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { ToDoItem } from "../atoms";

interface CardProps {
  $isDragging: boolean;
}

const Card = styled.div<CardProps>`
  background-color: ${(props) =>
    props.$isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  box-shadow: ${(props) =>
    props.$isDragging ? "rgba(0, 0, 0, 0.05) 0px 2px 5px;" : "none"};
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
    <Draggable key={toDo.id} draggableId={toDo.id + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
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
