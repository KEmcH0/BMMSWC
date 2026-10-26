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
  school: string;
  class: string;
  marks: number | null;
  merit_position: number | null;
};

const HEADER_ALIASES: Record<keyof ResultRow, string[]> = {
  roll: ["roll", "rollno", "rollnumber", "registration", "regno"],
  name: ["name", "studentname", "student"],
  school: ["school", "institution", "institute", "schoolname", "college"],
  class: ["class", "grade", "level"],
  marks: ["marks", "mark", "score", "total", "totalmarks", "obtainedmarks"],
  merit_position: ["position", "merit", "meritposition", "rank", "place"],
};

function normalize(h: string) {
  return h.toLowerCase().replace(/[^a-z]/g, "");
}

// "Class 8", "class-8" and "8" all become "8" so they match the result page sections.
export function normalizeClass(value: string) {
  return value.match(/\d+/)?.[0] ?? value.trim();
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

  const index = {} as Record<keyof ResultRow, number>;
  for (const key of Object.keys(HEADER_ALIASES) as (keyof ResultRow)[]) {
    index[key] = header.findIndex((h) => HEADER_ALIASES[key].includes(normalize(h)));
  }
  if (index.roll < 0) {
    throw new Error(`No “Roll” column found. Columns in your file: ${header.join(", ")}`);
  }

  const seen = new Set<string>();
  return lines.map((cells, i) => {
    const line = i + 2;
    const get = (k: keyof ResultRow) => (index[k] >= 0 ? (cells[index[k]] ?? "").trim() : "");
    const roll = get("roll");
    if (!roll) throw new Error(`Line ${line}: roll is empty.`);
    if (seen.has(roll)) throw new Error(`Line ${line}: roll ${roll} appears more than once.`);
    seen.add(roll);
    const position = toNumber(get("merit_position"), "position", line);
    return {
      roll,
      name: get("name"),
      school: get("school"),
      class: normalizeClass(get("class")),
      marks: toNumber(get("marks"), "mark", line),
      merit_position: position === null ? null : Math.trunc(position),
    };
  });
}
