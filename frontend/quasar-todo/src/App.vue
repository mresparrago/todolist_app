<template>
  <router-view />
</template>

<script setup>
import { ref } from 'vue'

const todos = ref([])
const selectedTodo = ref()
const fetchingTodos = ref(false)

async function fetchTodos () {
  fetchingTodos.value = true

  const fetcher = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = await fetcher.json()

  fetchingTodos.value = false
  todos.value = data

  selectedTodo = todos.value?.[0]
  console.log(selectedTodo.value)
  console.log(todos.value)

}
</script>
