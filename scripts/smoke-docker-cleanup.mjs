import { spawn } from 'node:child_process';

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: false,
      ...opts,
      env: { ...process.env, ...(opts.env || {}) },
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} failed with code ${code}`));
    });
  });

try {
  await run('node', ['./scripts/smoke-cleanup.mjs'], {
    env: {
      SMOKE_MONGO_URI: process.env.SMOKE_MONGO_URI || 'mongodb://localhost:27017/placement_management',
    },
  });
} catch (err) {
  console.error('smoke:docker:cleanup failed');
  console.error(err.message);
  process.exit(1);
}

