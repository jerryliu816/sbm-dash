

function getEmailHistogramData() {
  const now = new Date();
  const daysBack = 14;
  const counts = {};

  for (let i = 0; i < daysBack; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const key = day.toISOString().slice(0, 10); // YYYY-MM-DD
    counts[key] = 0;
  }

  const query = `after:${formatDate(new Date(now.getTime() - daysBack * 86400000))}`;
  const threads = GmailApp.search(query);

  for (const thread of threads) {
    const messages = thread.getMessages();
    for (const msg of messages) {
      const date = msg.getDate();
      const key = date.toISOString().slice(0, 10);
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    }
  }

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy/MM/dd');
}

