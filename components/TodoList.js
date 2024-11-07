import { createElement } from "../functions/dom.js";
import { cloneTemplate } from "../functions/dom.js";

/**
 * @typedef {object} Todo
 * @property {number} id - Unique identifier for each todo item
 * @property {string} title - Title or description of the todo item
 * @property {boolean} completed - Whether the task is completed
 */

export class TodoList {
  /** @type {Todo[]} - Array holding all todo items */
  #todos = [];

  /** @type {HTMLULListElement} - Reference to the list element in the DOM */
  #listElement = [];

  /**
   * @param {Todo[]} todos - Initial list of todos
   */
  constructor(todos) {
    this.#todos = todos; // Assigns the initial todo list to the private property
  }

  /**
   * Appends the todo list layout and items to a given HTML element
   * @param {HTMLElement} element - Element to append the todo list to
   */
  appendTo(element) {
    // Adds the main todo list layout to the page
    element.append(cloneTemplate("todolist-layout"));

    // Selects the list container and adds all initial todo items
    this.#listElement = element.querySelector(".list-group");
    for (let todo of this.#todos) {
      const t = new TodoListItem(todo, this); // Creates a new TodoListItem with the current todo and the main list reference
      this.#listElement.append(t.element); // Appends the todo item to the list
    }

    // Adds an event listener to handle new todos on form submission
    element
      .querySelector("form")
      .addEventListener("submit", (e) => this.#onSubmit(e));

    // Adds event listeners for filter buttons (e.g., "All," "Done," "To-do")
    element.querySelectorAll(".btn-group button").forEach((button) => {
      button.addEventListener("click", (e) => this.#toggleFilter(e));
    });
  }

  /**
   * Handles the addition of a new todo item when the form is submitted
   * @param {SubmitEvent} e - Submit event from the form
   */
  #onSubmit(e) {
    e.preventDefault(); // Prevents page reload on form submission
    const form = e.currentTarget;
    const title = new FormData(e.currentTarget).get("title").toString().trim();
    if (title === "") return; // Ignores empty titles

    // Creates a new todo item object
    const todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    // Creates a TodoListItem instance and adds it to the start of the list
    const item = new TodoListItem(todo, this);
    this.#listElement.prepend(item.element);
    this.#todos.push(todo); // Adds the new todo to the internal list
    this.#onUpdate(); // Updates localStorage with the current list of todos
    form.reset(); // Clears the form input
  }

  /**
   * Updates localStorage with the current todo list
   */
  #onUpdate() {
    localStorage.setItem("todos", JSON.stringify(this.#todos));
  }

  /**
   * Removes a todo item by ID and updates localStorage
   * @param {number} todoId - ID of the todo item to remove
   */
  removeTodo(todoId) {
    // Filters out the todo item with the given ID
    this.#todos = this.#todos.filter((todo) => todo.id !== todoId);
    this.#onUpdate(); // Updates localStorage after removing the item
  }

  /**
   * Toggles the display filter for the todo list (e.g., shows only completed or uncompleted items)
   * @param {PointerEvent} e - Click event from the filter button
   */
  #toggleFilter(e) {
    e.preventDefault();
    const filter = e.currentTarget.getAttribute("data-filter"); // Gets the filter type ("all", "done", "todo")

    // Updates the button appearance to indicate the active filter
    e.currentTarget.parentElement
      .querySelector(".active")
      .classList.remove("active");
    e.currentTarget.classList.add("active");

    // Adds/removes CSS classes to filter the todo items based on their completion status
    if (filter === "todo") {
      this.#listElement.classList.add("hide-completed");
      this.#listElement.classList.remove("hide-todo");
    } else if (filter === "done") {
      this.#listElement.classList.add("hide-todo");
      this.#listElement.classList.remove("hide-completed");
    } else {
      this.#listElement.classList.remove("hide-todo");
      this.#listElement.classList.remove("hide-completed");
    }
  }
}

class TodoListItem {
  #element; // DOM element representing this todo item
  #todo; // The todo item object
  #parentList; // Reference to the parent TodoList instance

  /**
   * @param {Todo} todo - The todo item object
   * @param {TodoList} parentList - The main TodoList instance
   */
  constructor(todo, parentList) {
    this.#todo = todo; // Stores the todo item
    this.#parentList = parentList; // Stores a reference to the parent list for future updates

    // Creates a unique ID for the todo item
    const id = `todo-${todo.id}`;
    const li = cloneTemplate("todolist-item").firstElementChild; // Clones the list item template
    this.#element = li;

    // Sets up the checkbox with the correct ID and completion status
    const checkbox = li.querySelector("input");
    checkbox.setAttribute("id", id);
    if (todo.completed) checkbox.setAttribute("checked", "");

    // Sets up the label for the todo item
    const label = li.querySelector("label");
    label.setAttribute("for", id);
    label.innerText = todo.title;

    // Sets up the delete button and toggle functionality
    const button = li.querySelector("button");
    this.toggle(checkbox); // Sets the initial visual state based on completion

    // Adds event listeners for checkbox toggle and delete button
    button.addEventListener("click", (e) => this.remove(e));
    checkbox.addEventListener("change", (e) => this.toggle(e.currentTarget));
  }

  /**
   * Gets the HTML element representing the todo item
   * @return {HTMLElement} - The todo item element
   */
  get element() {
    return this.#element;
  }

  /**
   * Removes the todo item from the DOM and informs the parent list to update localStorage
   * @param {PointerEvent} e - Click event from the delete button
   */
  remove(e) {
    e.preventDefault();
    this.#element.remove(); // Removes the item from the DOM
    this.#parentList.removeTodo(this.#todo.id); // Informs the parent list to remove the item from the data array
  }

  /**
   * Toggles the completed state of the todo item and updates its appearance
   * @param {HTMLInputElement} checkbox - The checkbox input for this todo item
   */
  toggle(checkbox) {
    if (checkbox.checked) {
      this.#element.classList.add("is-completed");
    } else {
      this.#element.classList.remove("is-completed");
    }
  }
}
