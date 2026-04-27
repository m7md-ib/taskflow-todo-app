import { AnimatePresence, motion } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";
import styles from "./TaskList.module.css";

const EmptyState = ({ filter, search }) => (
  <motion.div
    className={styles.empty}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className={styles.emptyIcon}>
      {search ? "🔍" : filter === "completed" ? "🎉" : "✨"}
    </div>
    <p className={styles.emptyTitle}>
      {search
        ? "No tasks match your search"
        : filter === "completed"
        ? "No completed tasks yet"
        : filter === "pending"
        ? "No pending tasks"
        : "Your list is empty"}
    </p>
    <p className={styles.emptySubtitle}>
      {search
        ? "Try a different search term"
        : filter === "all"
        ? "Add your first task above to get started"
        : ""}
    </p>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className={styles.skeletons}>
    {[1, 2, 3].map((i) => (
      <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
);

const TaskList = () => {
  const { tasks, loading, error, filter, search, clearCompleted } = useTasks();

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <motion.div
        className={styles.errorState}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>⚠️ {error}</p>
        <p className={styles.errorHint}>Check that the backend server is running on port 5000.</p>
      </motion.div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* List header */}
      {tasks.length > 0 && (
        <div className={styles.listHeader}>
          <span className={styles.taskCount}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
          {completedCount > 0 && filter !== "pending" && (
            <motion.button
              className={styles.clearBtn}
              onClick={clearCompleted}
              whileTap={{ scale: 0.95 }}
            >
              Clear {completedCount} completed
            </motion.button>
          )}
        </div>
      )}

      {/* Task cards */}
      {tasks.length === 0 ? (
        <EmptyState filter={filter} search={search} />
      ) : (
        <motion.ul className={styles.list} layout>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <li key={task._id} className={styles.listItem}>
                <TaskCard task={task} />
              </li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
};

export default TaskList;
