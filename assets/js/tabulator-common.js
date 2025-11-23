// assets/js/tabulator-common.js

/**
 * Create a Tabulator table with shared defaults.
 *
 * @param {string} selector   - CSS selector for the table container (e.g. "#armor-table")
 * @param {string} jsonUrl    - URL to the JSON file (e.g. "/data/equipment/armor-knight.json")
 * @param {Array}  columns    - Tabulator column definitions
 * @param {Object} options    - (optional) extra Tabulator options to merge in
 *
 * @returns {Tabulator|null}  - The Tabulator instance, or null on error
 */
function createTabulatorTable(selector, jsonUrl, columns, options) {
  const tableElement = document.querySelector(selector);

  if (!tableElement) {
    console.error("createTabulatorTable: no element found for selector", selector);
    return null;
  }

  const baseOptions = {
    ajaxURL: jsonUrl,          // Tabulator will load your JSON directly
    layout: "fitDataStretch",  // Stretch columns, but keep content readable
    resizableColumns: true,
    movableColumns: true,
    columnDefaults: {
      headerSort: true,
      hozAlign: "center",
      vertAlign: "middle",
    },
    placeholder: "No data available",
    columns: columns
  };

  const table = new Tabulator(tableElement, Object.assign({}, baseOptions, options || {}));

  // -----------------------
  // Anti-copy niceties
  // -----------------------
  tableElement.classList.add("noselect"); // use CSS: .noselect { user-select:none; }

  // Disable right-click menu on the table
  tableElement.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Block copy events when selection is inside the table
  document.addEventListener("copy", function (e) {
    const sel = document.getSelection();
    if (!sel) return;

    if (tableElement.contains(sel.anchorNode) || tableElement.contains(sel.focusNode)) {
      e.preventDefault();
    }
  });

  return table;
}
