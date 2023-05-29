import Recipe from "./Recipe";

//Know the array method splice()

/**
 * Makes sure that the chosen recipe exists or is in the recipe list before progressing further
 * @param recipeList 
 * @param dishName 
 * @returns 
 *      index of Recipe where the matching dishName was found;
 *      -1 if dishName not found in Recipes in recipeList
 * 
 */
export function checkRecipeExists(recipeList: any[], dishName: string): number {
    let size: number = recipeList.length;

    dishName = dishName.replace("_", "").trim();

    for (let i = 0; i < size; i++) {
        let thisDishName = recipeList[i]._dishName.replace("_", "");
        if (dishName.toLowerCase() === thisDishName) {
            return i;
        }
    }
    
    return -1;
}

/**
 * Turns a Recipe array into a string of a numbered list
 * @param list 
 * @returns listString: string
 */
export function printRecipeList(list: any[]): string {  
    let listString: string = "";

    let size: number = list.length;

    if (size === 0) {
        return "Nothing to list";
    }

    for (let i = 0; i < size; i++) {
        if (i === size-1) {
            listString = listString.concat(`${i+1}. ${list[i]._dishName}`);
        }
        else {
            listString = listString.concat(`${i+1}. ${list[i]._dishName}\n`);
        }
    }

    return listString;
}
/**
 * Turns a string array into a string of a numbered list
 * @param list 
 * @returns listString: string
 */
export function printList(list: string[]): string {  
    let listString: string = "";

    let size: number = list.length;

    if (size === 0) {
        return "Nothing to list";
    }

    for (let i = 0; i < size; i++) {
        if (i === size-1) {
            listString = listString.concat(`${i+1}. ${list[i]}`);
        }
        else {
            listString = listString.concat(`${i+1}. ${list[i]}\n`);
        }
    }

    return listString;
}

/**
 * Reads a recipe from the corresponding JSON file to the submitted dish name
 * @param recipeListPromise 
 * @returns \{
 *      [Promise with a JSON object corresponding to the input recipe name]:
 *      if the input dish name is found in recipeList;
 *      null: if the input dish name is not found in recipeList
 * \}
 */
export async function readRecipe(recipeList: Recipe[]): Promise<Recipe> {
    const dishNameInput = document.querySelector("#dishNameInput") as HTMLInputElement | null;

    if (dishNameInput !== null) {
        let dishName: string = dishNameInput.value.trim();

        if (dishName === "") {
            alert("Please input a recipe name.");
            return null;
        }

        dishName = dishName.replace(/ /g, "_");

        let index = checkRecipeExists(recipeList, dishName);

        if (index !== -1) {
            return recipeList[index];
        }

        else {
            //alert(`${dishName} not found. Would you like to add this recipe?`);
            if(confirm(`${dishName} not found. Would you like to add this recipe?`)) {
                let newRecipe: Recipe = new Recipe(dishName, [], [], []);
                window.reciMakeAPI.writeRecipe(newRecipe);
                recipeList.push(newRecipe);
                return newRecipe;
            }
            else {
                return null;
            }
        }
    }
}
