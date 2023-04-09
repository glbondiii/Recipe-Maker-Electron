import Recipe from "./Recipe";

const fs: any = require("fs");

/**
 * Makes a list of existing recipes based on the contents of the Recipe folder; if a Recipe folder does not exist, then the function makes one.
 * @returns recipesList: string[]
 */
export function makeRecipeList(): string[] {
    let recipesList: string[] = [];
    
    let recipesFolder: string = "./Recipes";

    try {
        if (!fs.existsSync(recipesFolder)) {
            fs.mkdir(recipesFolder, (error: any) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Recipes directory created.");
                }
            } );
            return recipesList;
        }
    } 

    catch (error: any) {
        console.log(error);
        return recipesList;
    }

    recipesFolder = "./Recipes/";

    fs.readdirSync(recipesFolder).forEach( (file: any) => {
        let fileSplit: string[] = file.split(".");
        let recipe: string = fileSplit[0].toLowerCase();
        if (fileSplit[1] == "json") {
            recipesList.push(recipe);
            console.log(file + " added to list.");
        }
        else {
            console.log(file + " is not a JSON file.");
        }
    });

    return recipesList;
}

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

/**
 * Reads in a recipe from the corresponding JSON file
 * @param dishName 
 * @returns recipe: Recipe
 */
export function readRecipe(dishName: string): Recipe {
    let filePath: string = "./Recipes/" + dishName.toLowerCase() + ".json";

    let fileCont: any = require(filePath);

    let recipe: Recipe = new Recipe(fileCont._dishName, fileCont._ingredients,
        fileCont._instructions, fileCont._modifications);

    console.log(recipe.fileName + " file read.");
    return recipe;

}

/**
 * Writes a recipe to the corresponding JSON file
 * @param recipe 
 */
export function writeRecipe(recipe: Recipe): void {
    let filePath: string = "./Recipes/" + recipe.dishName + ".json";

    fs.writeFileSync(filePath, JSON.stringify(recipe), (error: any) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(recipe.fileName + " file written to.")
        }
    });

}

