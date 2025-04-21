// src/services/TodoService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/todos';

export default {
  // Get all tasks
  getTodos() {
    return axios.get(API_URL);
  },

  // Create a new task
  addTodo(task) {
    return axios.post(API_URL, { task });
  },

  // Update an existing task
  updateTodo(id, task, completed) {
    return axios.put(`${API_URL}/${id}`, { task, completed });
  },

  // Delete a task
  deleteTodo(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
};
