/**Ce code définit une fonction fetchJSON qui permet d'effectuer une requête HTTP vers une URL donnée, en s'assurant que la réponse est au format JSON. Elle gère également les erreurs réseau ou serveur et fournit des informations de diagnostic en cas de problème
 * 
 * export: La fonction est marquée comme export, ce qui signifie qu'elle peut être importée dans d'autres modules JavaScript.
 * 
 * async: La fonction est asynchrone, ce qui signifie qu’elle retourne une promesse et permet l'utilisation de await pour gérer les appels réseau asynchrones.
 * 
 * fetchJSON(url, options = {}): La fonction accepte deux arguments 
 * @param {*} url L’URL à laquelle la requête sera envoyée.
 * @param {*} options options: Un objet optionnel pour configurer la requête (par exemple, la méthode POST, des en-têtes supplémentaires, etc.). Il est par défaut un objet vide {}, ce qui signifie que si aucun options n’est passé, il sera vide par défaut.
 * 
 * headers: Un objet d'en-têtes HTTP est créé, qui contiendra des informations supplémentaires à envoyer avec la requête.
 * 
 * Accept: 'application/json': Définit l'en-tête Accept à application/json, indiquant que le client souhaite recevoir une réponse au format JSON. 
 * 
 * ...options.headers: Utilise l'opérateur de décomposition (spread) pour fusionner tout en-tête supplémentaire contenu dans options.headers avec l'en-tête Accept. Cela signifie que les en-têtes définis dans options.headers peuvent remplacer ou compléter ceux définis par défaut dans la fonction.
 * 
 * await fetch(url, { ...options, headers }): La fonction fetch envoie une requête HTTP asynchrone vers url.
 * @returns 
 */

export async function fetchJSON(url, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const r = await fetch(url, { ...options, headers });

    // Log pour voir si la réponse est bien obtenue
    //console.log("Statut de la réponse:", r.status);

    if (r.ok) {
      const data = await r.json();
      //console.log("Données reçues :", data); // Vérifie si les données JSON sont correctes
      return data;
    } else {
      console.error("Erreur serveur avec le statut:", r.status, r.statusText);
      throw new Error(`Erreur serveur : ${r.status} ${r.statusText}`);
    }
  } catch (error) {
    console.error("Erreur dans fetchJSON:", error);
    throw error; // Relance l'erreur pour que le code appelant puisse la gérer
  }
}
