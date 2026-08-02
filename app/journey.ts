/* --------------------------------------------------------------------------
   The journey — everything a passport holds.

   THIS IS THE BACKEND PREVIEW. The `Journey` type below is the row: when
   Supabase lands, it is a table and a select, and nothing about the two dialogs
   has to change except where this store reads from. Building it in TypeScript
   first is the cheap way to find out what actually needs storing, before any
   schema decision is expensive to undo.

   NOTHING IS PERSISTED. There is no account to attach a stamp to, so a journey
   lives as long as the tab. Both dialogs say so on screen, in the amber the site
   gives anything scheduled — a counter that silently reset would be exactly the
   thing this project's rule forbids.

   The store is module-level with subscribe/getSnapshot, read through React's own
   useSyncExternalStore. Not context: page.tsx is a server component and the two
   dialogs are separate client islands under it, so a provider would mean
   wrapping the page and giving up static rendering. This costs neither.
   -------------------------------------------------------------------------- */

import { useSyncExternalStore } from "react";

/** Fired on `window` when a command wants the passport. Mirrors OPEN_CHECKIN. */
export const OPEN_PASSPORT = "bbp:open-passport";

export type Stamp = {
  /** What the stamp reads. A phase's own word, or whatever they typed. */
  label: string;
  /** Full ISO timestamp. Displayed as a date; the time is what orders them. */
  at: string;
};

export type Journey = {
  /** Everyone holds 0001 until there are accounts to number. */
  passportNo: string;
  /** Free text, may be "". */
  holder: string;
  /** ISO 3166-1 alpha-2, may be "". */
  nationality: string;
  /** Set by the first check-in, not at load — see ISSUED below. */
  issued: string;
  miles: number;
  /** Phase value -> stamp. One slot per phase, which is what caps the page. */
  stamps: Record<string, Stamp>;
};

/* `issued` is deliberately empty here rather than a date.
   The dialogs are prerendered into the static HTML, so anything derived from
   `new Date()` at module load would be the BUILD date on the server and today's
   date in the browser — a hydration mismatch. It is also just truer: a passport
   is issued when you first check in, and until then it has not been. */
const EMPTY: Journey = {
  passportNo: "0001",
  holder: "",
  nationality: "",
  issued: "",
  miles: 0,
  stamps: {},
};

let journey: Journey = EMPTY;

const listeners = new Set<() => void>();

function set(next: Journey) {
  journey = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Must return a stable reference while nothing has changed, or React loops. */
function getSnapshot(): Journey {
  return journey;
}

/** The server renders the empty journey, which is what the client starts on. */
function getServerSnapshot(): Journey {
  return EMPTY;
}

export function useJourney(): Journey {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ---- Mutations --------------------------------------------------------- */

/**
 * Stamp a phase and pay for it.
 *
 * One slot per phase, and **a slot pays once**. Checking in again at a phase
 * already stamped re-dates it and pays nothing, so "Change my pass" cannot print
 * money — the ceiling is one payout per phase, which is one full page.
 *
 * Returns the miles actually paid, because the issued pass has to show it.
 */
export function checkIn(phase: string, label: string, milesPerCheckin: number): number {
  const paid = journey.stamps[phase] ? 0 : milesPerCheckin;
  const now = new Date().toISOString();
  set({
    ...journey,
    issued: journey.issued || now,
    miles: journey.miles + paid,
    stamps: { ...journey.stamps, [phase]: { label, at: now } },
  });
  return paid;
}

export function setHolder(holder: string) {
  set({ ...journey, holder });
}

export function setNationality(nationality: string) {
  set({ ...journey, nationality });
}

/* ---- Tiers ------------------------------------------------------------- */

/**
 * Yours to rename. Thresholds are stamp counts rather than round numbers — 1, 3
 * and 6 check-ins at MILES_PER_CHECKIN — so the top of the ladder is exactly a
 * full page rather than a number nobody can reach.
 */
export const TIERS = [
  { at: 0, name: "Standby" },
  { at: 1240, name: "Boarded" },
  { at: 3720, name: "Frequent Flyer" },
  { at: 7440, name: "Captain" },
];

export function tierFor(miles: number): string {
  let name = TIERS[0].name;
  for (const tier of TIERS) if (miles >= tier.at) name = tier.name;
  return name;
}

/* ---- Display ----------------------------------------------------------- */

const MONTHS = "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split(" ");

/** Passport-book style: 01 AUG 26. Empty string in, em dash out. */
export function formatStampDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
}

/* ---- The machine-readable zone ----------------------------------------- */

/*
   ICAO 9303, the two-line strip across the foot of every passport data page.
   The layout is a public standard, and building ours to it means the check
   digits are really computed rather than drawn — so the strip stays true as the
   miles and the tier move, instead of being a decorative squiggle that lies the
   moment anything changes.

   One knowing inaccuracy: the real spec wants a 3-letter country code and we
   store alpha-2, so TH is padded to `TH<` rather than reading `THA`. Correcting
   it means shipping a 250-row alpha-2 → alpha-3 table for one cosmetic line.
   Swap it in here if that ever feels worth ~1KB.
*/

const MRZ_LEN = 44;

/** A=10 … Z=35, digits are themselves, filler is 0. */
function mrzValue(ch: string): number {
  if (ch >= "0" && ch <= "9") return ch.charCodeAt(0) - 48;
  if (ch >= "A" && ch <= "Z") return ch.charCodeAt(0) - 55;
  return 0;
}

/** The 7-3-1 weighted modulus the spec uses for every check digit. */
function checkDigit(field: string): string {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < field.length; i++) sum += mrzValue(field[i]) * weights[i % 3];
  return String(sum % 10);
}

/** Anything not A–Z or 0–9 becomes the filler character, as the spec requires. */
function mrzText(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]+/g, "<");
}

const fill = (value: string, length: number) => value.slice(0, length).padEnd(length, "<");

export function mrzLines(journey: Journey): [string, string] {
  const holder = mrzText(journey.holder.trim()) || "BEARER<UNKNOWN";
  const line1 = fill(`P<BBP${holder}`, MRZ_LEN);

  const docNo = fill(journey.passportNo, 9);
  const docCheck = checkDigit(docNo);
  const nation = fill(journey.nationality, 3);

  const issued = journey.issued ? new Date(journey.issued) : null;
  const date = issued
    ? `${String(issued.getFullYear()).slice(2)}${String(issued.getMonth() + 1).padStart(2, "0")}${String(issued.getDate()).padStart(2, "0")}`
    : "<<<<<<";
  const dateCheck = checkDigit(date);

  const tier = fill(mrzText(tierFor(journey.miles)), 14);
  const miles = String(Math.min(journey.miles, 999999)).padStart(6, "0");

  const body = `${docNo}${docCheck}${nation}${date}${dateCheck}${tier}${miles}`;
  // The spec's composite digit runs over the document, date and optional-data
  // fields. Same idea here, over everything this passport actually holds.
  const line2 = fill(`${body}<<<${checkDigit(body)}`, MRZ_LEN);

  return [line1, line2];
}

/**
 * ISO 3166-1 alpha-2. Only the codes ship — Intl.DisplayNames turns them into
 * names in the browser's own language, so this is ~750 bytes instead of a
 * translated name table.
 */
export const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " ",
  );

/**
 * Names come from the platform. Falls back to the raw code on the handful of
 * engines without Intl.DisplayNames rather than shipping a name table for them.
 */
export function countryNames(): { code: string; name: string }[] {
  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(undefined, { type: "region" });
  } catch {
    display = null;
  }
  return COUNTRY_CODES.map((code) => ({
    code,
    name: display?.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name));
}
