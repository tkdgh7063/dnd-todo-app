import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Trash = styled.div<TrashZoneProps>`
  height: 50px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.$isDraggingOver ? "#e74c3c" : "#dfe6e9"};
  border-radius: 5px;
  font-size: 36px;
  padding-bottom: 5px;
  box-shadow: ${(props) =>
    props.$isDraggingOver ? "inset 0 3px 5px rgba(0, 0, 0, 0.5)" : "none"};
  transform: scale(0.9);
  position: absolute;
  right: 20px;
  bottom: 0px;
`;

interface TrashZoneProps {
  $isDraggingOver: boolean;
}

function TrashZone() {
  return (
    <Droppable droppableId="TRASH">
      {(provided, snapshot) => (
        <Trash
          ref={provided.innerRef}
          $isDraggingOver={snapshot.isDraggingOver}
          {...provided.droppableProps}>
          <span>🗑️</span>
        </Trash>
      )}
    </Droppable>
  );
}

export default TrashZone;
