import java.util.Scanner;
import java.util.ArrayList;
import java.io.*;

public class RecipeMakerUI {
    static Scanner keyboard = new Scanner(System.in);
    public static void main(String[] args) throws IOException {
        //Variables
        ArrayList<String> recipeList = new ArrayList<String>();
        String choice;
        
        final String CREATE = "CREATE";
        final String COPY = "COPY";
        final String PRINT = "PRINT";
        final String LISTALL = "LISTALL";
        final String UPDATE = "UPDATE";
        final String DELETE = "DELETE";
        final String QUIT = "QUIT";

        RecipeMaker myRecipeMaker = new RecipeMaker();
        
        myRecipeMaker.makeRecipeList(recipeList);

        File folder = new File("Recipes").getAbsoluteFile();

        if (!folder.exists()) {
            return;
        }

        do {
            mainMenu();
            System.out.print("Enter the command of the option you want: ");
            choice = keyboard.nextLine();
            System.out.println();

            if (choice.equalsIgnoreCase(CREATE)) {
                myRecipeMaker.createRecipe(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(COPY)) {
                myRecipeMaker.copyRecipe(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(PRINT)) {
                myRecipeMaker.printRecipe(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(LISTALL)) {
                myRecipeMaker.listRecipes(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(UPDATE)) {
                myRecipeMaker.updateRecipe(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(DELETE)) {
                myRecipeMaker.deleteRecipe(recipeList);
                continuePrompt();
            }

            else if (choice.equalsIgnoreCase(QUIT)) {
                System.out.println("Quitting... ");
            }

            else {
                System.out.println("Not a valid choice. Please try again.");
            }

        } while (!choice.equalsIgnoreCase("QUIT"));

    }


    public static void mainMenu() {
        System.out.println();
        System.out.println("--------RecipeMaker.java (Dedicated to my mom)--------");
        System.out.println("CREATE = Create new recipe");
        System.out.println("COPY = Make copy of existing recipe");
        System.out.println("PRINT = Print existing recipe");
        System.out.println("LISTALL = List all recipes");
        System.out.println("UPDATE = Update recipe");
        System.out.println("DELETE = Delete recipe");
        System.out.println("QUIT = Quit program");
        System.out.println();
    }

    public static void continuePrompt() {
        System.out.print("Press enter to continue... ");
        keyboard.nextLine();
    }
}
