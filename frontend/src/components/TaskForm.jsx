import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import styles from "./TaskForm.module.css";

const TaskForm = () => {
  const { addTask } = useTasks();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    else if (form.title.length > 200) newErrors.title = "Max 200 characters";
    if (form.description.length > 1000) newErrors.description = "Max 1000 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const success = await addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
    setLoading(false);

    if (success) {
      setForm({ title: "", description: "", dueDate: "" });
      setIsExpanded(false);
    }
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Main title input row */}
        <div className={styles.primaryRow}>
          <div className={styles.inputWrapper}>
            <span className={styles.plusIcon}>+</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              onFocus={() => setIsExpanded(true)}
              placeholder="Add a new task..."
              className={`${styles.titleInput} ${errors.title ? styles.inputError : ""}`}
              maxLength={200}
              aria-label="Task title"
            />
          </div>
          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !form.title.trim()}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              "Add Task"
            )}
          </motion.button>
        </div>

        {errors.title && (
          <motion.p
            className={styles.errorMsg}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.title}
          </motion.p>
        )}

        {/* Expandable extra fields */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className={styles.extraFields}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add a description (optional)..."
                className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                rows={2}
                maxLength={1000}
                aria-label="Task description"
              />
              {errors.description && (
                <p className={styles.errorMsg}>{errors.description}</p>
              )}

              <div className={styles.metaRow}>
                <label className={styles.dateLabel}>
                  <span className={styles.dateIcon}>📅</span>
                  <span className={styles.dateText}>Due date</span>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className={styles.dateInput}
                    min={new Date().toISOString().split("T")[0]}
                    aria-label="Due date"
                  />
                </label>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => {
                    setIsExpanded(false);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default TaskForm;
