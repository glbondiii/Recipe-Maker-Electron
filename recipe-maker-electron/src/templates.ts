export let mainMenu: string = 
    `
	<h1>Recipe Maker Electron</h1>
    <button id="listRecipes">List Recipes</button>
    <!--
    <p></p>
    <button id="addRecipe">Add Recipe</button>
    -->
    <p></p>
    <form id="readRecipe">
        <input autocomplete="off" autofocus id="dishNameInput" placeholder="Dish Name" type="text" required>
        <input type="submit">
    </form>
    <p id="activeRecipe"></p>
    <button id="copyRecipe">Copy Recipe</button>
    <button id="deleteRecipe">Delete Recipe</button>
	<p></p>
	<button id="printRecipe">Print Recipe</button>
	<button id="editRecipe">Edit Recipe</button>
	`

export let printMenu: string = 
	`
	<h2 id="dishNameHeader"></h2>
	<p></p>
	<h3>Ingredients</h3>
	<ol id="ingredientsOL"></ol>
	<h3>Instructions</h3>
	<div><ol id="instructionsOL"></ol>
	<h3>Modifications</h3>
	<ol id="modificationsOL"></ol>
	<p></p>
	<button id="editRecipe">Edit Recipe</button>
	<button id="mainMenu">Return to Main Menu</button>
	`

export let editMenu: string = 
	`
	<h1>Edit Recipe</h1>
	<h2 id="activeRecipeHTML"></h2>
	<form id="renameRecipe">
		<input autocomplete="off" autofocus id="renameInput" placeholder="Rename Recipe" type="text" required>
		<input type="submit">
	</form>
	<p></p>
	<button id="save">Save Recipe</button>
	<button id="printRecipe">Print Recipe</button>
	<button id="mainMenu">Return to Main Menu</button>
	<p></p>
	<button id="showIngredients">Ingredients</button>
	<button id="showInstructions">Instructions</button>
	<button id="showModifications">Modifications</button>
	<p></p>
	<p id="activeElement"><p>
	<p></p>
	<button id="add">Add</button>
	<button id="edit">Edit</button>
	<button id="shift">Shift</button>
	<button id="swap">Swap</button>
	<button id="delete">Delete</button>
	<p></p>
	<div id="activeMode">
		<form id="inputAddText"></form>
	</div>
	<ol id="activeList"></ol>
	`

