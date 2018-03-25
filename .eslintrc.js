// http://eslint.org/docs/user-guide/configuring
module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    env: {
      browser: true,
    },
    extends: 'airbnb-base',
    // add your custom rules here
    'rules': {
      'comma-dangle': 0,
      'linebreak-style': 0,
      'no-restricted-globals': 0,
      'no-unused-vars': 0,
      'arrow-parens': 0
    }
  }
