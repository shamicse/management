import autocannon from 'autocannon';

const url = process.env.LOAD_URL || 'http://localhost:5000/api/health';
const connections = Number(process.env.LOAD_CONNECTIONS || 100);
const duration = Number(process.env.LOAD_DURATION_SEC || 30);
const pipelining = Number(process.env.LOAD_PIPELINING || 1);

console.log(`Running autocannon: ${url} connections=${connections} duration=${duration}s`);

const result = await autocannon({
  url,
  connections,
  duration,
  pipelining,
});

console.log('Load test summary:');
console.log({
  requests: result.requests,
  latency: result.latency,
  throughput: result.throughput,
  errors: result.errors,
  timeouts: result.timeouts,
});

if (result.errors > 0 || result.timeouts > 0) {
  process.exit(1);
}

