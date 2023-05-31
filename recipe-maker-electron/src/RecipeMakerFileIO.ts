import Recipe from "./Recipe";

const fs: any = require("fs");

/**
 * Makes a list of existing recipes based on the contents of the Recipe folder; if a Recipe folder does not exist, then the function makes one.
 * Only call once per session
 * @returns recipeList: string[]
 */
export function makeRecipeList(): Recipe[] {
    let recipeList: Recipe[] = [];
    
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
            return recipeList;
        }
    } 

    catch (error: any) {
        console.log(error);
        return recipeList;
    }

    recipesFolder = "./Recipes/";

    fs.readdirSync(recipesFolder).forEach( (file: any) => {
        let fileSplit: string[] = file.split(".");
        let recipeName = fileSplit[0].trim();
        if (fileSplit[1] == "json") {
            let recipeAny: any = readRecipe(recipeName);
            let recipe: Recipe = new Recipe(recipeAny._dishName, recipeAny._ingredients, 
                recipeAny._instructions, recipeAny._modifications);
            recipeList.push(recipe);
            console.log(file + " added to list.");
        }
        else {
            console.log(file + " is not a JSON file.");
        }
    });

    return recipeList;
}

/**
 * Reads in a recipe from the corresponding JSON file
 * @param dishName 
 * @returns recipe: Recipe
 */
export function readRecipe(dishName: string): Recipe {

    let lowerCaseDishName: string = dishName.toLowerCase();

    let fileCont: any;

    try {
        fileCont = require(`../Recipes/${lowerCaseDishName}.json`);
    }
    catch (e) {
        console.log("Something went wrong; try resetting the app.");
        return null;
    }

    let recipe: Recipe = new Recipe(fileCont._dishName, fileCont._ingredients,
        fileCont._instructions, fileCont._modifications);

    console.log(recipe.fileName + " file read.");

    return recipe;
}

/**
 * Writes a recipe to the corresponding JSON file
 * @param recipe 
 */
export function writeRecipe(recipe: any): void {
    let filePath: string = `./Recipes/${recipe._dishName}.json`;

    fs.writeFileSync(filePath, JSON.stringify(recipe), (error: any) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log(recipe._fileName + " file written to.")
        }
    });

}

/**
 * Deletes the corresponding JSON file to the parameter recipe
 * @param recipe 
 */
export function deleteRecipe(recipe: any): void {
    let filePath: string = `./Recipes/${recipe._dishName}.json`;

    fs.unlinkSync(filePath, (error: any) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(recipe._fileName + " file deleted");
        }
    })
}

