const Task = require("../models/Task");
const { validationResult } = require("express-validator");

/**
 * GET /tasks
 * Fetch all tasks with optional filtering by status and search query.
 */
const getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;

    // Build dynamic filter object
    const filter = {};

    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }

    if (search && search.trim()) {
      // Case-insensitive search on title or description
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("getTasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

/**
 * POST /tasks
 * Create a new task.
 */
const createTask = async (req, res) => {
  // Handle validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "pending",
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("createTask error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    });
  }
};

/**
 * PUT /tasks/:id
 * Update an existing task (title, description, dueDate, status).
 */
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only update fields that were provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("updateTask error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating task",
    });
  }
};

/**
 * DELETE /tasks/:id
 * Delete a single task by ID.
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("deleteTask error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

/**
 * DELETE /tasks/completed
 * Bulk delete all completed tasks.
 */
const deleteCompletedTasks = async (req, res) => {
  try {
    const result = await Task.deleteMany({ status: "completed" });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed task(s) deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("deleteCompletedTasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while bulk deleting tasks",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
};
