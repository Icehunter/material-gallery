const path = require('path');
const { cleanTask, defaultCleanPaths, eslintTask, tscTask, jestTask } = require('just-scripts');
const { task, series, parallel, argv } = require('just-task');

task(
  'clean',
  cleanTask({
    paths: [...defaultCleanPaths(), 'lib', 'build', 'storybook-static']
  })
);

task(
  'ts:umd',
  tscTask({
    module: 'umd',
    outDir: path.resolve(__dirname, 'lib'),
    project: path.resolve(__dirname, 'tsconfig.build.json')
  })
);
task(
  'ts:esnext',
  tscTask({
    module: 'esnext',
    outDir: path.resolve(__dirname, 'lib/esm'),
    project: path.resolve(__dirname, 'tsconfig.build.json')
  })
);
task('ts', parallel('ts:umd', 'ts:esnext'));
task(
  'lint',
  eslintTask({
    // prettier is part of the eslint config file
    // prettier rules will be applied during this process in order
    // they will not override or conflict with eslint
    fix: true
  })
);
task('build', series('lint', 'ts'));

task('test', () => {
  return jestTask({ ...argv() });
});
