import { useState } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { useTasks } from "../context/TaskContext";
import styles from "./TaskCard.module.css";

const TaskCard = ({ task }) => {
  const { toggleTask, editTask, removeTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
  });
  const [saving, setSaving] = useState(false);

  const isCompleted = task.status === "completed";
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && !isCompleted && isPast(dueDateObj) && !isToday(dueDateObj);

  const handleSave = async () => {
    if (!editForm.title.trim()) return;
    setSaving(true);
    const success = await editTask(task._id, {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      dueDate: editForm.dueDate || null,
    });
    setSaving(false);
    if (success) setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") { setIsEditing(false); }
  };

  return (
    <motion.div
      layout
      className={`${styles.card} ${isCompleted ? styles.completed : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      whileHover={{ y: -1 }}
    >
      {/* Checkbox */}
      <button
        className={`${styles.checkbox} ${isCompleted ? styles.checked : ""}`}
        onClick={() => toggleTask(task)}
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
      >
        {isCompleted && (
          <motion.svg
            viewBox="0 0 12 10"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25 }}
          >
            <motion.path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </motion.svg>
        )}
      </button>

      {/* Content */}
      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editForm}>
            <input
              autoFocus
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              onKeyDown={handleKeyDown}
              className={styles.editInput}
              placeholder="Task title"
              maxLength={200}
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
              className={styles.editTextarea}
              placeholder="Description (optional)"
              rows={2}
              maxLength={1000}
            />
            <div className={styles.editMeta}>
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm((p) => ({ ...p, dueDate: e.target.value }))}
                className={styles.editDate}
              />
              <div className={styles.editActions}>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={saving || !editForm.title.trim()}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className={styles.cancelEditBtn}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className={`${styles.title} ${isCompleted ? styles.titleDone : ""}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={styles.description}>{task.description}</p>
            )}
            {dueDateObj && (
              <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>
                {isOverdue ? "⚠ " : "📅 "}
                {isToday(dueDateObj)
                  ? "Due today"
                  : format(dueDateObj, "MMM d, yyyy")}
              </span>
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <EditIcon />
          </button>
          {showConfirm ? (
            <div className={styles.confirmRow}>
              <button className={styles.confirmDelete} onClick={() => removeTask(task._id)}>
                Delete
              </button>
              <button className={styles.cancelDelete} onClick={() => setShowConfirm(false)}>
                ✕
              </button>
            </div>
          ) : (
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => setShowConfirm(true)}
              aria-label="Delete task"
              title="Delete"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      )}

      {/* Status badge */}
      <div className={`${styles.statusDot} ${isCompleted ? styles.dotDone : styles.dotPending}`} />
    </motion.div>
  );
};

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

export default TaskCard;
