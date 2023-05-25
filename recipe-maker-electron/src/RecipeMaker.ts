import Recipe from "./Recipe";

//Know the array method splice()

/**
 * Makes sure that the chosen recipe exists or is in the recipe list before progressing further
 * @param recipeList 
 * @param dishName 
 * @returns true if recipe is in list; false if it is not
 */
export function checkRecipeExists(recipeList: string[], dishName: string): boolean {
    let size: number = recipeList.length;

    for (let i = 0; i < size; i++) {
        if (dishName.toLowerCase() === recipeList[i]) {
            return true;
        }
    }
    
    return false;
}

export function printList(recipeList: string[]): string {  
    let listString: string = "";

    let size: number = recipeList.length;

    if (size === 0) {
        return "Nothing to list";
    }

    for (let i = 0; i < size; i++) {
        if (i === size-1) {
            listString = listString.concat(`${i+1}. ${recipeList[i]}`);
        }
        else {
            listString = listString.concat(`${i+1}. ${recipeList[i]}\n`);
        }
    }

    return listString;
}

export async function readRecipe(recipeList: Promise<string[]>): Promise<Recipe> {
    const dishNameInput = document.querySelector("#dishNameInput") as HTMLInputElement | null;

    if (dishNameInput !== null) {
        let dishName: string = dishNameInput.value.trim();

        if (dishName === "") {
            alert("Please input a recipe name.");
            return null;
        }

        if (checkRecipeExists(await recipeList, dishName)) {
            
            return await window.reciMakeAPI.readRecipe(dishName);
        }

        else {
            alert(`${dishName} not found.`);
            return null;
        }
    }
}
