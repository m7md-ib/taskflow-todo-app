import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTasks } from "../context/TaskContext";
import styles from "./FilterBar.module.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Done" },
];

const FilterBar = () => {
  const { filter, setFilter, setSearch, search, tasks } = useTasks();
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef(null);

  // Debounce search input so we don't refetch on every keypress
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 350);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearch("");
  };

  // Count per filter
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className={styles.wrapper}>
      {/* Filter pills */}
      <div className={styles.filters} role="tablist" aria-label="Task filter">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.active : ""}`}
            onClick={() => setFilter(f.key)}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
            <span className={styles.badge}>{counts[f.key]}</span>
            {filter === f.key && (
              <motion.div
                className={styles.activePill}
                layoutId="activePill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className={styles.searchInput}
          aria-label="Search tasks"
        />
        {localSearch && (
          <button className={styles.clearSearch} onClick={clearSearch} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

export default FilterBar;
