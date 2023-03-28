import java.util.Scanner;
import java.util.ArrayList;
import java.io.*;

public class RecipeMaker {
    
    private Scanner keyboard;
    private final String D0NE = "D0NE";
    private final String PR1NT = "PR1NT";
    private final String ADD = "ADD";
    private final String EDIT = "EDIT";
    private final String REMOVE = "REMOVE";
    private final String REMOVEALL = "REMOVEALL";
    private final String REMOVECOPIES = "REMOVECOPIES";
    private final String TEXT = "TEXT";
    private final String MOVE = "MOVE";
    private final String SWAP = "SWAP";
    private final String R3TURN = "R3TURN";
    private final String INPUTERRORMESSAGE = "Not a valid input. Please try again.\n";

    public RecipeMaker() {
        /* 
        ArrayList<String> recipeList = new ArrayList<String>();
        String dishName;
        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();
        */
        keyboard = new Scanner(System.in);
    }

    public void makeRecipeList(ArrayList<String> recipeList) throws IOException {
        File folder = new File("Recipes").getAbsoluteFile();

        if (!folder.exists()) {
            System.out.println("Recipes directory not found.");
            System.out.println("Respond YES if you would like the program to make a Recipes directory for you.");
            System.out.println("N.B IF A RECIPES FOLDER DOES EXIST IN THIS DIRECTORY, IT WILL BE OVERWRITTEN IF YOU RESPOND YES!");
            System.out.print("Respond here: ");
            String response = keyboard.nextLine();
            if (response.equalsIgnoreCase("YES")) {
                try {
                    if (folder.mkdir()) {
                        System.out.println("Recipes directory created.");
                    }
                    else {
                        System.out.println("Failed to create Recipes directory.");
                    }
                } 
                catch (Exception e) {
                    e.printStackTrace();
                }  

                return;
            }

            else {
                System.out.println("Program closing");
                return;
            }
        }

        File[] listOfFolders = folder.listFiles();

        for (File recipe: listOfFolders) {
            if (recipe.isDirectory()) {
                File ingredients = new File(recipe.getPath() + "/ingredients.txt");
                File instructions = new File(recipe.getPath() + "/instructions.txt");
                File modifications = new File(recipe.getPath() + "/modifications.txt");

                if (ingredients.exists() && instructions.exists() && modifications.exists()) {
                    recipeList.add(recipe.getName().toLowerCase());
                }

                else {
                    System.out.printf("%s is either not a recipe or "
                    + "has no or incorrectly named .txt files. "
                  + "Please check folder in File Explorer.\n", recipe.getPath());
                }
            }

            else {
                System.out.printf("%s does not belong in the Recipes folder. "
                + "Please check folder in File Explorer.\n", recipe.getPath());
            }
        }
    }

    public boolean checkRecipeExists(ArrayList<String> recipeList, String dishName) {
        int size = recipeList.size();

        for (int i = 0; i < size; i++) {
            if (dishName.equalsIgnoreCase(recipeList.get(i))) {
                return true;
            }
        }

        return false;
    }

    public String getDishName(String userMessage) {
        String dishName;
        boolean userApproves = false;

        do {

            System.out.print(userMessage);
            dishName = keyboard.nextLine().toLowerCase();

            dishName = dishName.replace(" ", "_");

            System.out.printf("Your dish name is %s\n. Respond \"YES\" if this is okay. ", dishName);

            if (keyboard.nextLine().equalsIgnoreCase("YES")) {
                userApproves = true;
            }

        } while (!userApproves);

        return dishName;

    }

    public void readRecipe(Recipe myRecipe) throws IOException {      
        readIngredients(myRecipe.getingredients(), myRecipe.getingredientsFile());
        readInstructions(myRecipe.getinstructions(), myRecipe.getinstructionsFile());
        readModifications(myRecipe.getmodifications(), myRecipe.getmodificationsFile());
    }

    public void readIngredients(ArrayList<String> ingredients, String ingredientsFile) throws IOException {
        File file = new File(ingredientsFile);
        Scanner inputFile = new Scanner(file);

        while (inputFile.hasNext()) {
            ingredients.add(inputFile.nextLine());
        }

        inputFile.close();
    }
    
    public void readInstructions(ArrayList<String> instructions, String instructionsFile) throws IOException {
        File file = new File(instructionsFile);
        Scanner inputFile = new Scanner(file);

        while (inputFile.hasNext()) {
            instructions.add(inputFile.nextLine());
        }

        inputFile.close();
    }

    public void readModifications(ArrayList<String> modifications, String modificationsFile) throws IOException {
        File file = new File(modificationsFile);
        Scanner inputFile = new Scanner(file);

        while (inputFile.hasNext()) {
            modifications.add(inputFile.nextLine());
        }

        inputFile.close(); 
    }

    public void writeRecipe(Recipe myRecipe) throws IOException {        
        writeIngredients(myRecipe.getingredients(), myRecipe.getingredientsFile());
        writeInstructions(myRecipe.getinstructions(), myRecipe.getinstructionsFile());
        writeModifications(myRecipe.getmodifications(), myRecipe.getmodificationsFile());
    }

    public void writeIngredients(ArrayList<String> ingredients, String ingredientsFile) throws IOException {
        FileWriter fWriter = new FileWriter(ingredientsFile, false);
        PrintWriter outputFile = new PrintWriter(fWriter);

        int size = ingredients.size(); 

        for (int i = 0; i < size; i++) {
            outputFile.println(ingredients.get(i));
        }

        outputFile.close();

        System.out.println("Ingredients File Updated.");
    }
    
    public void writeInstructions(ArrayList<String> instructions, String instructionsFile) throws IOException {
        FileWriter fWriter = new FileWriter(instructionsFile, false);
        PrintWriter outputFile = new PrintWriter(fWriter);

        int size = instructions.size(); 

        for (int i = 0; i < size; i++) {
            outputFile.println(instructions.get(i));
        }

        outputFile.close();

        System.out.println("Instructions File Updated.");
    }

    public void writeModifications(ArrayList<String> modifications, String modificationsFile) throws IOException {
        FileWriter fWriter = new FileWriter(modificationsFile, false);
        PrintWriter outputFile = new PrintWriter(fWriter);

        int size = modifications.size(); 

        for (int i = 0; i < size; i++) {
            outputFile.println(modifications.get(i));
        }

        outputFile.close();

        System.out.println("Modifications File Updated."); 
    }

    public void createRecipe(ArrayList<String> recipeList) throws IOException {
        String dishName;
        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();

        dishName = getDishName("What do you want to call your dish? ");

        if (checkRecipeExists(recipeList, dishName)) {
            System.out.println("This dish already exists. Please edit or delete the current recipe.");
            return;
        }

        newIngredientsList(ingredients);
        newInstructionsList(instructions);
        newModificationsList(modifications);

        Recipe newRecipe = new Recipe(dishName, ingredients, instructions, modifications);
        writeRecipe(newRecipe);
        recipeList.add(dishName);
        
        System.out.println("Your New Recipe: ");
        newRecipe.printRecipe();

    }

    public void newIngredientsList(ArrayList<String> ingredients) {
        boolean userDone = false;
        int i = 1;
        String ingredient;

        System.out.println("List your ingredients here.");
        System.out.println("Respond \"PR1NT\" to see all current ingredients.");
        System.out.println("Respond \"D0NE\" (with a zero, not an O) when you are done listing.");

        do {
            System.out.printf("%d. ", i);
            ingredient = keyboard.nextLine();

            if (ingredient.equals(D0NE)) {
                System.out.print("Are you done? (Respond YES if so) ");

                if (keyboard.nextLine().equalsIgnoreCase("YES")) {
                    userDone = true;
                }
                
            }

            else if (ingredient.equals(PR1NT)) {
                System.out.println("Current Ingredients: ");
                printList(ingredients);
            }
            
            else {
                ingredients.add(ingredient);
                i++;
            }


        } while (!userDone);

    }

    public void newInstructionsList(ArrayList<String> instructions) {
        boolean userDone = false;
        int i = 1;
        String instruction;

        System.out.println("List your instructions here.");
        System.out.println("Respond \"PR1NT\" to see all current instructions.");
        System.out.println("Respond \"D0NE\" (with a zero, not an O) when you are done listing.");

        do {
            System.out.printf("%d. ", i);
            instruction = keyboard.nextLine();

            if (instruction.equals(D0NE)) {
                System.out.print("Are you done? (Respond YES if so) ");

                if (keyboard.nextLine().equalsIgnoreCase("YES")) {
                    userDone = true;
                }
                
            }
            
            else if (instruction.equals(PR1NT)) {
                System.out.println("Current Instructions: ");
                printList(instructions);
            }

            else {
                instructions.add(i + ". " + instruction);
                i++;
            }

        } while (!userDone);
        
    }

    public void newModificationsList(ArrayList<String> modifications) {
        boolean userDone = false;
        int i = 1;
        String modification;

        System.out.println("List your modifications here.");
        System.out.println("Respond \"PR1NT\" to see all current modifications.");
        System.out.println("Respond \"D0NE\" (with a zero, not an O) when you are done listing.");

        do {
            System.out.printf("%d. ", i);
            modification = keyboard.nextLine();

            if (modification.equals(D0NE)) {
                System.out.print("Are you done? (Respond YES if so) ");

                if (keyboard.nextLine().equalsIgnoreCase("YES")) {
                    userDone = true;
                }
                
            }

            else if (modification.equals(PR1NT)) {
                System.out.println("Current Modifications: ");
                printList(modifications);
            }
            
            else {
                modifications.add(modification);
                i++;
            }

        } while (!userDone);

    }

    public void copyRecipe(ArrayList<String> recipeList) throws IOException {
        String dishName = getDishName("What recipe do you want to copy? ");

        if (!checkRecipeExists(recipeList, dishName)) {
            System.out.println("Recipe not found.");
            return;
        }

        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();

        Recipe myRecipe = new Recipe(dishName, ingredients, instructions, modifications);
        readRecipe(myRecipe);

        String copyName = getDishName("What do you want to name your copy? ");

        if (checkRecipeExists(recipeList, copyName)) {
            System.out.println("This name already belongs to another recipe.");
            return;
        }

        Recipe copyRecipe = new Recipe(copyName, myRecipe.getingredients(), myRecipe.getinstructions(), myRecipe.getmodifications());
        writeRecipe(copyRecipe);
        recipeList.add(copyName);

        System.out.println("Your Copied Recipe: ");
        copyRecipe.printRecipe();

    }

    public void printRecipe(ArrayList<String> recipeList) throws IOException {
        String dishName = getDishName("What recipe do you want to print? ");

        if (!checkRecipeExists(recipeList, dishName)) {
            System.out.println("Recipe not found.");
            return;
        }

        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();

        Recipe myRecipe = new Recipe(dishName, ingredients, instructions, modifications);
        readRecipe(myRecipe);

        myRecipe.printRecipe();

    }

    public void listRecipes(ArrayList<String> recipeList) {
        int size = recipeList.size();

        System.out.println("Recipe List: ");
        for (int i = 0; i < size; i++) {
            System.out.println(recipeList.get(i));
        }
    }

    public void updateRecipe(ArrayList<String> recipeList) throws IOException {
        String action;
        String target;
        boolean userDone = false;
        String dishName = getDishName("What recipe do you want to update? ");

        if (!checkRecipeExists(recipeList, dishName)) {
            System.out.println("Recipe not found.");
            return;
        }

        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();

        Recipe myRecipe = new Recipe(dishName, ingredients, instructions, modifications);
        readRecipe(myRecipe);

        do {
            System.out.println();
            System.out.printf("Current Recipe: %s\n", myRecipe.getdishName());
            System.out.println("You can update in three ways: ");
            System.out.println("ADD = Add elements to list");
            System.out.println("EDIT = Edit list elements or recipe name");
            System.out.println("REMOVE = Remove elements from list");

            System.out.println("Enter \"PR1NT\" to see current status of recipe.");
            System.out.println("Enter \"D0NE\" (with a zero, not an O) when you have finished updating.");

            System.out.print("Enter the command of the update you want to do: ");
            action = keyboard.nextLine();

            if (action.equalsIgnoreCase(ADD)) {
                System.out.println("Do you want to add to the ingredients, instructions, or modifications? ");
                System.out.print("Respond here: ");
                target = keyboard.nextLine();

                if (target.equalsIgnoreCase("ingredients")) {
                    addToIngredientsList(myRecipe.getingredients(), myRecipe.getingredientsFile());
                }

                else if (target.equalsIgnoreCase("instructions")) {
                    addToInstructionsList(myRecipe.getinstructions(), myRecipe.getinstructionsFile());
                }

                else if (target.equalsIgnoreCase("modifications")) {
                    addToModificationsList(myRecipe.getmodifications(), myRecipe.getmodificationsFile());
                }

                else {
                    System.out.println("Not a valid option. Please reread request.");
                }
            }

            else if (action.equalsIgnoreCase(EDIT)) {
                System.out.println("Do you want to edit the ingredients, the instructions, the modifications, or the recipe name? ");
                System.out.print("Respond here: ");
                target = keyboard.nextLine();

                if (target.equalsIgnoreCase("ingredients")) {
                    editIngredientsList(myRecipe.getingredients(), myRecipe.getingredientsFile());
                }

                else if (target.equalsIgnoreCase("instructions")) {
                    editInstructionsList(myRecipe.getinstructions(), myRecipe.getinstructionsFile());
                }

                else if (target.equalsIgnoreCase("modifications")) {
                    editModificationsList(myRecipe.getmodifications(), myRecipe.getmodificationsFile());
                }

                else if (target.equalsIgnoreCase("recipe name") || target.equalsIgnoreCase("recipename")) {
                    editRecipeName(myRecipe, recipeList);
                }

                else {
                    System.out.println("Not a valid option. Please reread request.");
                }
            }

            else if (action.equalsIgnoreCase(REMOVE)) {
                System.out.println("Do you want to remove from the ingredients, instructions, or modifications? ");
                System.out.print("Respond here: ");
                target = keyboard.nextLine();

                if (target.equalsIgnoreCase("ingredients")) {
                    removeFromIngredientsList(myRecipe.getingredients(), myRecipe.getingredientsFile());
                }

                else if (target.equalsIgnoreCase("instructions")) {
                    removeFromInstructionsList(myRecipe.getinstructions(), myRecipe.getinstructionsFile());
                }

                else if (target.equalsIgnoreCase("modifications")) {
                    removeFromModificationsList(myRecipe.getmodifications(), myRecipe.getmodificationsFile());
                }

                else {
                    System.out.println("Not a valid option. Please reread request.");
                }
            }

            else if (action.equals(PR1NT)) {
                myRecipe.printRecipe();
                continuePrompt();
            }

            else if (action.equals(D0NE)) {
                System.out.print("Are you done updating your recipe? (Respond YES if so) ");

                if (keyboard.nextLine().equalsIgnoreCase("YES")) {
                    userDone = true;
                }
            }

            else {
                System.out.println("Not a valid option. Please reread command list.");
            }

        } while (!userDone);
    }

    public void formatInstructions(ArrayList<String> instructions) {
        int size = instructions.size();
        
        for (int i = 0; i < size; i++) {
            String[] splitString = instructions.get(i).split(" ", 2);

            String instructionText = splitString[1];

            String instruction = String.format("%d. %s", i+1, instructionText);
            instructions.set(i, instruction);
        }
    }

    public void addToIngredientsList(ArrayList<String> ingredients, String ingredientsFile) throws IOException {
        String ingredientAdd;

        System.out.println("Current Ingredient List: ");
        printList(ingredients);

        System.out.print("What ingredient do you want to add? ");
        System.out.println("Respond \"R3TURN\" to return to the update menu.");
        System.out.print("Respond here: ");
            
        ingredientAdd = keyboard.nextLine();   

        if (ingredientAdd.equals(R3TURN)) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }
        

        for (String ingredient: ingredients) {
            if (ingredientAdd.equalsIgnoreCase(ingredient)) {
                System.out.println("This ingredient is already in this recipe.");
                continuePrompt();
                return;
            }
        }
        
        ingredients.add(ingredientAdd);
        writeIngredients(ingredients, ingredientsFile);
        System.out.println("New Ingredient List: ");
        printList(ingredients);
        continuePrompt();
    }

    public void addToInstructionsList(ArrayList<String> instructions, String instructionsFile) throws IOException {
        String instructionAdd;
        int instructionIndex = 0;
        String response;

        System.out.println("Current Instructions List: ");
        printList(instructions);
        
        do {
            System.out.print("Enter the index where you want to add to instruction: ");
            response = keyboard.nextLine();

            try {
                instructionIndex = Integer.parseInt(response) - 1;
                if (instructionIndex < 0 || instructionIndex > instructions.size()) {
                    System.out.println(INPUTERRORMESSAGE);
                }
            } catch (Exception e) {
                System.out.println(INPUTERRORMESSAGE);
                instructionIndex = -1;
            }
        } while (instructionIndex < 0 || instructionIndex > instructions.size());

        System.out.println("Write below the instruction you want to add.");
        System.out.println("Respond \"R3TURN\" to return to the update menu.");
        System.out.printf("%d. ", instructionIndex + 1);
            
        String instruction = keyboard.nextLine();

        if (instruction.equals(R3TURN)) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }

        instructionAdd = instructionIndex + ". " + instruction;
        
        instructions.add(instructionIndex, instructionAdd);
        formatInstructions(instructions);
        writeInstructions(instructions, instructionsFile);
        System.out.println("New Instructions List: ");
        printList(instructions);
        continuePrompt();
    }

    public void addToModificationsList(ArrayList<String> modifications, String modificationsFile) throws IOException {
        String modificationAdd;

        System.out.println("Current Modification List: ");
        printList(modifications);

        System.out.print("What modification do you want to add? ");
        System.out.println("Respond \"R3TURN\" to return to the update menu.");
        System.out.print("Respond here: ");
            
        modificationAdd = keyboard.nextLine();

        if (modificationAdd.equals(R3TURN)) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }
        
        for (String modification: modifications) {
            if (modificationAdd.equalsIgnoreCase(modification)) {
                System.out.println("This modification is already in this recipe.");
                continuePrompt();
                return;
            }
        }
        
        modifications.add(modificationAdd);
        writeModifications(modifications, modificationsFile);
        System.out.println("New Modifications List: ");
        printList(modifications);
        continuePrompt();

    }

    public void removeFromIngredientsList(ArrayList<String> ingredients, String ingredientsFile) throws IOException {
        String ingredientRemove;
        boolean ingredientFound = false;
        int occurences = 0;
        String response;

        System.out.println("Current Ingredient List: ");
        printList(ingredients);

        System.out.print("What ingredient do you want to remove? ");
        System.out.println("Respond \"R3TURN\" to return to the update menu.");
        System.out.print("Respond here: ");
        
        ingredientRemove = keyboard.nextLine();

        if (ingredientRemove.equals(R3TURN)) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }

        for (String ingredient: ingredients) {
            if (ingredientRemove.equalsIgnoreCase(ingredient)) {
                ingredientFound = true;
                occurences++;
            }
        }

        if (!ingredientFound) {
            System.out.println("Ingredient not found.");
            continuePrompt();
            return;
        }

        if (occurences > 1) {
            do {
                System.out.printf("%d occurences of ingredient have been found.", occurences);
                System.out.println("Respond REMOVEALL to remove all occurences.");
                System.out.println("Respond REMOVECOPIES to only remove the copies.");
                System.out.print("Respond here: ");
                response = keyboard.nextLine();

                if (response.equalsIgnoreCase(REMOVECOPIES)) {
                    occurences--;
                }

                else if (!response.equalsIgnoreCase(REMOVEALL)) {
                    System.out.println("Not a valid input. Please reread command list.");
                    response = null;
                }

            } while (response == null);
            
        }

        for (int i = 0; i < occurences; i++) {
            ingredients.remove(ingredientRemove);
        }
        
        writeIngredients(ingredients, ingredientsFile);
        System.out.println("New Ingredient List: ");
        printList(ingredients);
        continuePrompt();
        
    }

    public void removeFromInstructionsList(ArrayList<String> instructions, String instructionsFile) throws IOException {
        int instructionIndex = 0;
        String response;

        System.out.println("Current Instructions List: ");
        printList(instructions);
        
         do {
            System.out.print("Enter the index of the instruction you want to remove: ");
            response = keyboard.nextLine();

            try {
                instructionIndex = Integer.parseInt(response) - 1;
                if (instructionIndex < 0 || instructionIndex >= instructions.size()) {
                    System.out.println(INPUTERRORMESSAGE);
                }
            } catch (Exception e) {
                System.out.println(INPUTERRORMESSAGE);
                instructionIndex = -1;
            }
        } while (instructionIndex < 0 || instructionIndex >= instructions.size());

        System.out.println("You have selected this instruction: ");
        System.out.println(instructions.get(instructionIndex));
        System.out.print("Respond YES if you want to delete this instruction: ");
            
        response = keyboard.nextLine();

        if (!response.equalsIgnoreCase("YES")) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }
        
        instructions.remove(instructionIndex);
        formatInstructions(instructions);
        writeInstructions(instructions, instructionsFile);
        System.out.println("New Instructions List: ");
        printList(instructions);
        continuePrompt();
    }

    public void removeFromModificationsList(ArrayList<String> modifications, String modificationsFile) throws IOException {
        String modificationRemove;
        boolean modificationFound = false;
        int occurences = 0;
        String response;

        System.out.println("Current Modification List: ");
        printList(modifications);

        System.out.print("What modification do you want to remove? ");
        System.out.println("Respond \"R3TURN\" to return to the update menu.");
        System.out.print("Respond here: ");
        
        modificationRemove = keyboard.nextLine();

        if (modificationRemove.equals(R3TURN)) {
            System.out.println("Returning to update menu... ");
            continuePrompt();
            return;
        }

        for (String modification: modifications) {
            if (modificationRemove.equalsIgnoreCase(modification)) {
                modificationFound = true;
                occurences++;
            }
        }

        if (!modificationFound) {
            System.out.println("Modification not found.");
            continuePrompt();
            return;
        }

        if (occurences > 1) {
            do {
                System.out.printf("%d occurences of modification have been found.", occurences);
                System.out.println("Respond REMOVEALL to remove all occurences.");
                System.out.println("Respond REMOVECOPIES to only remove the copies.");
                System.out.print("Respond here: ");
                response = keyboard.nextLine();

                if (response.equalsIgnoreCase(REMOVECOPIES)) {
                    occurences--;
                }

                else if (!response.equalsIgnoreCase(REMOVEALL)) {
                    System.out.println("Not a valid input. Please reread command list.");
                    response = null;
                }

            } while (response == null);
            
        }

        for (int i = 0; i < occurences; i++) {
            modifications.remove(modificationRemove);
        }
        
        writeModifications(modifications, modificationsFile);
        System.out.println("New Modifications List: ");
        printList(modifications);
        continuePrompt();

    }

    public void editIngredientsList(ArrayList<String> ingredients, String ingredientsFile) throws IOException {
        String ingredientEdit;
        int ingredientLocation = -1;
        int ingredientTarget;
        String response;

        System.out.println("Current Ingredient List: ");
        printListWithIndexes(ingredients);

        do {
            System.out.print("Enter the index of the ingredient you want to edit: ");
            System.out.println("Respond \"R3TURN\" to return to the update menu.");
            System.out.print("Respond here: ");
            
            ingredientEdit = keyboard.nextLine();

            if (ingredientEdit.equals(R3TURN)) {
                System.out.println("Returning to update menu... ");
                continuePrompt();
                return;
            }
            
            try {
                ingredientLocation = Integer.parseInt(ingredientEdit) - 1;
                if (ingredientLocation < 0 || ingredientLocation >= ingredients.size()) {
                    System.out.println(INPUTERRORMESSAGE);
                }
            }

            catch (Exception e) {
                System.out.println(INPUTERRORMESSAGE);
                ingredientLocation = -1;
            } 
        } while (ingredientLocation < 0 || ingredientLocation >= ingredients.size());

        do {
            System.out.println("Respond TEXT to edit the text of the ingredient.");
            System.out.println("Respond MOVE to move the position of the ingredient.");
            System.out.println("Respond SWAP to switch position with another ingredient.");
            System.out.println("Respond \"R3TURN\" to return to the update menu.");
            System.out.print("Respond here: ");
            response = keyboard.nextLine();

            //TEXT
            if (response.equalsIgnoreCase(TEXT)) {
                System.out.println("Respond below what you want to change the text of this ingredient to... ");
                System.out.printf("%d. ", ingredientLocation + 1);
                ingredientEdit = keyboard.nextLine();

                ingredients.set(ingredientLocation, ingredientEdit);
            }

            //MOVE
            else if (response.equalsIgnoreCase(MOVE)) {
                do {
                    printListWithIndexes(ingredients);
                    System.out.print("Which index do you want to move the ingredient to? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        ingredientTarget= Integer.parseInt(response) - 1;
                        if (ingredientTarget < 0 || ingredientTarget >= ingredients.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        ingredientTarget = -1;
                    }

                } while (ingredientTarget < 0 || ingredientTarget >= ingredients.size());
                
                String ingredientText = ingredients.get(ingredientLocation);
                ingredients.remove(ingredientLocation);
                ingredients.add(ingredientTarget, ingredientText);
                
            }

            //SWAP
            else if (response.equalsIgnoreCase(SWAP)) {
                do {
                    printListWithIndexes(ingredients);
                    System.out.print("Which index do you want to swap the ingredient with? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        ingredientTarget= Integer.parseInt(response) -1;
                        if(ingredientTarget < 0 || ingredientTarget >= ingredients.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        ingredientTarget = -1;
                    }

                } while (ingredientTarget < 0 || ingredientTarget >= ingredients.size());
                
                String ingredientText = ingredients.get(ingredientLocation);
                ingredients.set(ingredientLocation, ingredients.get(ingredientTarget));
                ingredients.set(ingredientTarget, ingredientText);
            }

            else if (response.equals(R3TURN)) {
                System.out.println("Returning to update menu... ");
                continuePrompt();
                return;
            }

            else {
                System.out.println(INPUTERRORMESSAGE);
                response = null;
            }

        } while (response == null);
        
        writeIngredients(ingredients, ingredientsFile);
        System.out.println("New Ingredient List: ");
        printList(ingredients);
        continuePrompt();
    }

    public void editInstructionsList(ArrayList<String> instructions, String instructionsFile) throws IOException {
        String instructionEdit = "";
        int instructionLocation = 0;
        int instructionTarget = 0;
        String response;

        System.out.println("Current Instructions List: ");
        printList(instructions);
        
        do {
            System.out.print("Enter the number of the instruction you want to edit: ");
            response = keyboard.nextLine();

            try {
                instructionLocation = Integer.parseInt(response) - 1;
                if (instructionLocation < 0 || instructionLocation>= instructions.size()) {
                    System.out.println(INPUTERRORMESSAGE);
                }
            } catch (Exception e) {
                System.out.println(INPUTERRORMESSAGE);
                instructionLocation = -1;
            }
        } while (instructionLocation < 0 || instructionLocation >= instructions.size());

       do {
            System.out.println("Respond TEXT to edit the text of the instruction.");
            System.out.println("Respond MOVE to move the position of the instruction.");
            System.out.println("Respond SWAP to switch position with another instruction.");
            System.out.println("Respond \"R3TURN\" to return to the update menu.");
            System.out.print("Respond here: ");
            response = keyboard.nextLine();

            //TEXT
            if (response.equalsIgnoreCase(TEXT)) {
                System.out.println("Respond below what you want to change the text of this instruction to... ");
                System.out.printf("%d. ", instructionLocation + 1);
                String instruction = keyboard.nextLine();

                instructionEdit = instructionLocation + ". " + instruction;

                instructions.set(instructionLocation, instructionEdit);
            }

            //MOVE
            else if (response.equalsIgnoreCase(MOVE)) {
                do {
                    printList(instructions);
                    System.out.println("Chosen instruction: ");
                    System.out.println(instructions.get(instructionLocation));
                    System.out.print("Which index do you want to move the instruction to? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        instructionTarget = Integer.parseInt(response) - 1;
                        if (instructionTarget < 0 || instructionTarget >= instructions.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        instructionTarget = -1;
                    }

                } while (instructionTarget < 0 || instructionTarget >= instructions.size());
                
                String instructionText = instructions.get(instructionLocation);
                instructions.remove(instructionLocation);
                instructions.add(instructionTarget, instructionText);
                
            }

            //SWAP
            else if (response.equalsIgnoreCase(SWAP)) {
                do {
                    printList(instructions);
                    System.out.println("Chosen instruction: ");
                    System.out.println(instructions.get(instructionLocation));
                    System.out.print("Which index do you want to swap the instruction with? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        instructionTarget = Integer.parseInt(response) -1;
                        if(instructionTarget < 0 || instructionTarget >= instructions.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        instructionTarget = -1;
                    }

                } while (instructionTarget < 0 || instructionTarget >= instructions.size());
                
                String instructionText = instructions.get(instructionLocation);
                instructions.set(instructionLocation, instructions.get(instructionTarget));
                instructions.set(instructionTarget, instructionText);
            }

            else if (response.equals(R3TURN)) {
                System.out.println("Returning to update menu... ");
                continuePrompt();
                return;
            }

            else {
                System.out.println(INPUTERRORMESSAGE);
                response = null;
            }

        } while (response == null);

        
        formatInstructions(instructions);
        writeInstructions(instructions, instructionsFile);
        System.out.println("New Instructions List: ");
        printList(instructions);
        continuePrompt();
    }

    public void editModificationsList(ArrayList<String> modifications, String modificationsFile) throws IOException {
        String modificationEdit;
        int modificationLocation = -1;
        int modificationTarget;
        String response;

        System.out.println("Current Modification List: ");
        printListWithIndexes(modifications);

        do {
            System.out.print("Enter the index of the modification you want to edit: ");
            System.out.println("Respond \"R3TURN\" to return to the update menu.");
            System.out.print("Respond here: ");
            
            modificationEdit = keyboard.nextLine();

            if (modificationEdit.equals(R3TURN)) {
                System.out.println("Returning to update menu... ");
                continuePrompt();
                return;
            }
            
            try {
                modificationLocation = Integer.parseInt(modificationEdit) - 1;
                if (modificationLocation < 0 || modificationLocation >= modifications.size()) {
                    System.out.println(INPUTERRORMESSAGE);
                }
            }

            catch (Exception e) {
                System.out.println(INPUTERRORMESSAGE);
                modificationLocation = -1;
            } 
        } while (modificationLocation < 0 || modificationLocation >= modifications.size());

        do {
            System.out.println("Respond TEXT to edit the text of the modification.");
            System.out.println("Respond MOVE to move the position of the modification.");
            System.out.println("Respond SWAP to switch position with another modification.");
            System.out.println("Respond \"R3TURN\" to return to the update menu.");
            System.out.print("Respond here: ");
            response = keyboard.nextLine();

            //TEXT
            if (response.equalsIgnoreCase(TEXT)) {
                System.out.println("Respond below what you want to change the text of this modification to... ");
                System.out.printf("%d. ", modificationLocation + 1);
                modificationEdit = keyboard.nextLine();

                modifications.set(modificationLocation, modificationEdit);
            }

            //MOVE
            else if (response.equalsIgnoreCase(MOVE)) {
                do {
                    printListWithIndexes(modifications);
                    System.out.print("Which index do you want to move the modification to? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        modificationTarget = Integer.parseInt(response) - 1;
                        if (modificationTarget < 0 || modificationTarget >= modifications.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        modificationTarget = -1;
                    }

                } while (modificationTarget < 0 || modificationTarget >= modifications.size());
                
                String modificationText = modifications.get(modificationLocation);
                modifications.remove(modificationLocation);
                modifications.add(modificationTarget, modificationText);
                
            }

            //SWAP
            else if (response.equalsIgnoreCase(SWAP)) {
                do {
                    printListWithIndexes(modifications);
                    System.out.print("Which index do you want to swap the modification with? ");
                    System.out.println("Respond \"R3TURN\" to return to the update menu.");
                    System.out.print("Respond here: ");
                    response = keyboard.nextLine();

                    if (response.equals(R3TURN)) {
                        System.out.println("Returning to update menu... ");
                        continuePrompt();
                        return;
                    }

                    try {
                        modificationTarget = Integer.parseInt(response) -1;
                        if(modificationTarget < 0 || modificationTarget >= modifications.size()) {
                            System.out.println(INPUTERRORMESSAGE);
                        }
                    } 

                    catch (Exception e) {
                        System.out.println(INPUTERRORMESSAGE);
                        modificationTarget = -1;
                    }

                } while (modificationTarget < 0 || modificationTarget >= modifications.size());
                
                String modificationText = modifications.get(modificationLocation);
                modifications.set(modificationLocation, modifications.get(modificationTarget));
                modifications.set(modificationTarget, modificationText);
            }

            else if (response.equals(R3TURN)) {
                System.out.println("Returning to update menu... ");
                continuePrompt();
                return;
            }

            else {
                System.out.println(INPUTERRORMESSAGE);
                response = null;
            }

        } while (response == null);
        
        writeModifications(modifications, modificationsFile);
        System.out.println("New Modification List: ");
        printList(modifications);
        continuePrompt();
    }

    public void editRecipeName(Recipe myRecipe, ArrayList<String> recipeList) throws IOException {
        String newName = getDishName("What do you want your new recipe name to be? ");

        if (checkRecipeExists(recipeList, newName)) {
            System.out.println("This name already belongs to another recipe.");
            continuePrompt();
            return;
        }

        recipeList.set(recipeList.indexOf(myRecipe.getdishName()), newName);
        myRecipe.setdishName(newName);
        continuePrompt();
    }

    public void deleteRecipe(ArrayList<String> recipeList) throws IOException {
        String dishName = getDishName("What recipe do you want to delete? ");
        String response;

        if (!checkRecipeExists(recipeList, dishName)) {
            System.out.println("Recipe not found.");
            return;
        }

        ArrayList<String> ingredients = new ArrayList<String>();
        ArrayList<String> instructions = new ArrayList<String>();
        ArrayList<String> modifications = new ArrayList<String>();

        Recipe myRecipe = new Recipe(dishName, ingredients, instructions, modifications);
        readRecipe(myRecipe);

        System.out.println("This is the recipe you have chosen.");
        myRecipe.printRecipe();
        System.out.println("Deleted recipes cannot be recovered unless a copy exists elsewhere.");
        System.out.print("Respond YES if you are sure you want to delete this recipe: ");
        response = keyboard.nextLine();

        if (!response.equalsIgnoreCase("YES")) {
            System.out.printf("%s recipe not deleted.\n", myRecipe.getdishName());
            return;
        }

        File folder = new File(myRecipe.getfolderName());
        File[] files = folder.listFiles();

        if (files == null) {
            System.out.println("No files found in folder.");
            return;
        }

        for (File file : files) {
            if (file.delete()) {
                System.out.printf("%s successfully deleted.\n", file.getPath());
            }
            else {
                System.out.printf("Failed to delete %s\n", file.getPath());
            }
        }

        if (!folder.delete()) {
            System.out.println("Failed to delete recipe.");
            return;
        }

        System.out.printf("%s recipe sucessfully deleted.\n", myRecipe.getdishName());

        recipeList.remove(dishName.toLowerCase());
    }

    private void printList(ArrayList<String> list) {
        int listSize = list.size();

        if (listSize <= 0) {
            System.out.println("Nothing to list.");
            return;
        }

        for (int i = 0; i < listSize; i++) {
            System.out.printf("%s\n", list.get(i));
        }
    }

    private void printListWithIndexes(ArrayList<String> list) {
        int listSize = list.size();

        if (listSize <= 0) {
            System.out.println("Nothing to list.");
            return;
        }

        for (int i = 0; i < listSize; i++) {
            System.out.printf("%d. %s\n", i+1, list.get(i));
        }
    }

    private void continuePrompt() {
        System.out.print("Press enter to continue... ");
        keyboard.nextLine();
        System.out.println();
    }
}
