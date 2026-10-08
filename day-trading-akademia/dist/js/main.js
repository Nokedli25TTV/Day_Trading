// Belépési pont: a modulok bekötése. Itt csak sorrend van, logika nincs.
import { refresh, storageRecovered } from "./store.js";
import { showToast } from "./toast.js";
import { initTabs } from "./tabs.js";
import { initRouter, route } from "./router.js";
import { initOverview } from "./views/overview.js";
import { initRoadmap } from "./views/roadmap.js";
import { initReadiness } from "./views/readiness.js";
import { initLibrary } from "./views/library.js";
import { initLesson } from "./views/lesson.js";
import { initQuiz } from "./views/quiz.js";
import { initReview } from "./views/review.js";
import { initLabs } from "./views/labs.js";
import { initJournal } from "./views/journal.js";
import { initQuestions } from "./views/questions.js";
import { initStats } from "./views/stats.js";
import { initWeeklyReview } from "./views/weekly-review.js";
import { initRulebook } from "./views/rulebook.js";
import { initPrecheck } from "./views/precheck.js";
import { initSettings } from "./views/settings.js";
import { initStudyTime } from "./features/study-time.js";
import { initBackup } from "./features/backup.js";
import { initSearch } from "./features/search.js";
import { initTerms } from "./features/terms.js";
import { initPWA } from "./features/pwa.js";
import { initWebMCP } from "./features/webmcp.js";

initTabs();
initRouter();
[
  initOverview, initRoadmap, initReadiness, initLibrary, initLesson, initQuiz, initReview, initLabs,
  initJournal, initQuestions, initStats, initWeeklyReview, initRulebook, initPrecheck, initSettings, initStudyTime, initSearch, initTerms,
].forEach((init) => init());

refresh();
route(false);

// Innentől az index.html indulási figyelője tudja, hogy az alkalmazás elindult.
window.tradecraftReady = true;

initBackup();
initPWA();
initWebMCP();
if (storageRecovered) showToast("A korábbi helyi adat nem volt olvasható, ezért biztonságos alapállapotot töltöttünk be.", true);
