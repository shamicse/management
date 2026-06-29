import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dockerExe =
  process.env.DOCKER_EXE ||
  (existsSync('C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe')
    ? 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe'
    : 'docker');

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
  console.log('Running smoke test against Docker stack...');

  const dockerConfig = resolve('.docker-tmp');
  if (!existsSync(dockerConfig)) {
    mkdirSync(dockerConfig, { recursive: true });
  }
  writeFileSync(resolve(dockerConfig, 'config.json'), '{}', 'utf8');
  const dockerEnv = { DOCKER_CONFIG: dockerConfig };

  await run(dockerExe, ['compose', 'up', '--build', '-d'], { env: dockerEnv });
  await run(dockerExe, ['compose', 'exec', '-T', 'backend', 'npm', 'run', 'seed'], { env: dockerEnv });

  // Run existing smoke script with docker-safe defaults.
  await run('node', ['./scripts/smoke.mjs'], {
    env: {
      SMOKE_API_BASE: process.env.SMOKE_API_BASE || 'http://localhost:5000/api',
      SMOKE_MONGO_URI: process.env.SMOKE_MONGO_URI || 'mongodb://localhost:27017/placement_management',
    },
  });
} catch (err) {
  console.error('smoke:docker failed');
  console.error(err.message);
  process.exit(1);
}

