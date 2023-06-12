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

//General Menu Variables
const body: HTMLBodyElement = document.getElementsByTagName("body").item(0);
let activeMenu: string;
//Resolved Promises are immutable; don't try to use a normal array for recipeList
//Only make a recipeList once per session
let recipeListPromise: Promise<Recipe[]> = window.reciMakeAPI.makeRecipeList();
let activeRecipe: Recipe = null;

//Print Menu Variables
let dishNameHeader = document.getElementById("dishNameHeader") as HTMLElement | null;
let ingredientsOL = document.getElementById("ingredientsOL") as HTMLElement | null;
let instructionsOL = document.getElementById("instructionsOL") as HTMLElement | null;
let modificationsOL = document.getElementById("modificationsOL") as HTMLElement | null;

//Edit Menu Variables 
let activeRecipeHTML = document.getElementById("activeRecipeHTML") as HTMLElement | null;
let activeElement = document.getElementById("activeElement") as HTMLElement | null;
let activeElementString: string;
let activeList: string[];
let listLength: number;
let activeMode = document.getElementById("activeMode") as HTMLElement | null;
let activeModeString: string;
let activeListElement = document.getElementById("activeList") as HTMLElement | null;

//Save Function
async function saveRecipeFunction(): Promise<void> {
	if (activeRecipe === null) {
		alert("No active recipe");
		window.reciMakeAPI.focusFix();
		return;
	}

	let index: number = RM.checkRecipeExists(await recipeListPromise, activeRecipe.dishName);

	recipeListPromise.then(
		(list) => {
			list[index] = activeRecipe;
		}
	)

	window.reciMakeAPI.writeRecipe(activeRecipe);
}


//Menu Loading Functions
async function loadMainMenu(): Promise<void> {
	if (activeMenu === "edit") {
		saveRecipeFunction();
	}

	body.innerHTML = await Templates.mainMenu;
	initializeMenuTransportButtons();
	initializeMainMenuButtons();

	if (activeRecipe !== null) {
		document.getElementById("activeRecipe").innerHTML = `Active Recipe: ${activeRecipe.dishName}`;
	}
	else {
		document.getElementById("activeRecipe").innerHTML = `Active Recipe: N/A`;
	}

	recipeListPromise.then(
		(list) => {
			document.getElementById("recipeList").innerHTML = RM.makeRecipeHTMLList(list);
		}
	);

	activeMenu = "main";
}

async function loadPrintMenu(): Promise<void> {
	if (activeRecipe === null) {
		alert("No active recipe");
		window.reciMakeAPI.focusFix();
		return;
	}

	if (activeMenu === "edit") {
		saveRecipeFunction();
	}

	body.innerHTML = await Templates.printMenu;
	initializeMenuTransportButtons();
	initializePrintMenuVariables();

	if (dishNameHeader !== null) {
		dishNameHeader.innerHTML = activeRecipe.dishName;
	}

	if (ingredientsOL !== null) {
		ingredientsOL.innerHTML = RM.makeStringHTMLList(activeRecipe.ingredients);
	}

	if (instructionsOL !== null) {
		instructionsOL.innerHTML = RM.makeStringHTMLList(activeRecipe.instructions);
	}

	if (modificationsOL !== null) {
		modificationsOL.innerHTML = RM.makeStringHTMLList(activeRecipe.modifications);
	}

	activeMenu = "print";
}

async function loadEditMenu(): Promise<void> {
	if (activeRecipe === null) {
		alert("No active recipe");
		window.reciMakeAPI.focusFix();
		return;
	}

	body.innerHTML = await Templates.editMenu;
	initializeMenuTransportButtons();
	initializeEditMenuVariables();
	initializeEditMenuButtons();

	if (activeRecipeHTML !== null) {
		activeRecipeHTML.innerHTML = `Active Recipe: ${activeRecipe.dishName}`
	}

	//Default List and Mode
	activeList = activeRecipe.ingredients;
	activeElementString = "ingredients";
	listLength = activeList.length;
	activeModeString = "add";

	if (activeListElement !== null) {
		activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
	}

	activeMenu = "edit"
}

//Initialize Variable and Button Functions
function initializePrintMenuVariables() {
	dishNameHeader = document.getElementById("dishNameHeader") as HTMLElement | null;
	ingredientsOL = document.getElementById("ingredientsOL") as HTMLElement | null;
	instructionsOL = document.getElementById("instructionsOL") as HTMLElement | null;
	modificationsOL = document.getElementById("modificationsOL") as HTMLElement | null;
}


function initializeEditMenuVariables() {
	activeRecipeHTML = document.getElementById("activeRecipeHTML") as HTMLElement | null;
	activeElement = document.getElementById("activeElement") as HTMLElement | null;
	activeMode = document.getElementById("activeMode") as HTMLElement | null;
	activeListElement = document.getElementById("activeList") as HTMLElement | null;
}

function initializeMenuTransportButtons() {
	const printRecipe = document.querySelector("#printRecipe") as HTMLInputElement | null;

	if (printRecipe !== null) {
		printRecipe.addEventListener("click", () => {
			loadPrintMenu();
		});
	}

	const editRecipe = document.querySelector("#editRecipe") as HTMLInputElement | null;

	if (editRecipe !== null) {
		editRecipe.addEventListener("click", () => {
			loadEditMenu();
		});
	}

	const returnToMain = document.querySelector("#mainMenu") as HTMLInputElement | null;

	if (returnToMain !== null) {
		returnToMain.addEventListener("click", () => {
			loadMainMenu();
		});
	}
}

function initializeMainMenuButtons() {
	/*
	const listRecipes = document.querySelector("#listRecipes") as HTMLInputElement | null;

	if (listRecipes !== null) {
		listRecipes.addEventListener("click", async () => {
			alert("List of Recipes:\n" + RM.printRecipeList(await recipeListPromise));
            ipcRenderer.send('focus-fix');
		window.reciMakeAPI.focusFix();
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
            ipcRenderer.send('focus-fix');
		window.reciMakeAPI.focusFix();
				return;
			}
			if (RM.checkRecipeExists(await recipeListPromise, dishNameInput)) {
				alert("Recipe already exists.");
            ipcRenderer.send('focus-fix');
		window.reciMakeAPI.focusFix();
				return;
			}
			activeRecipe = new Recipe(dishNameInput, [], [], []);
			window.reciMakeAPI.writeRecipe(activeRecipe);
			recipeListPromise = window.reciMakeAPI.makeRecipeList();
		});
	}
	*/

	const getRecipe = document.querySelector("#getRecipe") as HTMLFormElement | null;

	if (getRecipe !== null) {
		getRecipe.addEventListener("submit", async (e) => {
			e.preventDefault();
			//Problem: Method returning as an any Object, instead of a Recipe Object
			//Solution (as of 5/23/23): Take the any Object and make the Recipe object in this function
			//with the fields of that object
			//NOTE: THIS APPLIES FOR BASICALLY ANY FUNCTION THAT USES Recipe AS AN ARGUMENT
			let activeRecipeAny: any = await RM.readRecipe(await recipeListPromise);

			if (activeRecipeAny !== null) {
				activeRecipe = new Recipe(activeRecipeAny._dishName, activeRecipeAny._ingredients,
					activeRecipeAny._instructions, activeRecipeAny._modifications);
				console.log(activeRecipe);
				loadMainMenu();
			}
		});
	}

	const copyRecipe = document.querySelector("#copyRecipe") as HTMLInputElement | null;

	if (copyRecipe !== null) {
		copyRecipe.addEventListener("click", async () => {
			if (activeRecipe === null) {
				alert("No active recipe");
				window.reciMakeAPI.focusFix();
				return;
			}
			let copyName: string = activeRecipe.dishName.concat("-copy");
			if (RM.checkRecipeExists(await recipeListPromise, copyName) !== -1) {
				return;
			}
			let copiedRecipe: Recipe = new Recipe(copyName, activeRecipe.ingredients,
				activeRecipe.instructions, activeRecipe.modifications);
			window.reciMakeAPI.writeRecipe(copiedRecipe);
			recipeListPromise.then(
				(list) => {
					list.push(copiedRecipe);
				}
			);
			if (confirm("Make copied recipe the active recipe?")) {
				activeRecipe = copiedRecipe;
				window.reciMakeAPI.focusFix();
			}
			loadMainMenu();
		});
	}

	const deleteRecipe = document.querySelector("#deleteRecipe") as HTMLInputElement | null;

	if (deleteRecipe !== null) {
		deleteRecipe.addEventListener("click", async () => {
			if (activeRecipe === null) {
				alert("No active recipe");
				window.reciMakeAPI.focusFix();
				return;
			}

			if (!confirm(`Are you sure you want to delete ${activeRecipe.dishName}?`)) {
				window.reciMakeAPI.focusFix();
				return;
			}
			window.reciMakeAPI.focusFix();

			let index: number = RM.checkRecipeExists(await recipeListPromise, activeRecipe.dishName);

			recipeListPromise.then(
				(list) => {
					list.splice(index, 1);
				}
			);

			window.reciMakeAPI.deleteRecipe(activeRecipe);
			activeRecipe = null;
			loadMainMenu();
		});
	}
}

function initializeEditMenuButtons() {
	const getRecipe = document.querySelector("#getRecipe") as HTMLFormElement | null;

	if (getRecipe !== null) {
		getRecipe.addEventListener("submit", async (e) => {
			e.preventDefault();
			//Problem: Method returning as an any Object, instead of a Recipe Object
			//Solution (as of 5/23/23): Take the any Object and make the Recipe object in this function
			//with the fields of that object
			//NOTE: THIS APPLIES FOR BASICALLY ANY FUNCTION THAT USES Recipe AS AN ARGUMENT
			let activeRecipeAny: any = await RM.readRecipe(await recipeListPromise);

			if (activeRecipeAny !== null) {
				activeRecipe = new Recipe(activeRecipeAny._dishName, activeRecipeAny._ingredients,
					activeRecipeAny._instructions, activeRecipeAny._modifications);
				console.log(activeRecipe);
				loadEditMenu();
			}
		});
	}

	const renameRecipe = document.querySelector("#renameRecipe") as HTMLFormElement | null;

	if (renameRecipe !== null) {
		renameRecipe.addEventListener("submit", async (e) => {
			e.preventDefault()
			const renameInput = document.querySelector("#renameInput") as HTMLInputElement | null;

			if (renameInput !== null) {
				let newDishName: string = renameInput.value.trim();

				if (newDishName === "") {
					alert("Please input a recipe name");
					window.reciMakeAPI.focusFix();
					return;
				}

				newDishName = newDishName.replace(/ /g, "_");

				if (RM.checkRecipeExists(await recipeListPromise, newDishName) !== -1) {
					alert("This recipe name is currently in use");
					window.reciMakeAPI.focusFix();
					return;
				}

				window.reciMakeAPI.deleteRecipe(activeRecipe);
				let oldDishName: string = activeRecipe.dishName;
				activeRecipe.dishName = newDishName;
				let index: number = RM.checkRecipeExists(await recipeListPromise, oldDishName);
				recipeListPromise.then(
					(list) => {
						list[index].dishName = newDishName;
					}
				);

				window.reciMakeAPI.writeRecipe(activeRecipe);

				if (activeRecipeHTML !== null) {
					activeRecipeHTML.innerHTML = `Active Recipe: ${activeRecipe.dishName}`
				}
			}
		});
	}

	const saveRecipe = document.querySelector("#saveRecipe") as HTMLButtonElement | null

	if (saveRecipe !== null) {
		saveRecipe.addEventListener("click", saveRecipeFunction);
	}

	const showIngredients = document.querySelector("#showIngredients") as HTMLButtonElement | null;

	if (showIngredients !== null) {
		showIngredients.addEventListener("click", () => {
			if (activeElement !== null) {
				activeElement.innerHTML = `Ingredients`;
			}
			activeList = activeRecipe.ingredients;
			activeElementString = "ingredients";
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
					window.reciMakeAPI.focusFix();
					return
				}

				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}

			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
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
			activeElementString = "instructions";
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
					window.reciMakeAPI.focusFix();
					return
				}


				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}
			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
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
			activeElementString = "modifications";
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
					window.reciMakeAPI.focusFix();
					return
				}
				numberInput.setAttribute("max", `${listLength}`);

				if (activeModeString === "swap" && numberInput2 !== null) {
					numberInput2.setAttribute("max", `${listLength}`);
				}

			}

			if (activeListElement !== null) {
				activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
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
			const inputAddText = document.querySelector("#inputAddText") as HTMLFormElement | null;

			if (inputAddText !== null) {
				inputAddText.addEventListener("submit", (e) => {
					e.preventDefault();
					const addText = document.querySelector("#addText") as HTMLInputElement | null;

					if (addText !== null) {
						let newText = addText.value.trim();

						if (newText === "") {
							alert("Nothing was input")
							window.reciMakeAPI.focusFix();
							return;
						}

						activeList.push(newText);
						listLength = activeList.length;

						if (activeListElement !== null) {
							activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
						}

					}

				});
			}
		})
	}



	const editForm = document.querySelector("#edit") as HTMLButtonElement | null;

	if (editForm !== null) {
		editForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to edit");
				window.reciMakeAPI.focusFix();
				return;
			}
			console.log("Rendering edit form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="inputEditFields">
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<input id="overwriteBool" name="overwriteBool" type="checkbox" value="overwrite">
					<label for="overwriteBool">Overwrite?</label><br>
					<p></p>
					<textarea id="editText" name="editText" placeholder="Edit Text (Submit an empty form to get current text)" rows="5" cols="50"></textarea>
					<input type ="submit" value="Edit">
				</form>`
				activeModeString = "edit";
			}

			const numberInputEdit = document.getElementById("numberInput") as HTMLElement | null;
			if (numberInputEdit !== null) {
				numberInputEdit.setAttribute("max", `${listLength}`);
			}

			const inputEditFields = document.querySelector("#inputEditFields") as HTMLFormElement | null;

			if (inputEditFields !== null) {
				inputEditFields.addEventListener("submit", (e) => {
					e.preventDefault();
					const numberInput = document.querySelector("#numberInput") as HTMLInputElement | null;
					const overwriteBool = document.querySelector("#overwriteBool") as HTMLInputElement | null;
					const editText = document.querySelector("#editText") as HTMLInputElement | null;
					const editTextElement = document.getElementById("editText") as HTMLInputElement | null;

					if (numberInput !== null && overwriteBool !== null && editText !== null) {
						let target: number = numberInput.valueAsNumber - 1;
						let overwrite: boolean = overwriteBool.checked;
						let newText: string = editText.value.trim();

						if (newText === "") {
							editTextElement.innerHTML = activeList[target];
							editTextElement.value = editTextElement.innerHTML;
							return;
						}

						if (overwrite) {
							activeList.splice(target, 1, newText);
						}

						else {
							activeList.splice(target, 0, newText);
							listLength = activeList.length;
							if (numberInputEdit !== null) {
								numberInputEdit.setAttribute("max", `${listLength}`);
							}
						}

						if (activeListElement !== null) {
							activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
						}

					}

				});
			}
		})
	}

	const shiftForm = document.querySelector("#shift") as HTMLButtonElement | null;

	if (shiftForm !== null) {
		shiftForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to shift");
				window.reciMakeAPI.focusFix();
				return;
			}
			console.log("Rendering shift form");
			if (activeMode !== null) {
				activeMode.innerHTML =
					`<form id="chooseNumberShift">
					<p>Shift From</p>
					<input id="numberInput" type="number" min="1" max="*listLength*" required/>
					<p>Shift To</p>
					<input id="numberInput2" type="number" min="1" max="*listLength*" required/>
					<input type="submit" value="Shift">
				</form>`
				activeModeString = "shift";
			}
			const numberInputShift = document.getElementById("numberInput") as HTMLElement | null;
			const numberInput2Shift = document.getElementById("numberInput2") as HTMLElement | null;

			if (numberInputShift !== null && numberInput2Shift !== null) {
				numberInputShift.setAttribute("max", `${listLength}`);
				numberInput2Shift.setAttribute("max", `${listLength}`);
			}

			const chooseNumberShift = document.querySelector("#chooseNumberShift") as HTMLFormElement | null;

			if (chooseNumberShift !== null) {
				chooseNumberShift.addEventListener("submit", (e) => {
					e.preventDefault();
					const numberInput = document.querySelector("#numberInput") as HTMLInputElement | null;
					const numberInput2 = document.querySelector("#numberInput2") as HTMLInputElement | null;

					if (numberInput !== null && numberInput2 !== null) {
						let location: number = numberInput.valueAsNumber - 1;
						let target: number = numberInput2.valueAsNumber - 1;

						if (location === target) {
							return;
						}

						let toShift: string = activeList[location];
						activeList.splice(location, 1);
						activeList.splice(target, 0, toShift);

						if (activeListElement !== null) {
							activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
						}

					}

				});
			}
		})
	}

	const swapForm = document.querySelector("#swap") as HTMLButtonElement | null;

	if (swapForm !== null) {
		swapForm.addEventListener("click", () => {
			if (listLength <= 1) {
				alert("Nothing to swap");
				window.reciMakeAPI.focusFix();
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

			const chooseNumberSwap = document.querySelector("#chooseNumberSwap") as HTMLFormElement | null;

			if (chooseNumberSwap !== null) {
				chooseNumberSwap.addEventListener("submit", (e) => {
					e.preventDefault();
					const numberInput = document.querySelector("#numberInput") as HTMLInputElement | null;
					const numberInput2 = document.querySelector("#numberInput2") as HTMLInputElement | null;

					if (numberInput !== null && numberInput2 !== null) {
						let swap1: number = numberInput.valueAsNumber - 1;
						let swap2: number = numberInput2.valueAsNumber - 1;

						if (swap1 === swap2) {
							return;
						}

						let tmp: string = activeList[swap1];
						activeList[swap1] = activeList[swap2]
						activeList[swap2] = tmp;

						if (activeListElement !== null) {
							activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
						}

					}

				});
			}
		})
	}

	const deleteForm = document.querySelector("#delete") as HTMLButtonElement | null;

	if (deleteForm !== null) {
		deleteForm.addEventListener("click", () => {
			if (listLength <= 0) {
				alert("Nothing to delete");
				window.reciMakeAPI.focusFix();
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

			const chooseNumberDelete = document.querySelector("#chooseNumberDelete") as HTMLFormElement | null;

			if (chooseNumberDelete !== null) {
				chooseNumberDelete.addEventListener("submit", (e) => {
					e.preventDefault();
					const numberInput = document.querySelector("#numberInput") as HTMLInputElement | null;

					if (numberInput !== null) {
						let target: number = numberInput.valueAsNumber - 1;

						activeList.splice(target, 1);
						listLength = activeList.length;
						if (numberInputDelete!== null) {
							numberInputDelete.setAttribute("max", `${listLength}`);
						}

						if (activeListElement !== null) {
							activeListElement.innerHTML = RM.makeStringHTMLList(activeList);
						}

					}

				});
			}
		})
	}

	showIngredients.click();
	addForm.click();
}

loadMainMenu();

//If statements if needed; might cause doubling up; put in editButton init function
/*
if (activeElementString === "ingredients") {
	activeRecipe.ingredients.push(newText);
}

if (activeElementString === "instructions") {
	activeRecipe.instructions.push(newText);
}

if (activeElementString === "modifications") {
	activeRecipe.modifications.push(newText);
}
*/
