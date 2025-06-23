import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { flushSync } from "react-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDOState, toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 15px;
`;

function App() {
  const onDragEnd = ({ destination, source }: DropResult) => {
    // Ignore if dragged outside the list
    if (!destination) return;

    // Ignore if dropped at the same position within the same board
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    flushSync(() => {
      setToDos((allBoards) => {
        // 1. Create a shallow copy of all boards to maintain immutability
        const copyToDos: IToDOState = {};
        for (const key in allBoards) {
          copyToDos[key] = [...allBoards[key]];
        }

        // 2. Remove the moved item from the source board at the source index
        const [movedItem] = copyToDos[source.droppableId].splice(
          source.index,
          1
        );
        // If no item was found to move, return the current state unchanged
        if (!movedItem) return allBoards;

        // 3. Insert the moved item into the destination board at the destination index
        copyToDos[destination.droppableId].splice(
          destination.index,
          0,
          movedItem
        );

        // 4. Return the updated boards state
        return copyToDos;
      });
    });
  };

  const [category, setToDos] = useRecoilState(toDoState);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(category).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={category[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
