import { useForm, SubmitHandler } from "react-hook-form";
import { useRecoilState } from "recoil";
import { TaskState, isReadyToDeleteState, todoState } from "../storage/atom";
import { useState } from "react";
import TodoList from "../components/TodoList";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

// 전체 컨테이너 스타일
const Container = styled.div`
  width: 680px;
  padding: 20px;
`;

// 선택 상자 및 폼 스타일
const Select = styled.select`
  margin-bottom: 20px;
  padding: 5px 10px;
`;

const Form = styled.form`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  cursor: pointer;
`;

const TodoListContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  background-color: #fff6f6;
`;

const Delete = styled.li`
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
`;

interface IForm {
  task: string;
}

type TodoStatus = "todo" | "doing" | "done";

function Home() {
  const [todos, setTodos] = useRecoilState(todoState);
  const [select, setSelect] = useState<TodoStatus>("todo");
  const [isReadyToDelete, setIsReadyToDelete] =
    useRecoilState(isReadyToDeleteState);
  const { register, handleSubmit, reset } = useForm<IForm>();
  const onSubmit: SubmitHandler<IForm> = (event) => {
    setTodos((prevTodos) => {
      return {
        ...prevTodos,
        [select]: [...prevTodos[select], event.task],
      };
    });
    reset();
    setIsReadyToDelete(true);
  };

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    if (value === "todo" || value === "doing" || value === "done") {
      setSelect(value as TodoStatus);
    }
  };

  const deleteTodo = (status: TodoStatus, index: number) => {
    setTodos((prevTodos) => {
      const updatedList = prevTodos[status].filter((_, i) => i !== index);
      return {
        ...prevTodos,
        [status]: updatedList,
      };
    });
  };

  console.log(todos);

  const onDragEnd = (event: DropResult) => {
    console.log(event);
    if (!event.destination) {
      return;
    }

    const start = event.source.index;
    const end = event.destination.index;
    const startPoint = event.source.droppableId;
    const endPoint = event.destination.droppableId;

    // TaskState를 결정하는 함수
    const getTaskStateFromId = (id: string): TodoStatus => {
      if (id.includes("todo")) return TaskState.TODO;
      if (id.includes("doing")) return TaskState.DOING;
      if (id.includes("done")) return TaskState.DONE;
      throw new Error("Invalid task state");
    };

    if (event.destination.droppableId === "droppable-deleteContainer") {
      const startState = getTaskStateFromId(startPoint);
      deleteTodo(startState as any, start);
      return;
    }

    const startState = getTaskStateFromId(startPoint);
    const endState = getTaskStateFromId(endPoint);

    /*     if ((event.destination.droppableId = "droppable-deleteContainer")) {
      deleteTodo(startPoint as any, start);
    } */

    setTodos((prevTodos) => {
      const startTasks = Array.from(prevTodos[startState]);
      const endTasks =
        startState === endState ? startTasks : Array.from(prevTodos[endState]);

      const [movedItem] = startTasks.splice(start, 1);

      // 같은 리스트 내에서 이동하는 경우와 다른 리스트로 이동하는 경우를 처리
      endTasks.splice(end, 0, movedItem);

      return {
        ...prevTodos,
        [startState]: startTasks,
        [endState]: endTasks,
      };
    });
  };

  /*   const onDragEnd = (event: DropResult) => {
    console.log(event);
    if (!event.destination) {
      return;
    }
    const start = event.source.index;
    const end = event.destination?.index;
    const startPoint = event.source.droppableId;
    const endPoint = event.destination.droppableId;

    if (startPoint === endPoint) {
      setTodos((prevTodos) => {
        const newTodo = Array.from(prevTodos[TaskState.TODO]);
        const [slicePart] = newTodo.splice(start, 1);
        newTodo.splice(end, 0, slicePart);
        return {
          ...prevTodos,
          [TaskState.TODO]: newTodo,
        };
      });
    } else {
      setTodos((prevTodos: any) => {
        let startTodo;
        let startTodoPoint;
        let endTodo;
        let endTodoPoint;

        if (startPoint.includes("todo")) {
          startTodo = Array.from(prevTodos[TaskState.TODO]);
          startTodoPoint = TaskState.TODO;
        }
        if (startPoint.includes("doing")) {
          startTodo = Array.from(prevTodos[TaskState.DOING]);
          startTodoPoint = TaskState.DOING;
        }
        if (startPoint.includes("done")) {
          startTodo = Array.from(prevTodos[TaskState.DONE]);
          startTodoPoint = TaskState.DONE;
        }

        if (endPoint.includes("todo")) {
          endTodo = Array.from(prevTodos[TaskState.TODO]);
          endTodoPoint = TaskState.TODO;
        }
        if (endPoint.includes("doing")) {
          endTodo = Array.from(prevTodos[TaskState.DOING]);
          endTodoPoint = TaskState.DOING;
        }
        if (endPoint.includes("done")) {
          endTodo = Array.from(prevTodos[TaskState.DONE]);
          endTodoPoint = TaskState.DONE;
        }

        if (!startTodo) {
          return;
        }
        if (!startTodoPoint) {
          return;
        }
        if (!endTodoPoint) {
          return;
        }
        const [slicePart] = startTodo?.splice(start, 1);
        endTodo?.splice(end, 0, slicePart);
        return {
          ...prevTodos,
          [startTodoPoint]: startTodo,
          [endTodoPoint]: endTodo,
        };
      });
    }
  }; */

  return (
    <Container>
      <Select onChange={onChange} value={select}>
        <option value={TaskState.TODO}>todo</option>
        <option value={TaskState.DOING}>doing</option>
        <option value={TaskState.DONE}>done</option>
      </Select>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("task", { required: true })} />
        <Button type="submit">save</Button>
      </Form>
      <DragDropContext onDragEnd={onDragEnd}>
        <TodoListContainer>
          <TodoList
            title={TaskState.TODO}
            items={todos.todo}
            onDelete={(index) => deleteTodo(TaskState.TODO, index)}
          />

          <TodoList
            title={TaskState.DOING}
            items={todos.doing}
            onDelete={(index) => deleteTodo(TaskState.DOING, index)}
          />

          <TodoList
            title={TaskState.DONE}
            items={todos.done}
            onDelete={(index) => deleteTodo(TaskState.DONE, index)}
          />
        </TodoListContainer>

        {isReadyToDelete && (
          <DeleteContainer>
            <Droppable droppableId={`droppable-deleteContainer`}>
              {(provided, snapshot) => (
                <Delete
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: snapshot.isDraggingOver
                      ? "#e2e2e2"
                      : "transparent",
                  }}
                >
                  To delete task, post it here.
                </Delete>
              )}
            </Droppable>
          </DeleteContainer>
        )}

        {/*         <Droppable droppableId={`droppable-deleteContainer`}>
          {(provided, snapshot) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "#e2e2e2"
                  : "#f3f3f3",
              }}
            >
              <Draggable
                key={`deleteDraggable`}
                draggableId={`deleteDraggable`}
                index={0}
              >
                {(provided, snapshot) => (
                  <DeleteContainer
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    To delete task, post it here.
                  </DeleteContainer>
                )}
              </Draggable>
              {provided.placeholder}
            </List>
          )}
        </Droppable> */}
      </DragDropContext>
    </Container>
  );
}
export default Home;
