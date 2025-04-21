<template>
  <q-page class="bg-grey-3 column">
    <!-- Header with Add Task Button and Search Bar in a Row -->
    <div class="row q-pa-md bg-primary">
      <!-- Add Task Button -->
      <q-btn
        @click="showAddTaskDialog"
        color="primary"
        label="Add Task"
        class="q-mr-md"
        id="addTaskButton"
      />
      <!-- Search Box -->
      <q-input
        v-model="searchQuery"
        placeholder="Search tasks..."
        dense
        clearable
        class="q-flex-grow"
        id="search"
      />
    </div>

    <!-- Task List -->
    <q-list separator bordered class="bg-yellow-1">
      <q-item
        v-for="task in sortedFilteredTasks"
        :key="task.id"
        :class="{ 'completed bg-blue-1': task.isCompleted }"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label :class="['text-h4', { 'completed-text': task.isCompleted }]">
            {{ task.title }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <!-- Display createdAt -->
          <q-item-label caption
            >Created at: {{ formatDate(task.dateTimeCreated) }}</q-item-label
          >
          <q-item-label caption class="text-grey"
            >Created by: {{ task.createdBy || "Unknown" }}</q-item-label
          >

          <!-- Display updatedBy and updatedAt -->
          <q-item-label caption class="text-blue" v-if="task.updatedBy"
            >Updated by: {{ task.updatedBy }}</q-item-label
          >
          <q-item-label caption class="text-grey" v-if="task.dateTimeUpdated"
            >Last Update: {{ formatDate(task.dateTimeUpdated) }}</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-btn
            @click.stop="showUpdateDialog(task)"
            flat
            round
            dense
            color="green"
            icon="edit"
            size="lg"
          />
        </q-item-section>

        <q-item-section side>
          <q-btn
            @click.stop="deleteTask(task.id)"
            flat
            round
            dense
            color="red"
            icon="delete"
            size="lg"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- No Tasks -->
    <div
      v-if="!sortedFilteredTasks.length && !fetchingTasks"
      class="no-tasks absolute-center"
    >
      <q-icon name="check" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">No Tasks Found</div>
    </div>

    <!-- Add Task Dialog -->
    <q-dialog v-model="addTaskDialogVisible">
      <q-card style="max-width: 800px; min-width: 600px">
        <q-card-section>
          <div class="text-h6">Add New Task</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="taskTitle" label="Task Title" dense filled />
          <q-input v-model="taskCreatedBy" label="Your Name" dense filled />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Save Task" @click="addTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Update Task Dialog -->
    <q-dialog v-model="updateTaskDialogVisible">
      <q-card style="max-width: 800px; min-width: 600px">
        <q-card-section>
          <div class="text-h6">Update Task</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="taskTitle" label="Task Title" dense filled />
          <q-input v-model="taskUpdatedBy" label="Your Name" dense filled />
          <q-checkbox v-model="taskIsCompleted" color="red" label="Completed" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Confirm Update" @click="updateTask()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const tasks = ref([]);
const searchQuery = ref("");

// Task Properties
const taskId = ref(null);
const taskTitle = ref("");
const taskIsCompleted = ref(false);
const taskUpdatedBy = ref("");
const taskCreatedBy = ref("");

// Booleans
const fetchingTasks = ref(false);
const addTaskDialogVisible = ref(false);
const updateTaskDialogVisible = ref(false);

const API_URL = "http://localhost:3000/task"; // Backend API URL

// Format date function
function formatDate(dateString) {
  if (!dateString) return "No Date";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
}

// Filter and sort tasks based on search query and completion status
const sortedFilteredTasks = computed(() => {
  return tasks.value.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  // .sort((a, b) => {
  //   if (a.isCompleted === b.isCompleted) return 0;
  //   return a.isCompleted ? 1 : -1; // Push completed tasks to the bottom
  // });
});

// Show Add Task Dialog
function showAddTaskDialog() {
  taskTitle.value = "";
  taskCreatedBy.value = "";
  taskUpdatedBy.value = "";
  taskIsCompleted.value = false;
  addTaskDialogVisible.value = true;
}

// Fetch all tasks
async function fetchTasks() {
  fetchingTasks.value = true;
  try {
    const response = await fetch(API_URL);
    tasks.value = await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    $q.notify({ type: "negative", message: "Failed to load tasks!" });
  } finally {
    fetchingTasks.value = false;
  }
}

// Add a new task
async function addTask() {
  try {
    const title = taskTitle.value.trim();
    const userName = taskCreatedBy.value.trim();

    if (!title || !userName) {
      $q.notify({ type: "warning", message: "Title and CreatedBy are required!" });
      return;
    }

    // Prepare new task object to send to the backend
    const newTask = {
      title,
      createdBy: userName,
    };

    // Send POST request to the backend
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Catch any error response from backend
      console.error("Backend Error:", errorData);
      $q.notify({ type: "negative", message: "Failed to add task!" });
      return;
    }

    // Get the newly created task from the response
    const savedTask = await response.json();

    // Add the new task to the frontend list
    tasks.value.push(savedTask);

    // Refresh the task list after successful task creation
    addTaskDialogVisible.value = false;

    // Optionally re-fetch all tasks to get the updated list, including the new task
    fetchTasks(); // This may be unnecessary since you are already adding the new task directly
  } catch (error) {
    console.error("Error adding task:", error);
    $q.notify({ type: "negative", message: "Failed to add task!" });
  }
}

// Show Update Task Dialog
function showUpdateDialog(task) {
  taskId.value = task.id;
  taskTitle.value = task.title;
  taskCreatedBy.value = task.createdBy;
  taskUpdatedBy.value = "";
  taskIsCompleted.value = task.isCompleted;
  updateTaskDialogVisible.value = true;
}

// Update Task
async function updateTask() {
  if (!taskUpdatedBy.value.trim()) {
    $q.notify({ type: "warning", message: "Please enter your name!" });
    return;
  }

  try {
    const updateData = {
      title: taskTitle.value.trim(),
      isCompleted: taskIsCompleted.value,
      updatedBy: taskUpdatedBy.value,
    };

    const response = await fetch(`${API_URL}/${taskId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error("Failed to update task");

    // Get the newly updated task from the response
    const savedTask = await response.json();

    // Update the task in the frontend list
    const index = tasks.value.findIndex((task) => task.id === taskId.value);
    if (index !== -1) tasks.value[index] = savedTask;

    // Refresh the task list after successful task update
    updateTaskDialogVisible.value = false;

    // Optionally re-fetch all tasks to get the updated list, including the updated task
    fetchTasks(); // This may be unnecessary since you are already updating the task directly
  } catch (error) {
    console.error("Error updating task:", error);
    $q.notify({ type: "negative", message: "Failed to update task!" });
  }
}

// Delete task function
async function deleteTask(id) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this task?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTasks();
      $q.notify({ type: "positive", message: "Task deleted!" });
    } catch (error) {
      console.error("Error deleting task:", error);
      $q.notify({ type: "negative", message: "Failed to delete task!" });
    }
  });
}

// Fetch tasks on mount
onMounted(fetchTasks);
</script>

<style>
.completed-text {
  text-decoration: line-through;
  color: #888; /* Optional: makes it look more visually muted */
}

.completed {
  opacity: 0.5; /* Optional: slight fade effect for completed tasks */
}

.q-flex-grow {
  width: 500px;
}

#addTaskButton {
  width: 200px;
}
</style>
