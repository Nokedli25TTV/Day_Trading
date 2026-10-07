// A nyilvános, jelszóval védett kiadás előállítása a dist mappából a public mappába.
// A tananyag (leckék, kvíz, fogalomtár) titkosítva kerül ki; a jelszó nélkül letöltve olvashatatlan.
//
// Futtatás:  node tools/build-public.mjs            (rákérdez a jelszóra, gépelés közben nem látszik)
//      vagy: SITE_PASSWORD=... node tools/build-public.mjs   (automatizált közzétételhez)
import { cp, rm, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join, relative } from "node:path";
import { encryptJSON } from "../dist/js/lock/crypto.js";
import { DATA } from "../dist/data.js";
import { CONTENT } from "../dist/content/index.js";
import { GLOSSARY } from "../dist/content/fogalomtar.js";

const base = fileURLToPath(new URL("../", import.meta.url));
export const MIN_PASSWORD_LENGTH = 10;
// Rögzített, oldalhoz kötött só: ugyanaz a jelszó minden kiadásnál ugyanazt a kulcsot adja.
const SITE_SALT = createHash("sha256").update("tradecraft-akademia/content/v1").digest().subarray(0, 16);

const STUBS = {
  "data.js": 'import { bundle } from "./js/lock/unlock.js";\n\nexport const DATA = bundle.DATA;\n',
  "content/index.js": 'import { bundle } from "../js/lock/unlock.js";\n\nexport const CONTENT = bundle.CONTENT;\n',
  "content/fogalomtar.js": 'import { bundle } from "../js/lock/unlock.js";\n\nexport const GLOSSARY = bundle.GLOSSARY;\n',
};
const STUB_NOTE = "// A nyilvános kiadásban a tananyag titkosított: belépés után a js/lock/unlock.js adja át.\n";

async function listFiles(dir, root = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name), root) : [relative(root, join(dir, entry.name)).replaceAll("\\", "/")])));
  return nested.flat().sort();
}

export async function buildPublic({ password, outDir = join(base, "public"), iterations } = {}) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`A jelszó legalább ${MIN_PASSWORD_LENGTH} karakter legyen.`);
  }
  await rm(outDir, { recursive: true, force: true });
  await cp(join(base, "dist"), outDir, { recursive: true });

  // A nyílt szövegű tananyag nem kerülhet ki: a leckefájlok törlődnek, a három adatmodul helyére átadó modul kerül.
  for (const name of await readdir(join(outDir, "content"))) {
    if (/^\d\d-/.test(name)) await rm(join(outDir, "content", name));
  }
  await writeFile(join(outDir, "content.enc.json"), JSON.stringify(await encryptJSON({ DATA, CONTENT, GLOSSARY }, password, { iterations, salt: SITE_SALT })));
  for (const [file, source] of Object.entries(STUBS)) await writeFile(join(outDir, file), STUB_NOTE + source);

  // Zárolt állapotban induljon, hogy belépés előtt az üres váz se villanjon fel.
  const htmlPath = join(outDir, "index.html");
  const html = await readFile(htmlPath, "utf8");
  if (!html.includes('<html lang="hu">')) throw new Error("Az index.html eleje megváltozott: a zárolás nem illeszthető be.");
  await writeFile(htmlPath, html.replace('<html lang="hu">', '<html lang="hu" data-locked="1">'));

  // A service worker listája a tényleges fájlokat kövesse.
  const files = (await listFiles(outDir)).filter((file) => file !== "sw.js");
  const swPath = join(outDir, "sw.js");
  const sw = await readFile(swPath, "utf8");
  const list = /const ASSETS = \[[\s\S]*?\n\];/;
  if (!list.test(sw)) throw new Error("A sw.js fájllistája nem található.");
  await writeFile(swPath, sw.replace(list, `const ASSETS = [\n  "./",\n${files.map((file) => `  "./${file}",`).join("\n")}\n];`));

  return { outDir, files };
}

// Jelszó bekérése úgy, hogy gépelés közben ne jelenjen meg a képernyőn.
function askHidden(question) {
  return new Promise((resolve) => {
    const prompt = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    process.stdout.write(question);
    prompt._writeToOutput = () => {};
    prompt.question("", (answer) => {
      prompt.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    let password = process.env.SITE_PASSWORD;
    if (!password) {
      password = await askHidden("Jelszó a közzétett oldalhoz: ");
      if ((await askHidden("Jelszó még egyszer: ")) !== password) throw new Error("A két jelszó nem egyezik.");
    }
    const { outDir, files } = await buildPublic({ password });
    console.log(`Kész: ${files.length} fájl itt: ${outDir}`);
    console.log("Ezt a mappát kell közzétenni. A tananyag a content.enc.json fájlban van, titkosítva.");
  } catch (error) {
    console.error(`Nem sikerült: ${error.message}`);
    process.exit(1);
  }
}
