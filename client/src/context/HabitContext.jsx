import React, { createContext, useContext, useReducer } from "react";
import { habitAPI } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const HabitContext = createContext(null);

// Action types
const HABIT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_HABITS: "SET_HABITS",
  ADD_HABIT: "ADD_HABIT",
  UPDATE_HABIT: "UPDATE_HABIT",
  DELETE_HABIT: "DELETE_HABIT",
  TOGGLE_COMPLETION: "TOGGLE_COMPLETION",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Initial state
const initialState = {
  habits: [],
  isLoading: false,
  error: null,
};

// Reducer function
const habitReducer = (state, action) => {
  switch (action.type) {
    case HABIT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case HABIT_ACTIONS.SET_HABITS:
      return {
        ...state,
        habits: action.payload,
        isLoading: false,
        error: null,
      };
    case HABIT_ACTIONS.ADD_HABIT:
      return {
        ...state,
        habits: [action.payload, ...state.habits],
        error: null,
      };
    case HABIT_ACTIONS.UPDATE_HABIT:
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit._id === action.payload._id ? action.payload : habit
        ),
        error: null,
      };
    case HABIT_ACTIONS.DELETE_HABIT:
      return {
        ...state,
        habits: state.habits.filter((habit) => habit._id !== action.payload),
        error: null,
      };
    case HABIT_ACTIONS.TOGGLE_COMPLETION:
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit._id === action.payload.habitId
            ? { ...habit, completedToday: action.payload.completed }
            : habit
        ),
        error: null,
      };
    case HABIT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case HABIT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Habit Provider Component
export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch all habits
  const fetchHabits = async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping habit fetch");
      return;
    }

    try {
      dispatch({ type: HABIT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });

      const response = await habitAPI.getHabits();
      dispatch({
        type: HABIT_ACTIONS.SET_HABITS,
        payload: response.data.data || [],
      });
    } catch (error) {
      console.error("Fetch habits error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch habits";
      dispatch({ type: HABIT_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  };

  // Create new habit
  const createHabit = async (habitData) => {
    try {
      dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });

      const response = await habitAPI.createHabit(habitData);
      dispatch({
        type: HABIT_ACTIONS.ADD_HABIT,
        payload: {
          ...response.data.data,
          currentStreak: 0,
          completionRate: 0,
          completedToday: false,
        },
      });

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create habit";
      dispatch({ type: HABIT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Update habit
  const updateHabit = async (id, habitData) => {
    try {
      dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });

      const response = await habitAPI.updateHabit(id, habitData);
      dispatch({
        type: HABIT_ACTIONS.UPDATE_HABIT,
        payload: response.data.data,
      });

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update habit";
      dispatch({ type: HABIT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Delete habit
  const deleteHabit = async (id) => {
    try {
      dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });

      await habitAPI.deleteHabit(id);
      dispatch({
        type: HABIT_ACTIONS.DELETE_HABIT,
        payload: id,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete habit";
      dispatch({ type: HABIT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Toggle habit completion
  const toggleCompletion = async (id, notes = "") => {
    try {
      dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });

      const response = await habitAPI.toggleCompletion(id, { notes });
      dispatch({
        type: HABIT_ACTIONS.TOGGLE_COMPLETION,
        payload: {
          habitId: id,
          completed: response.data.data.completed,
        },
      });

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update completion";
      dispatch({ type: HABIT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: HABIT_ACTIONS.CLEAR_ERROR });
  };

  // Get habit stats
  const getHabitStats = () => {
    const totalHabits = state.habits.length;
    const completedToday = state.habits.filter((h) => h.completedToday).length;
    const completionRate =
      totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const longestStreak = Math.max(
      ...state.habits.map((h) => h.currentStreak || 0),
      0
    );

    return {
      totalHabits,
      completedToday,
      completionRate,
      longestStreak,
    };
  };

  const value = {
    ...state,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    clearError,
    getHabitStats,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

// Custom hook to use habit context
export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === null) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};
