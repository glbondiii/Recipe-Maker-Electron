
class Recipe {
    //Fields
    private _dishName: string;
    private _fileName: string;
    private _ingredients: string[];
    private _instructions: string[];
    private _modifications: string[];
    
    //Constructor
    public constructor(dishName: string, ingredients: string[], 
        instructions: string[], modifications: string[]) {
		if (dishName.trim() === "") {
			return null;
		}
        this._dishName = dishName.toLowerCase().trim().replace(/ /g, "_");
        this._fileName = "Recipes/" + this._dishName + ".json";
        this._ingredients = ingredients;
        this._instructions = instructions;
        this._modifications = modifications;
    }

    //Getters
    get dishName() {
        return this._dishName;
    }

    get fileName() {
        return this._fileName;
    }

    get ingredients() {
        return this._ingredients;
    }

    get instructions() {
        return this._instructions;
    }

    get modifications() {
        return this._modifications;
    }

    //Setters
    set dishName(newName: string) {
		if (newName.trim() === "") {
			alert("No name input");
			return;
		}
		this._dishName = newName.toLowerCase().trim().replace(/ /g, "_");
        this._fileName = "Recipe/" + this._dishName + ".json";
    }

    set ingredients(newIngredients: string[]) {
        this._ingredients = newIngredients;
    }

    set instructions(newInstructions: string[]) {
        this._instructions = newInstructions;
    }

    set modifications(newModifications: string[]) {
        this._modifications = newModifications;
    }

}

export default Recipe;
