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

//This does not actually store the recipe list...
let recipeList: string[] = [];
//AND THE PROBLEM IS THE PROMISE!!!!!!!!!!!!
//It's because resolved Promises are immutable
let recipeListPromise: Promise<Recipe[]> = window.reciMakeAPI.makeRecipeList();

recipeListPromise.then(
    (list) => {
        console.log(list);
        console.log(RM.checkRecipeExists(list, "CaKe"));
        console.log(RM.checkRecipeExists(list, "memes"));
        console.log(RM.checkRecipeExists(list, "willnotwork"));
    }
)

async function unwrapRecipeList() {
    let recipeListUnwrap = ["One", "Tewo", "Twhee"];
    recipeList = recipeListUnwrap;
    console.log("During: " + recipeList);
}

console.log("Before: " + recipeList);
unwrapRecipeList();
console.log("After: " + recipeList);

let activeRecipe: Recipe = null;
console.log(`activeRecipe set to ${activeRecipe}`);
document.getElementById("activeRecipe").innerHTML = `Active Recipe: N/A`;

const listRecipes = document.querySelector("#listRecipes") as HTMLInputElement | null;

if (listRecipes !== null) {
    listRecipes.addEventListener("click", () => {
        recipeListPromise.then(
            (list) => {
                alert("List of Recipes:\n" + RM.printRecipeList(list));
            }
        )
    });
}

const addRecipe = document.querySelector("#addRecipe") as HTMLInputElement | null;

if (addRecipe !== null) {
    addRecipe.addEventListener("click", async (e) => {
        e.preventDefault();
        let dishNameInput: string = await prompt().trim();
        if (dishNameInput === null) {
            return;
        }
        if (dishNameInput === "") {
            alert("No name entered");
            return;
        }
        if (RM.checkRecipeExists(await recipeListPromise, dishNameInput)) {
            alert("Recipe already exists.");
            return;
        }
        activeRecipe = new Recipe(dishNameInput, [], [], []);
        window.reciMakeAPI.writeRecipe(activeRecipe);
        recipeListPromise = window.reciMakeAPI.makeRecipeList();
    });
}

const readRecipe = document.querySelector("#readRecipe") as HTMLFormElement | null;

if (readRecipe !== null) {
    readRecipe.addEventListener("submit", async (e) => {
        e.preventDefault();
        //Problem: Method returning as an any Object, instead of a Recipe Object
        //Solution (as of 5/23/23): Take the any Object and make the Recipe object in this function
        //with the fields of that object
        //NOTE: THIS APPLIES FOR BASICALLY ANY FUNCTION THAT USES Recipe AS AN ARGUMENT
        let activeRecipeAny: any = await RM.readRecipe(await recipeListPromise);

        if (activeRecipeAny !== null) {
            activeRecipe = new Recipe(activeRecipeAny._dishName, activeRecipeAny._ingredients,
            activeRecipeAny._instructions, activeRecipeAny._modifications);
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

const deleteRecipe = document.querySelector("#deleteRecipe") as HTMLInputElement | null;

if (deleteRecipe !== null) {
    deleteRecipe.addEventListener("click", () => {
        if(!confirm(`Are you sure you want to delete ${activeRecipe.dishName}?`)) {
            return;
        }
        window.reciMakeAPI.deleteRecipe(activeRecipe);
        recipeListPromise = window.reciMakeAPI.makeRecipeList();
        location.reload();
    });
}