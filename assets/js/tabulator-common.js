// Common Tabulator settings for all tables
function loadTable(elementId, jsonUrl, columns) {
  fetch(jsonUrl)
    .then(res => res.json())
    .then(data => {
      new Tabulator(elementId, {
        data: data,
        layout: "fitDataStretch",
        columns: columns,
        resizableColumns: true,
        movableColumns: true,
        placeholder: "--",
        initialSort: [{ column: "tier", dir: "asc" }],
      });
    });
}
