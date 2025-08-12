module.exports = {
  default: [
    '--require-module ts-node/register',
    '--require steps/**/*.ts',
    '--require support/world.ts',
    'features/**/*.feature'
  ].join(' ')
};
