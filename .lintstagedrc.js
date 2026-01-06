module.exports = {
  '*.js': [
    'eslint --fix',
    'git add'
  ],
  '*.html': [
    'htmlhint',
    'git add'
  ],
  '*.{css,scss}': [
    'npm run build:css',
    'git add css/output.css'
  ]
};

