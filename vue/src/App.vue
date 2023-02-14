<script>
import { getAllTodos, completedTodo, completedAllTodos, createTodo, updateTitle, removeTodo, removeCompleted } from './apis'
const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

export default {
  data: () => ({
    todos: [],
    editedTodo: null,
    visibility: 'all'
  }),
  computed: {
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    remaining() {
      return filters.active(this.todos).length
    }
  },
  methods: {
    async toggleAll(e) {
      if (await completedAllTodos(e.target.checked)) {
        this.todos.forEach((todo) => (todo.completed = e.target.checked))
      }
    },
    async onUpdateCompleted(todo, target) {
      if (await completedTodo(todo.id, target)) {
        todo.completed = target
      }
    },
    async addTodo(e) {
      const value = e.target.value.trim()
      if (!value) {
        return
      }
      const created = await createTodo(value)
      if (created) {
        this.todos.push(created)
        e.target.value = ''
      }
    },

    async removeTodo(todo) {
      if (await removeTodo(todo.id)) {
        this.todos.splice(this.todos.indexOf(todo), 1)
      }
    },

    editTodo(todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    async doneEdit(todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      const title = todo.title.trim()
      if (!title) {
        this.removeTodo(todo)
      } else if (await updateTitle(todo.id, title)) {
        todo.title = title
      }
    },

    cancelEdit(todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    async removeCompleted() {
      if (await removeCompleted()) {
        this.todos = filters.active(this.todos)
      }
    },

    onHashChange() {
      var visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    }
  },
  async mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
    getAllTodos(data => {
      this.todos = data
    })
  }
}
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      >
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      >
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" :checked="todo.completed" @change="e => onUpdateCompleted(todo, e.target.checked)">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            v-if="todo === editedTodo"
            class="edit"
            type="text"
            v-model="todo.title"
            @vnode-mounted="({ el }) => el.focus()"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          >
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining === 1 ? ' item' : ' items' }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<style>
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>