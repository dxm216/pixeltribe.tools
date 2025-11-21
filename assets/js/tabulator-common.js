// tabulator-common.js
// Expects Tabulator to be loaded on the page (via CDN or local bundle)

// Helper to convert empty/null values to displayable `--` and mark cells with class
function emptyToDash(value, data, type, params, component){
  if (value === null || value === undefined || value === "" || value === "--") {
    return "<span class='empty-cell'>--</span>";
  }
  return value;
}

/**
 * createTabulatorTable(containerElement, dataUrl, columns, opts)
 * - containerElement: DOM node
 * - dataUrl: path to JSON file
 * - columns: Tabulator column definitions
 * - opts: {groupBy, initialSort}
 */
function createTabulatorTable(containerElement, dataUrl, columns, opts = {}) {
  const defaultOptions = {
    layout: "fitDataStretch",      // stretch columns while keeping fit
    movableColumns: true,          // allow reorder
    resizableColumns: true,
    columnHeaderVertAlign: "middle",
    responsiveLayout: "collapse",
    pagination: false,
    height: "auto",
    groupHeader: function(value, count, data, group){
      return `${value} <span style="color:var(--muted);font-weight:400">(${count})</span>`;
    },
    index: "name",
    columns: columns.map(col => {
      // attach formatter for empty cells
      return Object.assign({}, col, {formatter: emptyToDash});
    }),
    // disable built-in download if present / blocks common export methods (Tabulator has a download feature,
    // we simply don't add UI to trigger it).
  };

  // merge opts
  const settings = Object.assign({}, defaultOptions, opts);

  // build Tabulator
  const table = new Tabulator(containerElement, Object.assign({}, settings, {
    ajaxURL: dataUrl,
    ajaxResponse: function(url, response) {
      // ensure missing keys are present and normalized
      return response.map(r => {
        // ensure all expected fields exist to avoid "undefined" showing
        const keys = ["level","class","tier","type","name","def_min","def_max","mdef_min","mdef_max","str_min","str_max","agil_min","agil_max","hp_min","hp_max","obtain"];
        keys.forEach(k => { if (!(k in r)) r[k] = "--"; });
        return r;
      });
    }
  }));

  // Anti-copy: disable selection & right click within the Tabulator area
  containerElement.classList.add("noselect");

  containerElement.addEventListener("contextmenu", (e) => { e.preventDefault(); });

  // Prevent Ctrl+C or Cmd+C for the table element
  containerElement.addEventListener("keydown", (e) => {
    const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
    if (isCopy) e.preventDefault();
  });

  // Prevent clipboard copy via selectionchange if selection within the table
  document.addEventListener("copy", (e) => {
    const sel = document.getSelection();
    if (!sel) return;
    // if selection occurs inside our container, cancel copy
    if (containerElement.contains(sel.anchorNode) || containerElement.contains(sel.focusNode)) {
      e.preventDefault();
    }
  });

  // also disable dragstart on table rows
  containerElement.addEventListener("dragstart", (e)=> e.preventDefault());

  // Return the table reference for additional customization
  return table;
}
