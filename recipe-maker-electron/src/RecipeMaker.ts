import Recipe from "./Recipe";

/**
 * Makes sure that the chosen recipe exists or is in the recipe list before progressing further
 * @param recipeList 
 * @param dishName 
 * @returns true if recipe is in list; false if it is not
 */
export function checkRecipeExists(recipeList: string[], dishName: string): boolean {
    let size: number = recipeList.length;

    for (let i = 0; i < size; i++) {
        if (dishName.toLowerCase() == recipeList[i]) {
            return true;
        }
    }
    
    return false;
}