import { spawn } from 'child_process';

const args = process.argv.slice(2);
const filteredArgs = args.filter(arg => arg !== '--host' && arg !== '0.0.0.0');

// Add default host and port if not present
if (!filteredArgs.includes('-H') && !filteredArgs.includes('--hostname')) {
  filteredArgs.push('-H', '0.0.0.0');
}
if (!filteredArgs.includes('-p') && !filteredArgs.includes('--port')) {
  filteredArgs.push('-p', '3000');
}

const child = spawn('next', ['start', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});
