import Recipe from "./Recipe";

const fs: any = require("fs");

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

export function checkRecipeExists(recipeList: string[], dishName: string): boolean {
    let size: number = recipeList.length;

    for (let i = 0; i < size; i++) {
        if (dishName.toLowerCase() == recipeList[i]) {
            return true;
        }
    }
    
    return false;
}

export function readRecipe(dishName: string): Recipe {
    let filePath: string = "./Recipes/" + dishName.toLowerCase() + ".json";

    let fileCont: any = require(filePath);

    let recipe: Recipe = new Recipe(fileCont._dishName, fileCont._ingredients,
        fileCont._instructions, fileCont._modifications);

    console.log(recipe.fileName + " file read.");
    return recipe;

}

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

