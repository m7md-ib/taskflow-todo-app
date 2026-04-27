/**
 * api.js — Centralized API service for communicating with the backend.
 * All fetch calls go through here to keep components clean.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Generic fetch wrapper with error handling.
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Throw a descriptive error from the API response
    throw new Error(data.message || "An API error occurred");
  }

  return data;
};

// ─── Task API Methods ──────────────────────────────────────────────────────────

/** Fetch all tasks, with optional filters */
export const fetchTasks = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiFetch(`/tasks${qs}`);
};

/** Create a new task */
export const createTask = (taskData) =>
  apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });

/** Update a task by ID */
export const updateTask = (id, updates) =>
  apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

/** Delete a single task by ID */
export const deleteTask = (id) =>
  apiFetch(`/tasks/${id}`, { method: "DELETE" });

/** Bulk delete all completed tasks */
export const deleteCompletedTasks = () =>
  apiFetch("/tasks/completed", { method: "DELETE" });
