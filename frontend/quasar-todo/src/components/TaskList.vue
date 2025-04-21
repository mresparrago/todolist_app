<template>
  <q-list separator bordered class="bg-yellow-1">
    <q-item
      v-for="task in tasks"
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
        <q-item-label caption
          >Created at: {{ formatDate(task.dateTimeCreated) }}</q-item-label
        >
        <q-item-label caption class="text-grey"
          >Created by: {{ task.createdBy || "Unknown" }}</q-item-label
        >
        <q-item-label caption class="text-blue" v-if="task.updatedBy"
          >Updated by: {{ task.updatedBy }}</q-item-label
        >
        <q-item-label caption class="text-grey" v-if="task.dateTimeUpdated"
          >Last Update: {{ formatDate(task.dateTimeUpdated) }}</q-item-label
        >
      </q-item-section>

      <q-item-section side>
        <q-btn
          @click.stop="$emit('edit', task)"
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
          @click.stop="$emit('delete', task.id)"
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
</template>

<script>
export default {
  props: ["tasks"],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.completed-text {
  text-decoration: line-through;
  color: #888;
}
.completed {
  opacity: 0.5;
}
</style>
