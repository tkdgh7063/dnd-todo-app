import { useEffect, useRef } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { flushSync } from "react-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import DraggableCard from "./Components/DraggableCard";

const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
`;

const Board = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 20px 10px;
  padding-top: 30px;
  border-radius: 5px;
  min-height: 200px;
`;

function App() {
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    // Ignore if dragged outside the list
    if (!destination) return;

    // Ignore if dropped at the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    flushSync(() => {
      setToDos((oldToDos) => {
        // 1. Find the item being moved
        const movingItem = oldToDos.find((item) => item.id === draggableId);
        if (!movingItem) return oldToDos; // If not found, return previous state

        // 2. Remove the item from its original position
        const updatedToDos = oldToDos.filter((item) => item.id !== draggableId);

        // 3. Insert the item at the new position
        updatedToDos.splice(destination.index, 0, movingItem);

        return updatedToDos;
      });
    });
  };

  const [toDos, setToDos] = useRecoilState(toDoState);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Droppable droppableId="one">
            {(provided) => (
              <Board ref={provided.innerRef} {...provided.droppableProps}>
                {toDos.map((toDo, index) => (
                  <DraggableCard key={toDo.id} toDo={toDo} index={index} />
                ))}
                {provided.placeholder}
              </Board>
            )}
          </Droppable>
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
