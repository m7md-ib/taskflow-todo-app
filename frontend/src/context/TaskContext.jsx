import { createContext, useContext, useReducer, useCallback } from "react";
import * as api from "../services/api";
import toast from "react-hot-toast";

// ─── State Shape ──────────────────────────────────────────────────────────────
const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filter: "all",       // "all" | "pending" | "completed"
  search: "",
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false, error: null };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    case "DELETE_COMPLETED":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.status !== "completed"),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /** Load tasks from the API */
  const loadTasks = useCallback(async (filter, search) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.fetchTasks({ status: filter, search });
      dispatch({ type: "SET_TASKS", payload: res.data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message });
      toast.error("Failed to load tasks");
    }
  }, []);

  /** Create a new task */
  const addTask = useCallback(async (taskData) => {
    try {
      const res = await api.createTask(taskData);
      dispatch({ type: "ADD_TASK", payload: res.data });
      toast.success("Task created!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to create task");
      return false;
    }
  }, []);

  /** Update an existing task */
  const editTask = useCallback(async (id, updates) => {
    try {
      const res = await api.updateTask(id, updates);
      dispatch({ type: "UPDATE_TASK", payload: res.data });
      toast.success("Task updated!");
      return true;
    } catch (err) {
      toast.error(err.message || "Failed to update task");
      return false;
    }
  }, []);

  /** Toggle task status between pending/completed */
  const toggleTask = useCallback(async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const res = await api.updateTask(task._id, { status: newStatus });
      dispatch({ type: "UPDATE_TASK", payload: res.data });
    } catch (err) {
      toast.error("Failed to update status");
    }
  }, []);

  /** Delete a task */
  const removeTask = useCallback(async (id) => {
    try {
      await api.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  }, []);

  /** Bulk delete all completed tasks */
  const clearCompleted = useCallback(async () => {
    try {
      const res = await api.deleteCompletedTasks();
      dispatch({ type: "DELETE_COMPLETED" });
      toast.success(res.message);
    } catch (err) {
      toast.error("Failed to clear completed tasks");
    }
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  const setSearch = useCallback((search) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        ...state,
        loadTasks,
        addTask,
        editTask,
        toggleTask,
        removeTask,
        clearCompleted,
        setFilter,
        setSearch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/** Custom hook to access TaskContext */
export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within a TaskProvider");
  return ctx;
};
