/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
import './index.css';
import Recipe from './Recipe';
import * as RM from './RecipeMaker';


console.log('👋 This message is being logged by "renderer.js", included via webpack');

let recipeList: Promise<string[]> = window.reciMakeAPI.makeRecipeList();

recipeList.then(
    (list) => {
        console.log(list);
        console.log(RM.checkRecipeExists(list, "CaKe"));
        console.log(RM.checkRecipeExists(list, "memes"));
        console.log(RM.checkRecipeExists(list, "willnotwork"))
    }
)

let activeRecipe: Recipe = null;
console.log(`activeRecipe set to ${activeRecipe}`);
document.getElementById("activeRecipe").innerHTML = `Active Recipe: N/A`;

const listRecipes = document.querySelector("#listRecipes") as HTMLInputElement | null;

if (listRecipes !== null) {
    listRecipes.addEventListener("click", () => {
        recipeList.then(
            (list) => {
                alert("List of Recipes:\n" + RM.printList(list));
            }
        )
    });
}

const readRecipe = document.querySelector("#readRecipe") as HTMLFormElement | null;

if (readRecipe !== null) {
    readRecipe.addEventListener("submit", async (e) => {
        e.preventDefault();
        //Problem: Method not returning as Recipe Object
        //Solution (as of 5/23/23): Return an any Object and make the Recipe object in this function
        let activeRecipeAny: any = await RM.readRecipe(recipeList);

        activeRecipe = new Recipe(activeRecipeAny._dishName, activeRecipeAny._ingredients,
            activeRecipeAny._instructions, activeRecipeAny._modifications);

        if (activeRecipe !== null) {
            //TODO: Figure out how to get to next screen
            console.log(activeRecipe);
            document.getElementById("activeRecipe").innerHTML = `Active Recipe: ${activeRecipe.dishName}`;
        }
    });
}

const listIngredients = document.querySelector("#listIngredients") as HTMLInputElement | null;

if (listIngredients !== null) {
    listIngredients.addEventListener("click", () => {
        if (activeRecipe === null) {
            alert("No active recipe");
        }
        else {
            alert(`${activeRecipe.dishName}'s Ingredients\n` + 
                RM.printList(activeRecipe.ingredients));
        }
    });
}

const listInstructions = document.querySelector("#listInstructions") as HTMLInputElement | null;

if (listInstructions !== null) {
    listInstructions.addEventListener("click", () => {
        if (activeRecipe === null) {
            alert("No active recipe");
        }
        else {
            alert(`${activeRecipe.dishName}'s Instructions\n` + 
                RM.printList(activeRecipe.instructions));
        }
    });
}

const listModifications = document.querySelector("#listModifications") as HTMLInputElement | null;

if (listModifications !== null) {
    listModifications.addEventListener("click", () => {
        if (activeRecipe === null) {
            alert("No active recipe");
        }
        else {
            alert(`${activeRecipe.dishName}'s Modifications\n` + 
                RM.printList(activeRecipe.modifications));
        }
    });
}
