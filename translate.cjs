const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const pairs = [
  ['Traffic Filtering Rules', 'traffic_filtering'],
  ['Geo-Blocking', 'geo_blocking'],
  ['Create Policy', 'create_policy'],
  ['Granular block/allow policies based on domain, IP, or keywords.', 'granular_policies'],
  ['Target Element', 'target_element'],
  ['Applied To', 'applied_to'],
  ['Action', 'action'],
  ['Current Status', 'current_status'],
  ['SYNC BLOCKLISTS', 'sync_blocklists'],
  ['Real-time Interception Logs', 'real_time_logs'],
  ['Live monitoring across all active nodes.', 'live_monitoring'],
  ['Search domain or IP...', 'search_domain'],
  ['EXPORT CSV', 'export_csv'],
  ['QUERY DEBUGGER', 'query_debugger'],
  ['System Settings', 'system_settings'],
  ['Dashboard Auto-Refresh', 'dashboard_refresh'],
  ['Enable real-time analytics data fetching through WebSockets.', 'enable_realtime'],
  ['DNS Resolution Cache', 'dns_cache'],
  ['Clear the current cache to resolve stale local records or upstream propagation issues.', 'clear_cache'],
  ['FLUSH CACHE', 'flush_cache'],
  ['FLUSHING...', 'flushing'],
  ['Daily Summary Reports', 'daily_reports'],
  ['Receive automated email notifications of daily traffic and health.', 'receive_reports'],
  ['Report Delivery Email', 'report_email'],
  ['SAVE', 'save'],
  ['Deep Packet Inspection \\(DPI\\)', 'dpi_title'],
  ['Enable granular traffic protocol analysis \\(DNS, HTTP, HTTPS, QUIC\\) in the Traffic Analysis tab.', 'dpi_desc'],
  ['Simulate DNS Query \\(Domain\\)', 'simulate_dns'],
  ['START SYNC', 'start_sync'],
  ['SYNCING...', 'syncing'],
  ['Disclaimer', 'disclaimer'],
  ['External URL \\(Hosts Format\\)', 'external_url'],
  ['Provide a URL to a community-maintained hosts file or regex list.', 'provide_url']
];

for (const [en, key] of pairs) {
  // simple replace for >text< inside JSX
  code = code.replace(new RegExp(`>\\s*${en}\\s*<`, 'g'), `>{t('${key}')}<`);
  
  // also handle placeholders
  code = code.replace(new RegExp(`placeholder="${en}"`, 'g'), `placeholder={t('${key}')}`);
}

code = code.replace('>Cancel<', `>{t('cancel')}<`);
code = code.replace('>TRACE<', `>{t('trace')}<`);
code = code.replace('>TRACING...<', `>{t('tracing')}<`);
code = code.replace('>Trace<', `>{t('trace')}<`);
code = code.replace('>Tracing...<', `>{t('tracing')}<`);

fs.writeFileSync('src/App.tsx', code);
console.log('Done!');
