import java.util.Scanner;
import java.util.ArrayList;
import java.io.*;

public class Recipe {

    //Fields
    private Scanner keyboard;
    private String dishName;
    private String folderName;
    private ArrayList<String> ingredients;
    private String ingredientsFile;
    private ArrayList<String> instructions;
    private String instructionsFile;
    private ArrayList<String> modifications;
    private String modificationsFile;
    
    //Constructors
    public Recipe(String dishName, ArrayList<String> ingredients, ArrayList<String> instructions, ArrayList<String> modifications) throws IOException {
        this.dishName = dishName.toLowerCase();
        this.folderName = "Recipes/" + this.dishName;
        makeFolder("Recipes");
        makeFolder(this.folderName);
        this.ingredients = ingredients;
        this.ingredientsFile = this.folderName + "/ingredients.txt";
        this.instructions = instructions;
        this.instructionsFile = this.folderName + "/instructions.txt";
        this.modifications = modifications;
        this.modificationsFile = this.folderName + "/modifications.txt";
    }

    public Recipe(String dishName, ArrayList<String> ingredients, ArrayList<String> instructions) throws IOException {
        this.dishName = dishName;
        this.folderName = "Recipes/" + this.dishName;
        makeFolder("Recipes");
        makeFolder(this.folderName);
        this.ingredients = ingredients;
        this.ingredientsFile = this.folderName + "/ingredients.txt";
        this.instructions = instructions;
        this.instructionsFile = this.folderName + "/instructions.txt";
        this.modificationsFile = this.folderName + "/modifications.txt";
    }

    public Recipe(String dishName, ArrayList<String> ingredients) throws IOException {
        this.dishName = dishName;
        this.folderName = "Recipes/" + this.dishName;
        makeFolder("Recipes");
        makeFolder(this.folderName);
        this.ingredients = ingredients;
        this.ingredientsFile = this.folderName + "/ingredients.txt";
        this.instructionsFile = this.folderName + "/instructions.txt";
        this.modificationsFile = this.folderName + "/modifications.txt";
    }

    public Recipe(String dishName) throws IOException{
        this.dishName = dishName;
        this.folderName = "Recipes/" + this.dishName;
        makeFolder("Recipes");
        makeFolder(this.folderName);
        this.ingredientsFile = this.folderName + "/ingredients.txt";
        this.instructionsFile = this.folderName + "/instructions.txt";
        this.modificationsFile = this.folderName + "/modifications.txt";
    }

    //Summary (called printRecipe)
    public void printRecipe() {
        System.out.printf("Dish Name: %s\n", this.dishName);
        printIngredients();
        printInstructions();
        printModifications();
    }

    public void printRecipeDebug() {
        System.out.printf("Dish Name = %s\n", this.dishName);
        System.out.printf("Folder Name = %s\n", this.folderName);
        printIngredients();
        System.out.printf("Ingredients File = %s\n", this.ingredientsFile);
        printInstructions();
        System.out.printf("Instructions File = %s\n", this.instructionsFile);
        printModifications();
        System.out.printf("Modifications File = %s\n", this.modificationsFile);
    }

    //Getters
    public String getdishName() {
        return this.dishName;
    }

    public String getfolderName() {
        return this.folderName;
    }

    public ArrayList<String> getingredients() {
        return this.ingredients;
    }

    public String getingredientsFile() {
        return this.ingredientsFile;
    }

    public ArrayList<String> getinstructions() {
        return this.instructions;
    }

    public String getinstructionsFile() {
        return this.instructionsFile;
    }

    public ArrayList<String> getmodifications() {
        return this.modifications;
    }

    public String getmodificationsFile() {
        return this.modificationsFile;
    }

    //Setters
    public void setdishName(String dishName) {
        this.dishName = dishName;
        setfolderName(this.dishName);
    }

    public void setfolderName(String folderName) {
        File folder = new File(this.folderName);
        File rename = new File("Recipes/" + folderName);

        if (!folder.isDirectory()) {
            System.err.println("Current folder is not a folder. Please check class fields.");
            return;
        }
        
        boolean flag = folder.renameTo(rename);

        if (flag == true) {
            this.folderName = "Recipes/" + folderName;
            System.out.printf("Folder/Recipe name is now %s.\n", this.folderName);
            updateingredientsFile();
            updateinstructionsFile();
            updatemodificationsFile();
        }

        else {
            System.out.println("Rename failed");
        }
        
    }
    
    public void setingredients(ArrayList<String> ingredients) {
        this.ingredients = ingredients;
    }

    public void updateingredientsFile() {
        this.ingredientsFile = this.folderName + "/ingredients.txt";
    }

    public void setinstructions(ArrayList<String> instructions) {
        this.instructions = instructions;
    }

    public void updateinstructionsFile() {
        this.instructionsFile = this.folderName + "/instructions.txt";
    }

    public void setmodifications(ArrayList<String> modifications) {
        this.modifications = modifications;
    }

    public void updatemodificationsFile() {
        this.modificationsFile = this.folderName + "/modifications.txt";
    }

    //Other Methods
    public void printIngredients() {
        System.out.println("Ingredients: ");
        int listSize = this.ingredients.size();

        if (listSize <= 0) {
            System.out.println("Nothing to list.");
            return;
        }

        for (int i = 0; i < listSize; i++) {
            System.out.printf("%s\n", this.ingredients.get(i));
        }
    }

    public void printInstructions() {
        System.out.println("Instructions: ");
        int listSize = this.instructions.size();

        if (listSize <= 0) {
            System.out.println("Nothing to list.");
            return;
        }

        for (int i = 0; i < listSize; i++) {
            System.out.printf("%s\n", this.instructions.get(i));
        }
    }

    public void printModifications() {
        System.out.println("Modifications: ");
        int listSize = this.modifications.size();

        if (listSize <= 0) {
            System.out.println("Nothing to list.");
            return;
        }

        for (int i = 0; i < listSize; i++) {
            System.out.printf("%s\n", this.modifications.get(i));
        }
    }

    private void makeFolder(String newFolderName) throws IOException {
        keyboard = new Scanner(System.in);

        File folder = new File(newFolderName).getAbsoluteFile();

        if (folder.exists()) {
            return;
        }

        System.out.printf("%s directory not found.\n", newFolderName);
        System.out.printf("Respond YES if you would like the program to make a %s directory for you.\n", newFolderName);
        System.out.printf("N.B IF A %s FOLDER DOES EXIST IN THIS DIRECTORY, "
        + "IT WILL BE OVERWRITTEN IF YOU RESPOND YES!\n", newFolderName);
        System.out.print("Respond here: ");
        String response = keyboard.nextLine();

        if (!response.equalsIgnoreCase("YES")) {
            System.out.printf("Please quit, check your folders, and make a backup of any folder named %s.\n", newFolderName);
            System.exit(1);
        }
           

        try {
            if (folder.mkdir()) {
                System.out.println(newFolderName + " directory created.");
            }
            else {
                System.out.println("Failed to create " + newFolderName + " directory.");
            }
        } 
        catch (Exception e) {
            e.printStackTrace();
        }
    }

}