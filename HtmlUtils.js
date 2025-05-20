function formatLLMOutputAsHTML(text) {
  let sectionIndex = 0;
  const sectionTitles = [];

  // Replace numbered section headers with anchors and collect for ToC
  const withSections = text.replace(/^([IVXL]+\..*)$/gm, (match, title) => {
    const id = `section-${sectionIndex}`;
    sectionTitles.push({ id, title });
    sectionIndex++;
    return `<h3 id="${id}">${title}</h3>`;
  });

  // Convert callout blocks
  const calloutsProcessed = withSections.replace(
    /(?:^|\n)(\* (Weakness|Legal Risk|Risk|Concern|Note)):(.*?)((?=\n\*|$))/gs,
    (_, label, tag, content) => {
      return `
<div class="callout"><span class="label">${tag}:</span>${content.trim()}</div>
`;
    }
  );

  // Final conversion of markdown features
  const finalContent = calloutsProcessed
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/(?:^|\n)-\s+(.*)/g, '<li>$1</li>')
    .replace(/\n{2,}/g, '</li></ul><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<ul><li>') + '</li></ul>';

  // Inline ToC (injected at top of .content)
  const toc = sectionTitles.length
    ? `<div class="toc-inline"><strong>Jump to Section:</strong><ul>` +
      sectionTitles.map(s => `<li><a href="#${s.id}">${s.title}</a></li>`).join('') +
      `</ul></div>`
    : '';

  // Full return with embedded styles
  return `
  <html>
    <head>
      <style>
        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9fafb;
          color: #333;
          margin: 0;
          padding: 2em;
          font-size: 1rem;
          line-height: 1.6;
        }
        .toc-inline {
          background-color: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 1em;
          border-radius: 6px;
          margin-bottom: 2em;
        }
        .toc-inline ul {
          list-style: none;
          padding-left: 1em;
        }
        .toc-inline li {
          margin: 0.5em 0;
        }
        .toc-inline a {
          color: #1e40af;
          text-decoration: none;
        }
        .toc-inline a:hover {
          text-decoration: underline;
        }
        h3 {
          margin-top: 2em;
          font-weight: 600;
          color: #1f2937;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 0.3em;
        }
        .callout {
          background-color: #f1f5f9;
          padding: 1em;
          margin: 1.2em 0;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
        }
        .label {
          font-weight: bold;
          color: #1e3a8a;
        }
        ul {
          padding-left: 1.2em;
          margin-bottom: 1.5em;
        }
        li {
          margin-bottom: 0.5em;
        }
        p {
          margin-bottom: 1.2em;
        }
        .download-btn {
          margin-bottom: 2em;
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 0.5em 1em;
          text-decoration: none;
          border-radius: 4px;
        }
        .download-btn:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <a class="download-btn" href="#" onclick="downloadHTML()">Download This Page</a>
      ${toc}
      ${finalContent}
      <script>
        function downloadHTML() {
          const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'IEP_Analysis.html';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      </script>
    </body>
  </html>`;
}
