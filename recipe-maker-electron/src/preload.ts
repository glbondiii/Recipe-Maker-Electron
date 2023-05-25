// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import Recipe from "./Recipe";

contextBridge.exposeInMainWorld('reciMakeAPI', {
    makeRecipeList: (): Promise<string[]> => ipcRenderer.invoke("makeRecipeList"),
    readRecipe: (dishName: string): Promise<Recipe> => ipcRenderer.invoke("readRecipe", dishName),
    writeRecipe: (recipe: Recipe) => ipcRenderer.invoke("writeRecipe", recipe),
    deleteRecipe: (recipe: Recipe) => ipcRenderer.invoke("deleteRecipe", recipe),
});