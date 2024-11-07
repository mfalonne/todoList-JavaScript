/**
 * export: La fonction est exportée, ce qui signifie qu’elle peut être importée et utilisée dans d’autres fichiers JavaScript.
 * 
 * function createElement(tagName, attributes = {}): Cette fonction prend deux paramètres :
 * @param {string} tagName ne chaîne de caractères spécifiant le nom de l'élément HTML à créer (par exemple, div, img, a).
 * @param {object} attributes Un objet contenant des paires clé-valeur pour les attributs de l’élément (comme { id: "myDiv", class: "container" })
 * 
 * Object.entries(attributes): Convertit l'objet attributes en un tableau de paires [clé, valeur] (par exemple, { id: "myDiv", class: "container" } devient [["id", "myDiv"], ["class", "container"]]).
 * 
 * for (const [attribute, value] of ...): La boucle for...of parcourt chaque paire [clé, valeur], en assignant attribute à la clé (par exemple, "id") et value à la valeur associée (par exemple, "myDiv").
 * 
 * element.setAttribute(attribute, value): Pour chaque paire, utilise setAttribute pour ajouter l’attribut et sa valeur correspondante à l’élément
 * @return { HTMLElement}
 */

export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for (const [attribute, value] of Object.entries(attributes)) {
        if (value !== null) {

            element.setAttribute(attribute, value);
        }  
    }
    return element
}
/**
 * 
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function cloneTemplate(id) {
  const template = document.getElementById(id);
  if (template) {
    return template.content.cloneNode(true);
  } else {
    console.error(`Template avec l'ID "${id}" non trouvé.`);
    return null;
  }
}
