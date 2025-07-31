import Header from "./components/Header";
import List from "./components/List";
import Editer from "./components/Editer";
import "./App.css";
import TodoItem from "./components/TodoItem";
import {
  useState,
  useRef,
  useReducer,
  useCallback,
  createContext,
  useMemo,
} from "react";

const mocData = [
  {
    id: 0,
    isDone: false,
    content: "React 공부하기",
    date: new Date().getTime(),
  },
  {
    id: 1,
    isDone: true,
    content: "빵집 가기",
    date: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "요거트 만들기",
    date: new Date().getTime(),
  },
];

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    case "UPDATE":
      return state.map((item) =>
        item.id === action.targetId ? { ...item, isDone: !item.isDone } : item
      );
    case "DELETE":
      return state.filter((item) => item.id !== action.targetId);
    default:
      return state;
  }
}

//외부에 선언
//변화할 값을 담을 컨텍스트
export const TodoStateContext = createContext();
//변화하지 않을 값을 담을 컨텍스트
export const TodoDispatchContext = createContext();

function App() {
  // const [todos, setTodos] = useState(mocData);
  const [todos, dispatch] = useReducer(reducer, mocData);
  const idRef = useRef(4);

  const onCreate = useCallback((content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        isDone: false,
        content: content,
        date: new Date().getTime(),
      },
    });
  }, []);

  const onUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE",
      targetId: targetId,
    });
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId: targetId,
    });
  }, []);

  const memoizedDispatch = useMemo(() => {
    return { onCreate, onDelete, onUpdate };
  }, []);

  return (
    <div className="app">
      <Header />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext value={memoizedDispatch}>
          <Editer />
          <List />
        </TodoDispatchContext>
      </TodoStateContext.Provider>
    </div>
  );
}

export default App;
