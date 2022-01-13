module.exports = {
  '*.{js,ts,jsx,tsx}': 'npx --no-install eslint --fix',
  '**/*': 'npx --no-install prettier --write --ignore-unknown',
}
