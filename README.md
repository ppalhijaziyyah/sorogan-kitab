# Sorogan App

This application is a learning platform designed to help users study and understand Arabic texts, particularly unvowelized "kitab gundul" (kitab kuning). Built with React and Vite, it offers interactive features and customizable display settings to enhance the learning experience.

## Features

*   **Interactive Learning Modes:**
    *   **Harakat Mode:** Toggle vowel markings (harakat) per word on click.
    *   **Translation Mode:** Toggle Indonesian translations per word on click.
    *   **Nga-logat Mode:** Toggle traditional pesantren-style nga-logat symbols per word on click.
    *   **Full Harakat/Translation/Nga-logat:** Dedicated toggles to show all harakat, all translations, or all nga-logat symbols at once.
*   **Customizable Display Settings:** Adjust Arabic font size, word spacing, line height, tooltip (translation) font size, Irab text size, and nga-logat symbol size.
*   **Nga-logat Symbol Customization:**
    *   **Symbol Color Coding:** Option to enable dynamic color coding for nga-logat symbols based on their type (e.g., 'ف' for fa'il in red, 'مضف' for mudhaf in green). Colors are configured externally in `src/data/ngalogat-symbol-colors.json`.
    *   **Uniform Symbol Color:** When color coding is disabled, all nga-logat symbols use a consistent, clearly visible color in both light and dark modes.
*   **Progress Tracking:** Tracks completed lessons.
*   **Theming:** Supports light and dark modes.
*   **Search and Filter:** Easily find lessons by title and filter by difficulty level (Ibtida’i, Mutawassit, Mutaqaddim).

## Toolbar Layout

The main interactive toggles are located in the learning toolbar at the top of the lesson page:

`[ Harakat Mode ] [ Translation Mode ] [ Nga-logat Mode ] | [ Show All Harakat ] [ Show All Nga-logat ] | [ Full Translation ] [ Display Settings ]`

---

## XLSX Format for Nga-logat Integration (and Lesson Data Structure)

To integrate `nga-logat` symbols into your lesson content, you will need to extend your lesson data structure. The application expects `nga_logat` information to be part of each word object within the `textData` array of your lesson JSON files.

**Important Note:** The `nga_logat` array is **completely optional**. If a word object does not contain the `nga_logat` property, or if the array is empty, the application will simply not display any nga-logat symbols for that specific word. The application will continue to function normally.

For each word, you can add a `nga_logat` property, which should be an array of objects. Each object represents a single nga-logat symbol or meaning associated with that word.

**Structure of a `nga_logat` object:**

```json
{
  "symbol": "string",  // The actual nga-logat symbol (e.g., "ف", "ج", "مضف", "nya")
  "position": "string" // Position relative to the Arabic word: "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
}
```

**Example of `wordData` with `nga_logat`:**

```json
{
  "berharakat": "بِسْمِ",
  "gundul": "بسم",
  "terjemahan": "Dengan nama",
  "irab": "جار ومجرور",
  "nga_logat": [
    { "symbol": "بِ", "position": "top-left" },
    { "symbol": "ج", "position": "top" }
  ]
}
```

**Color Coding:**

Colors for `nga-logat` symbols are no longer defined directly in the lesson JSON. Instead, if the "Gunakan Kode Warna Nga-logat" setting is active, the application will look up the color for each `symbol` in the `src/data/ngalogat-symbol-colors.json` file. You can edit this JSON file to define global color mappings for your nga-logat symbols. If a symbol is not found in `ngalogat-symbol-colors.json`, a default uniform color will be used.

**Generating from XLSX:**

When generating your lesson JSON files from an XLSX (or any other source), you would need to:
1.  Ensure your XLSX includes columns for `symbol` and `position` for each nga-logat entry associated with a word. You might need multiple columns if a word has multiple nga-logat entries.
2.  Parse these columns to construct the `nga_logat` array for each word object in the resulting JSON.
