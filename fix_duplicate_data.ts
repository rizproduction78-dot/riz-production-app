const sanitizeData = () => {
  try {
    const rawLogs = localStorage.getItem('riz_logbook_entries_v2');
    if (rawLogs) {
      const logs = JSON.parse(rawLogs);
      const cleanedLogs = logs.filter((log: any) => !(log.staffName === 'Wahyu' && log.division === 'Admin' && log.activity && (log.activity.includes('skindrum') || log.activity.includes('Avanda') || log.activity.includes('Takel') || log.activity.includes('Hoist') || log.activity.includes('spicon'))));
      // Even better, just remove all Wahyu logs if they are exact duplicates of Wahyudin logs!
    }
  } catch(e) {}
}
