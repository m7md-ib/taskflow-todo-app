import { motion } from "framer-motion";
import styles from "./Header.module.css";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>
          <span>T</span>
        </div>
        <div>
          <h1 className={styles.title}>Taskflow</h1>
          <p className={styles.subtitle}>Stay in the zone.</p>
        </div>
      </div>
      <motion.button
        className={styles.themeToggle}
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.9, rotate: 20 }}
        transition={{ type: "spring", stiffness: 400 }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        title={darkMode ? "Light mode" : "Dark mode"}
      >
        {darkMode ? "☀️" : "🌙"}
      </motion.button>
    </header>
  );
};

export default Header;
