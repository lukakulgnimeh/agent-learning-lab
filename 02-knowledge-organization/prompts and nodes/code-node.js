// Input aus Extract from File
const input = $input.first().json;

const fullText = input.text;
const totalPages = input.numpages;

const sourceName =
  input.file?.[0]?.filename ?? "unknown.pdf";

const lines = fullText.split(/\r?\n/);

// Hier sammeln wir die Startpositionen aller Seiten
const pageBreaks = [
  {
    page: 1,
    index: 0,
  },
];

// ---------- Seite 1 erkennen ----------

let searchStart = 0;

for (let i = 0; i < lines.length; i++) {

  if (
    lines[i].includes(
      "Arbeitsgruppe Data Science, Institut für Informatik"
    )
  ) {

    pageBreaks.push({
      page: 2,
      index: i + 1,
    });

    searchStart = i + 1;
    break;
  }

}

// ---------- Seiten 2 bis Ende ----------

for (let expectedPage = 2; expectedPage <= totalPages; expectedPage++) {

  for (let i = searchStart; i < lines.length; i++) {

    if (lines[i].trim() === String(expectedPage)) {

      // Seite expectedPage beginnt bei der Seitenzahl
      pageBreaks.push({
        page: expectedPage,
        index: i,
      });

      searchStart = i + 1;
      break;
    }

  }

}

// Doppelte Einträge entfernen (Seite 2 wurde bereits oben erzeugt)
const uniqueBreaks = [];
const seenPages = new Set();

for (const b of pageBreaks) {

  if (!seenPages.has(b.page)) {
    uniqueBreaks.push(b);
    seenPages.add(b.page);
  }

}

uniqueBreaks.sort((a, b) => a.index - b.index);

// ---------- Seiten erzeugen ----------

const output = [];

for (let i = 0; i < uniqueBreaks.length; i++) {

  const current = uniqueBreaks[i];
  const next = uniqueBreaks[i + 1];

  const start = current.index;
  const end = next ? next.index : lines.length;

  const pageText = lines
    .slice(start, end)
    .join("\n")
    .trim();

  if (pageText.length > 0) {

    output.push({
      json: {
        pageContent: pageText,
        metadata: {
          source: sourceName,
          page: current.page,
          totalPages,
        },
      },
    });

  }

}

return output;