# 📋 Memo - Todo App Development Progress

## ✅ 06.25 - Initial Functionalities

- [x] Improve styling of task input UI
- [x] Add input field for creating new boards
  - [x] Use `useForm` hook for input handling
  - [x] Show error if board name already exists
    - [x] Auto-clear error after 5 seconds
- [x] Persist data using `localStorage` (prevent reset on refresh)
- [x] Enable task deletion
  - [x] Delete task by dragging to `TrashZone`
  - [x] Highlight `TrashZone` when a task is dragged over it

## ✅ 06.26 - Board State Refactor

- [x] Refactor `todoState` to support board dragging
- [x] Move `TrashZone` to the top-right of the board area

## ✅ 06.27 - Board Drag & Drop

- [x] Make boards draggable
- [x] Make `<Board />` draggable and parent container droppable
- [x] Introduce `BoardState` to manage board order (avoid depending on other state)
- [x] Enable board reordering via drag-and-drop
- [x] Enable deleting a board by dragging it to `TrashZone`
- [x] Style board while dragging (e.g., shadow, opacity)
- [x] Fix issue where boards were not properly entering the droppable area

## ✅ 06.28 - Editing Features

### ✏️ Card Editing

- [x] Add edit button to the right of each card
- [x] Turn card name div into input when edit button is pressed
- [x] Revert input back to div on Enter or blur
- [x] Allow only one card or board to be edited at a time
- [x] Reflect edited card name to state
- [x] Manage edit mode state per card
- [x] Autofocus input on edit
- [x] Handle blur as confirm or cancel
- [x] Validate input: disallow empty text

### ✏️ Board Editing

- [x] Add edit button to the right of each board
- [x] Turn board name div into input when edit button is pressed
- [x] Revert input back to div on Enter or blur
- [x] Allow only one card or board to be edited at a time
- [x] Reflect edited board name to state
- [x] Manage edit mode state per board
- [x] Autofocus input on edit
- [x] Handle blur as confirm or cancel
- [x] Validate input: disallow empty or duplicate names

---

## 🔜 Upcoming Tasks

### 🎨 UI/UX Improvements for Editing

- [ ] Add button press animation for edit button
- [ ] Improve styling of the edit button
- [ ] Improve styling of the editing input field
- [ ] Apply `useForm` for editing inputs

### ♻️ Additional Features

- [ ] Add a Reset button to restore initial state
  - Place it to the left of `TrashZone`
- [ ] Ensure boards grow only downward when adding tasks
  - Use `align-items` on board container
- [ ] Optimize `onDragEnd` handler
  - Update only the modified board, not all boards
- [ ] Add toggle for task insertion position (top vs bottom)
- [ ] Improve layout so that board grows downward with fixed top
  - Use `align-items: flex-start` or alternative layout strategy
  - Reposition `TrashZone` to stay fixed
- [ ] Add dark mode toggle
- [ ] (Optional) Improve drag-and-drop animation
  - Smoother drag for boards
  - Drop animation for cards

---

## 🧱 Component Structure Summary

### `App.tsx`

```tsx
<DragDropContext onDragEnd={handleDragEnd}>
  <Wrapper>
    <Form>
      {" "}
      <BoardInput />{" "}
    </Form>
    <Boards>
      {" "}
      <Board />{" "}
    </Boards>
    <TrashZone />
  </Wrapper>
</DragDropContext>
```

### `Board.tsx`

```tsx
<Wrapper>
  <Title>
    {" "}
    <Form />{" "}
  </Title>
  <Droppable>
    <Area>
      {" "}
      <DraggableCard />{" "}
    </Area>
  </Droppable>
</Wrapper>
```

### `Draggable.tsx`

```tsx
<Draggable>
  <Card />
</Draggable>
```

## 🧠 `onDragEnd` Handler Logic

1. Check whether the dragged item is a **board** or a **card**
2. If it is a **board**:
   - Reorder boards within the board list
   - If dropped into the `TrashZone`, delete the board
3. If it is a **card**:
   - Reorder cards within the same board
   - Move the card to a different board
   - If dropped into the `TrashZone`, delete the card

---

## 📦 Data Structure Change

### 🔁 Before

```ts
{
  "To Do": [
    { id: 123, text: "a" },
    { id: 124, text: "b" }
  ],
  "Doing": [
    { id: 125, text: "c" }
  ]
}
```

### ✅ After

```ts
[
  {
    id: 0,
    board: "To Do",
    items: [
      { id: 123, text: "a" },
      { id: 124, text: "b" },
    ],
  },
  {
    id: 1,
    board: "Doing",
    items: [{ id: 125, text: "c" }],
  },
];
```
