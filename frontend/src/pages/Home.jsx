import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import useLocalStorage from "../hooks/useLocalStorage";
import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";
import styles from "./Home.module.css";

const Home = () => {
  const { loadTasks, filter, search } = useTasks();
  const [darkMode, setDarkMode] = useLocalStorage("taskflow-dark", false);

  // Apply dark mode attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Reload tasks whenever filter or search changes
  useEffect(() => {
    loadTasks(filter, search);
  }, [filter, search, loadTasks]);

  return (
    <div className={styles.page}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      />

      <motion.main
        className={styles.container}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode((d) => !d)} />

        <div className={styles.stack}>
          <TaskForm />

          <div className={styles.section}>
            <FilterBar />
            <TaskList />
          </div>
        </div>

        <footer className={styles.footer}>
          Built with React + Express + MongoDB
        </footer>
      </motion.main>
    </div>
  );
};

export default Home;
