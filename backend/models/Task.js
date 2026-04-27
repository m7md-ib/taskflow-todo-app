const mongoose = require("mongoose");

/**
 * Task Schema
 * Represents a single to-do item in the database.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: 'Status must be either "pending" or "completed"',
      },
      default: "pending",
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Index for faster filtering queries
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
