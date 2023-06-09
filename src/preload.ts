// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import Recipe from "./Recipe";

contextBridge.exposeInMainWorld('reciMakeAPI', {
	HTMLToString: (HTMLFilePath: string): Promise<string> => ipcRenderer.invoke("HTMLToString", HTMLFilePath),
    makeRecipeList: (): Promise<Recipe[]> => ipcRenderer.invoke("makeRecipeList"),
    readRecipe: (dishName: string): Promise<Recipe> => ipcRenderer.invoke("readRecipe", dishName),
    writeRecipe: (recipe: Recipe) => ipcRenderer.invoke("writeRecipe", recipe),
    deleteRecipe: (recipe: Recipe) => ipcRenderer.invoke("deleteRecipe", recipe),
    focusFix: () => ipcRenderer.send('focus-fix'),
});
