// A napló tárolt kódjainak magyar feliratai.

const MODES = { paper: "szimulált", replay: "replay", live: "valós" };
const DIRECTIONS = { long: "Long", short: "Short", "no-trade": "No trade" };
const EMOTIONS = { nyugodt: "nyugodt", bizonytalan: "bizonytalan", kapkodo: "kapkodó", frusztralt: "frusztrált", tulbiztos: "túl magabiztos" };
const RULES = { igen: "igen", reszben: "részben", nem: "nem" };
const RULE_GROUPS = { igen: "Szabályos", reszben: "Részben szabályos", nem: "Szabálytalan" };

export const modeLabel = (mode) => MODES[mode] || mode;
export const directionLabel = (direction) => DIRECTIONS[direction] || direction;
export const emotionLabel = (emotion) => EMOTIONS[emotion] || emotion;
export const ruleLabel = (rule) => RULES[rule] || rule;
export const ruleGroupLabel = (rule) => RULE_GROUPS[rule] || rule;
