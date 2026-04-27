const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
} = require("../controllers/taskController");

// Validation rules for creating a task
const createValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage('Status must be "pending" or "completed"'),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

// Validation rules for updating a task
const updateValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage('Status must be "pending" or "completed"'),
  body("dueDate")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === "" || value === undefined) return true;
      if (!isNaN(Date.parse(value))) return true;
      throw new Error("Due date must be a valid date");
    }),
];

// Routes
// NOTE: Specific routes must come before parameterized routes
router.delete("/completed", deleteCompletedTasks); // DELETE /tasks/completed
router.get("/", getTasks);                          // GET    /tasks
router.post("/", createValidation, createTask);     // POST   /tasks
router.put("/:id", updateValidation, updateTask);   // PUT    /tasks/:id
router.delete("/:id", deleteTask);                  // DELETE /tasks/:id

module.exports = router;
