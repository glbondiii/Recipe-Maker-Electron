# recipe-maker-electron

This is a project for a desktop app in Electron (framework for web design languages [HTML, CSS, and JavaScript(or TypeScript)] that is used to make desktop apps for all major operating systems) that is designed to be a recipe maker and manager.  
I originally coded this app in Java with a command-line-interface, but converted that code into what is in the repository.  
The code for the Electron app is found in the src folder/directory.
If you plan to work on the GUI, start by reading the .html files in the HTMLTemplates directory/folder and RecipeMaker.ts to get an idea for what id tags to use.
If you plan to work on the functionality, read over and start working in any of the .ts files.  
If you know anyone who would like to help with development, please direct them to the project.  
Thank you for your help!  

n.b To test/build on NixOS
1. Enable nix-ld (sorry, this is the current way)
2. To test, run "nix-shell --run 'npm start'" in the project root directory
3. To build, run "nix-shell" to enter a shell where you should be able to build normally
* Note: If there are any missing/unneccessary packages inside shell.nix, please let me know and
change as you see fit
