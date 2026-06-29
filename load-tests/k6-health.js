import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const base = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const res = http.get(`${base}/api/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has ok status': (r) => (r.json('status') || '') === 'ok',
  });
  sleep(1);
}

