<template>
  <q-dialog v-model="visible">
    <q-card style="max-width: 800px; min-width: 600px">
      <q-card-section>
        <div class="text-h6">
          {{ mode === 'add' ? 'Add New Task' : 'Update Task' }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="title" label="Task Title" dense filled />
        <q-input
        v-if=" mode === 'add'"
        v-model="createdBy"
        label="Your Name"
        dense
        filled
        />

        <q-input
        v-else
        v-model="updateBy"
        label="Your Name"
        dense
        filled
        />

        <q-checkbox
        v-if="mode === 'update'"
        v-model="isCompleted"
        color="red"
        label="Completed"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup>
          <q-btn
          color="primary"
          :label=" mode === 'add' ? 'Save Task' : 'Confirm Update'"
          @click="submit"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name : 'TaskDialog',
  props: {
    visible: Boolean,
    mode: {
      type: String,
      default: 'add',
    },
    task: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: [ 'submit' ],
  data() {
    return {
      title: '',
      createdBy: '',
      updatedBy: '',
      isCompleted: false,
    };
  },

  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        if (this.mode === 'update' && newTask) {
          this.title = newTask.title || '';
          this.isCompleted = newTask.isCompleted || false;
        }
      },
    },
    visible(val) {
      if (val === false) {
        this.reset();
      }
    },
  },
  methods: {
    reset() {
      this.title = '';
      this.createdBy = '';
      this.updatedBy = '';
      this.isCompleted = false;
    },
    submit() {
      if (!this.title.trim()) {
        this.$q.notify({ type: 'warning', message: 'Task title is required' });
        return;
      }

      if (this.mode === 'add') {
        if(!this.createdBy.trim()) {
          this.$.q.notify({ type: 'warning', message: 'Enter your name' });
          return;
        };

        this.$emit('submit', {
          title: this.title,
          createdBy: this.createdBy,
        });
      } else {
        if (!this.updatedBy.trim()) {
          this.$q.notify({ type: 'warning', message: 'Enter your name' });
          return;
        }
        this.$emit('submit', {
          title: this.title,
          createdBy: this.createdBy,
        });
      }
    }
  }
}
</script>
