import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { ToDoItem } from "../atoms";
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

interface BoardProps {
  toDos: ToDoItem[];
  boardId: string;
}

function Board({ toDos, boardId }: BoardProps) {
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
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
  );
}

export default Board;
