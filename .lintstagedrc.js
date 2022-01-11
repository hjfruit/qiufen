module.exports = {
  '**/*': 'npx --no-install prettier --write --ignore-unknown',
  '*.{js,ts,jsx,tsx}': 'npx --no-install eslint --fix',
}
