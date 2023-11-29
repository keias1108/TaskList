import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const ListSection = styled.div`
  flex-basis: calc(33.333% - 10px);
  background-color: #f7f7f7;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: #e9e9e9;
  }
`;

const DeleteButton = styled.button`
  padding: 3px 5px;
  margin-left: 10px;
  font-size: 0.8em;
  color: white;
  background-color: #c5c5c5;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

interface TodoListProps {
  title: string;
  items: string[];
  onDelete: (index: number) => void;
}
function TodoList({ title, items, onDelete }: TodoListProps) {
  return (
    <>
      <ListSection>
        <Title>{title}</Title>
        <Droppable droppableId={`droppable-${title}-${Date.now()}`}>
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "#e2e2e2"
                  : "transparent",
              }}
            >
              {items.map((item, index) => (
                <Draggable
                  key={`draggable-${title}-${index}`}
                  draggableId={`draggable-${title}-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item}
                      <DeleteButton onClick={() => onDelete(index)}>
                        Delete
                      </DeleteButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </ListSection>
    </>
  );
}

export default TodoList;
