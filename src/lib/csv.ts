// Minimal RFC 4180 CSV parser: handles quoted fields, escaped quotes, commas/newlines inside quotes, CRLF and BOM.
export function parseCSV(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

export type ResultRow = {
  roll: string;
  name: string;
  father_name: string;
  mother_name: string;
  village: string;
  school: string;
  class: string;
  marks: number | null;
  merit_position: number | null;
};

type Column = keyof ResultRow | "group";

const HEADER_ALIASES: Record<Column, string[]> = {
  roll: ["roll", "rollno", "rollnumber", "registration", "regno"],
  name: ["name", "studentname", "student"],
  father_name: ["father", "fathername", "fathersname"],
  mother_name: ["mother", "mothername", "mothersname"],
  village: ["village", "gram", "address"],
  school: ["school", "institution", "institute", "schoolname", "college"],
  class: ["class", "grade", "level"],
  group: ["group", "section", "stream", "department", "faculty"],
  marks: ["marks", "mark", "score", "total", "totalmarks", "obtainedmarks"],
  merit_position: ["position", "merit", "meritposition", "rank", "place"],
};

function normalize(h: string) {
  return h.toLowerCase().replace(/[^a-z]/g, "");
}

const GROUPS: [string, RegExp][] = [
  ["science", /science/i],
  ["arts", /arts|humanities/i],
  ["commerce", /commerce|business/i],
];

// "Class 8", "class-8" and "8" all become "8" so they match the result page sections.
// Class 12 also needs its group: "12" + "Science" (or "HSC Science") becomes "12-science".
export function normalizeClass(value: string, group = "") {
  const cls = value.match(/\d+/)?.[0] ?? (/hsc/i.test(value) ? "12" : value.trim());
  if (cls !== "12") return cls;
  const g = GROUPS.find(([, re]) => re.test(`${value} ${group}`))?.[0];
  return g ? `12-${g}` : cls;
}

function toNumber(value: string, label: string, line: number) {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n)) throw new Error(`Line ${line}: “${v}” is not a valid ${label}.`);
  return n;
}

// Turns a results CSV into rows. Throws a readable error for the admin if something is wrong.
export function parseResultsCSV(input: string): ResultRow[] {
  const [header, ...lines] = parseCSV(input);
  if (!header) throw new Error("The file is empty.");

  const index = {} as Record<Column, number>;
  for (const key of Object.keys(HEADER_ALIASES) as Column[]) {
    index[key] = header.findIndex((h) => HEADER_ALIASES[key].includes(normalize(h)));
  }
  if (index.roll < 0) {
    throw new Error(`No “Roll” column found. Columns in your file: ${header.join(", ")}`);
  }

  const seen = new Set<string>();
  return lines.map((cells, i) => {
    const line = i + 2;
    const get = (k: Column) => (index[k] >= 0 ? (cells[index[k]] ?? "").trim() : "");
    const roll = get("roll");
    if (!roll) throw new Error(`Line ${line}: roll is empty.`);
    if (seen.has(roll)) throw new Error(`Line ${line}: roll ${roll} appears more than once.`);
    seen.add(roll);
    const cls = normalizeClass(get("class"), get("group"));
    if (cls === "12") throw new Error(`Line ${line}: Class 12 needs a Group (Science, Arts or Commerce).`);
    const position = toNumber(get("merit_position"), "position", line);
    return {
      roll,
      name: get("name"),
      father_name: get("father_name"),
      mother_name: get("mother_name"),
      village: get("village"),
      school: get("school"),
      class: cls,
      marks: toNumber(get("marks"), "mark", line),
      merit_position: position === null ? null : Math.trunc(position),
    };
  });
}
