import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Wrapper = styled.div`
  height: 50px;
  width: 50px;
`;

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
  z-index: ${(props) => props.$zIndex};
  span {
    -webkit-user-select: none;
  }
`;

interface TrashZoneProps {
  $isDraggingOver: boolean;
  $zIndex: number;
}

function TrashZone() {
  return (
    <Wrapper>
      <Droppable droppableId="TRASH-CARD" type="CARD">
        {(provided, snapshot) => (
          <Trash
            ref={provided.innerRef}
            $isDraggingOver={snapshot.isDraggingOver}
            $zIndex={snapshot.isDraggingOver ? 3 : 1}
            {...provided.droppableProps}>
            <span>🗑️</span>
          </Trash>
        )}
      </Droppable>
      <Droppable droppableId="TRASH-BOARD" type="BOARD" direction="horizontal">
        {(provided, snapshot) => (
          <Trash
            ref={provided.innerRef}
            $isDraggingOver={snapshot.isDraggingOver}
            $zIndex={snapshot.isDraggingOver ? 4 : 2}
            {...provided.droppableProps}>
            <span>🗑️</span>
          </Trash>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default TrashZone;
