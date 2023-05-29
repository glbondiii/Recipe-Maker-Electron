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
import * as Templates from './templates';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

//Menu Transport Functions
function loadMainMenu(): void {
	if (activeMenu === "edit") {
	}

	body.innerHTML = Templates.mainMenu;
	initializeMenuTransportButtons();
	initializeMainMenuButtons();

	if (activeRecipe !== null) {
		document.getElementById("activeRecipe").innerHTML = `Active Recipe: ${activeRecipe.dishName}`;
	}
	else {
		document.getElementById("activeRecipe").innerHTML = `Active Recipe: N/A`;
	}

	activeMenu = "main";
}

function loadPrintMenu(): void {
	if (activeRecipe === null) {
		alert("No active recipe");
		return;
	}

	if (activeMenu === "edit") {
	}

	body.innerHTML = Templates.printMenu;
	initializeMenuTransportButtons();

	if (dishNameHeader !== null) {
		dishNameHeader.innerHTML = activeRecipe.dishName;
	}

	if (ingredientsOL !== null) {
		ingredientsOL.innerHTML = RM.makeOrderedHTMLList(activeRecipe.ingredients);
	}

	if (instructionsOL !== null) {
		instructionsOL.innerHTML = RM.makeOrderedHTMLList(activeRecipe.instructions);
	}

	if (modificationsOL !== null) {
		modificationsOL.innerHTML = RM.makeOrderedHTMLList(activeRecipe.modifications);
	}

	activeMenu = "print";
}

function loadEditMenu(): void {
	if (activeRecipe === null) {
		alert("No active recipe");
		return;
	}

	body.innerHTML = Templates.editMenu;
	initializeMenuTransportButtons();
	initializeEditMenuButtons();

	if (activeRecipeHTML !== null) {
		activeRecipeHTML.innerHTML = `Active Recipe: ${activeRecipe.dishName}`
	}

	//Default List and Mode
	activeList = activeRecipe.ingredients;
	listLength = activeList.length;
	activeModeString = "add";

	if (activeListElement !== null) {
		activeListElement.innerHTML = RM.makeOrderedHTMLList(activeList);
	}

	activeMenu = "edit"
}

//General Menu Variables
const body: HTMLBodyElement = document.getElementsByTagName("body").item(0);
let activeMenu: string;

//Resolved Promises are immutable; don't try to use a normal array
let recipeListPromise: Promise<Recipe[]> = window.reciMakeAPI.makeRecipeList();

recipeListPromise.then(
	(list) => {
		console.log(list);
		console.log(RM.checkRecipeExists(list, "CaKe"));
		console.log(RM.checkRecipeExists(list, "rick"));
		console.log(RM.checkRecipeExists(list, "PIZZA"));
		console.log(RM.checkRecipeExists(list, "memes"));
		console.log(RM.checkRecipeExists(list, "willnotwork"));
	}
)

let activeRecipe: Recipe = null;;
console.log(`activeRecipe set to ${activeRecipe}`);

//Print Menu Variables
const dishNameHeader = document.getElementById("dishNameHeader") as HTMLElement | null;
const ingredientsOL = document.getElementById("ingredientsOL") as HTMLElement | null;
const instructionsOL = document.getElementById("instructionsOL") as HTMLElement | null;
const modificationsOL = document.getElementById("modificationsOL") as HTMLElement | null;

//Edit Menu Variables 
const activeRecipeHTML = document.getElementById("activeRecipeHTML") as HTMLElement | null;
const activeElement = document.getElementById("activeElement") as HTMLElement | null;
let activeList: string[];
let listLength: number;
const activeMode = document.getElementById("activeMode") as HTMLElement | null;
let activeModeString: string;
const activeListElement = document.getElementById("activeList") as HTMLElement | null;


function initializeMenuTransportButtons() {
	const printRecipe = document.querySelector("#printRecipe") as HTMLInputElement | null;

	if (printRecipe !== null) {
		printRecipe.addEventListener("click", (e) => {
			e.preventDefault();
			loadPrintMenu();
		});
	}

	const editRecipe = document.querySelector("#editRecipe") as HTMLInputElement | null;

	if (editRecipe !== null) {
		editRecipe.addEventListener("click", (e) => {
			e.preventDefault();
			loadEditMenu();
		});
	}

	const returnToMain = document.querySelector("#mainMenu") as HTMLInputElement | null;

	if (returnToMain !== null) {
		returnToMain.addEventListener("click", (e) => {
			e.preventDefault();
			loadMainMenu();
		});
	}
}

function initializeMainMenuButtons() {
	const listRecipes = document.querySelector("#listRecipes") as HTMLInputElement | null;

	if (listRecipes !== null) {
		listRecipes.addEventListener("click", async () => {
			alert("List of Recipes:\n" + RM.printRecipeList(await recipeListPromise));
		});
	}

	const addRecipe = document.querySelector("#addRecipe") as HTMLInputElement | null;

	if (addRecipe !== null) {
		addRecipe.addEventListener("click", async (e) => {
			e.preventDefault();
			let dishNameInput: string;// = await prompt().trim();
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

	const copyRecipe = document.querySelector("#copyRecipe") as HTMLInputElement | null;

	if (copyRecipe !== null) {
		copyRecipe.addEventListener("click", () => {
			if (activeRecipe === null) {
				alert("No active recipe");
			}
			else {
				alert(`${activeRecipe.dishName}'s Ingredients\n` +
					RM.printList(activeRecipe.ingredients));
			}
		});
	}

	const deleteRecipe = document.querySelector("#deleteRecipe") as HTMLInputElement | null;

	if (deleteRecipe !== null) {
		deleteRecipe.addEventListener("click", () => {
			if (activeRecipe === null) {
				alert("No active recipe");
				return;
			}
			if (!confirm(`Are you sure you want to delete ${activeRecipe.dishName}?`)) {
				return;
			}
			window.reciMakeAPI.deleteRecipe(activeRecipe);
			recipeListPromise = window.reciMakeAPI.makeRecipeList();
			location.reload();
		});
	}
}

function initializeEditMenuButtons() {
	const renameRecipe = document.querySelector("#renameRecipe") as HTMLFormElement | null;

	if (renameRecipe !== null) {
		renameRecipe.addEventListener("submit", (e) => {
			e.preventDefault()
			const renameInput = document.querySelector("#renameInput") as HTMLInputElement | null;

			if (renameInput !== null) {
				let newDishName: string = renameInput.value.trim();

				if (newDishName === "") {
					alert("Please input a recipe name");
					return;
				}

				newDishName = newDishName.replace(/ /g, "_");

				//remember to check if recipe exists

				activeRecipe.dishName = newDishName;

				if (activeRecipeHTML !== null) {
					activeRecipeHTML.innerHTML = `Active Recipe: ${activeRecipe.dishName}`
				}
			}
		});
	}

	const showIngredients = document.querySelector("#showIngredients") as HTMLButtonElement | null;

	if (showIngredients !== null) {
		showIngredients.addEventListener("click", () => {
			if (activeElement !== null) {
				activeElement.innerHTML = `Ingredients`;
			}
			activeList = activeRecipe.ingredients;
			listLength = activeList.length;
			const numberInput = document.getElementById("numberInput") as HTMLElement | null;
			let numberInput2: HTMLElement | null = null;
			if (activeModeString === "swap") {
				numberInput2 = document.getElementById("numberInput2") as HTMLElement | null;
			}

			if (numberInput !== null) {
				if (addForm !== null &&
					((activeModeString === "swap" && listLength <= 1) || (activeModeString !== "swap" && listLength <= 0))) {
					addForm.click();
				}
				if (addForm === null) {
					alert("Something went wrong; please exit the app and contact the developers");
					return
				}

				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}

			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeOrderedHTMLList(activeList);
			}
		})
	}

	const showInstructions = document.querySelector("#showInstructions") as HTMLButtonElement | null;

	if (showInstructions !== null) {
		showInstructions.addEventListener("click", () => {
			if (activeElement !== null) {
				activeElement.innerHTML = `Instructions`;
			}
			activeList = activeRecipe.instructions;
			listLength = activeList.length;
			const numberInput = document.getElementById("numberInput") as HTMLElement | null;
			let numberInput2: HTMLElement | null = null;
			if (activeModeString === "swap") {
				numberInput2 = document.getElementById("numberInput2") as HTMLElement | null;
			}

			if (numberInput !== null) {
				if (addForm !== null &&
					((activeModeString === "swap" && listLength <= 1) || (activeModeString !== "swap" && listLength <= 0))) {
					addForm.click();
				}
				if (addForm === null) {
					alert("Something went wrong; please exit the app and contact the developers");
					return
				}


				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}
			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeOrderedHTMLList(activeList);
			}
		})
	}

	const showModifications = document.querySelector("#showModifications") as HTMLButtonElement | null;

	if (showModifications !== null) {
		showModifications.addEventListener("click", () => {
			if (activeElement !== null) {
				activeElement.innerHTML = `Modifications`;
			}
			activeList = activeRecipe.modifications;
			listLength = activeList.length;
			const numberInput = document.getElementById("numberInput") as HTMLElement | null;
			let numberInput2: HTMLElement | null = null;
			if (activeModeString === "swap") {
				numberInput2 = document.getElementById("numberInput2") as HTMLElement | null;
			}

			if (numberInput !== null) {
				if (addForm !== null &&
					((activeModeString === "swap" && listLength <= 1) || (activeModeString !== "swap" && listLength <= 0))) {
					addForm.click();
				}
				if (addForm === null) {
					alert("Something went wrong; please exit the app and contact the developers");
					return
				}
				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}

			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeOrderedHTMLList(activeList);
			}
		})
	}

	const addForm = document.querySelector("#add") as HTMLButtonElement | null;

	if (addForm !== null) {
		addForm.addEventListener("click", () => {
			console.log("Rendering add form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="inputAddText">
					<textarea id="addText" name="addText" placeholder="Add Text" rows="5" cols="50" required></textarea>
					<input type ="submit" value="Add">
				</form>`
				activeModeString = "add";
			}
		})
	}

	const editForm = document.querySelector("#edit") as HTMLButtonElement | null;

	if (editForm !== null) {
		editForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to edit");
				return;
			}
			console.log("Rendering edit form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="inputEditFields">
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<textarea id="editText" name="editText" placeholder="Edit Text" rows="5" cols="50" required></textarea>
					<input type ="submit" value="Edit">
				</form>`
				activeModeString = "edit";
			}
			const numberInputEdit = document.getElementById("numberInput") as HTMLElement | null;
			if (numberInputEdit !== null) {
				numberInputEdit.setAttribute("max", `${listLength}`);
			}
		})
	}

	const shiftForm = document.querySelector("#shift") as HTMLButtonElement | null;

	if (shiftForm !== null) {
		shiftForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to shift");
				return;
			}
			console.log("Rendering shift form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="chooseNumberShift">
					<p>Shift Location</p>
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<input type="submit" value="Shift">
				</form>`
				activeModeString = "shift";
			}
			const numberInputShift = document.getElementById("numberInput") as HTMLElement | null;
			if (numberInputShift !== null) {
				numberInputShift.setAttribute("max", `${listLength}`);
			}
		})
	}

	const swapForm = document.querySelector("#swap") as HTMLButtonElement | null;

	if (swapForm !== null) {
		swapForm.addEventListener("click", () => {
			if (listLength <= 1) {
				alert("Nothing to swap");
				return;
			}
			console.log("Rendering swap form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="chooseNumberSwap">
					<p>Swap Index 1</p>
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<p>Swap Index 2</p>
					<input id="numberInput2" type="number" min="1" max="*listLength*" required/>
					<input type="submit" value="Swap">
				</form>`
				activeModeString = "swap";
			}
			const numberInputSwap = document.getElementById("numberInput") as HTMLElement | null;
			const numberInput2Swap = document.getElementById("numberInput2") as HTMLElement | null;
			if (numberInputSwap !== null && numberInput2Swap !== null) {
				numberInputSwap.setAttribute("max", `${listLength}`);
				numberInput2Swap.setAttribute("max", `${listLength}`);
			}
		})
	}

	const deleteForm = document.querySelector("#delete") as HTMLButtonElement | null;

	if (deleteForm !== null) {
		deleteForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to delete");
				return;
			}
			console.log("Rendering delete form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="chooseNumberDelete">
					<p>Delete Location</p>
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<input type="submit" value="Delete">
				</form>`
				activeModeString = "delete";
			}
			const numberInputDelete = document.getElementById("numberInput") as HTMLElement | null;
			if (numberInputDelete !== null) {
				numberInputDelete.setAttribute("max", `${listLength}`);
			}
		})
	}
}

loadMainMenu()
