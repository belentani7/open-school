import { spawnSync } from 'node:child_process';

const git = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
if (git.status !== 0) {
  console.error('Archive guard: repository index unavailable');
  process.exit(1);
}

const files = git.stdout.split('\0').filter(Boolean);
const forbidden = files.filter((path) =>
  /(?:^|\/)open-school-secure-t-coupling\.zip$/i.test(path)
  || /\.(?:zip|7z|rar|bak)$/i.test(path)
  || /\.tar\.gz$/i.test(path)
);

if (forbidden.length) {
  console.error('Archive guard: blocked tracked archives:');
  for (const path of forbidden) console.error(' - ' + path);
  process.exit(1);
}

console.log('Archive guard: clean (no tracked ZIP or backup archives)');
