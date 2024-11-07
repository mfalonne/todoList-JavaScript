import { fetchJSON } from "./functions/api.js";
import { createElement } from "./functions/dom.js";
import { TodoList } from "./components/TodoList.js";

/**
 * Ce code JavaScript effectue les actions suivantes pour charger et afficher une liste de tâches ("todos") depuis une API externe, avec un mécanisme de gestion d'erreurs.
 */

async function loadTodos() {
  try {
    // const todos = await fetchJSON(
    //   "https://jsonplaceholder.typicode.com/todos?_limit=5"
    // );
      const todosInStorage = localStorage.getItem('todos')?.toString()
      let todos = []
      if (todosInStorage) {
        todos = JSON.parse(todosInStorage)
      }
    //console.log("Liste des tâches reçues:", todos);

    const list = new TodoList(todos);
    list.appendTo(document.querySelector("#todolist")); // appendTo() ajoute l'element dont id = #todolist dans un élément html spécifier
  } catch (e) {
    console.error("Erreur attrapée dans loadTodos :", e);

    const alertElement = createElement("div", {
      class: "alert alert-danger m-2",
      role: "alert",
    });
    alertElement.innerText = "Impossible de charger les éléments";
    document.body.prepend(alertElement);
  }
}

// Appeler la fonction
loadTodos();
