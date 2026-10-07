// A modulonkénti törzsanyag egy objektumban: CONTENT[leckeId].
import module1 from "./01-alapmechanika.js";
import module2 from "./02-kontextus.js";
import module3 from "./03-kockazat.js";
import module4 from "./04-strategia.js";
import module5 from "./05-pszichologia.js";
import module6 from "./06-diligence.js";

export const CONTENT = { ...module1, ...module2, ...module3, ...module4, ...module5, ...module6 };
