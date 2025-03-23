import plugin from 'tailwindcss/plugin';
import postcss from 'postcss';
import fs from 'fs';
import { CssInJs } from 'postcss-js';


export default plugin(({ addBase }) => {
    const path = require.resolve('tailwindcss/preflight');
    console.log({path});
    
    const preflightStyles = postcss.parse(
      fs.readFileSync(path, 'utf8'),
    );
  
    // Scope the selectors to my app
    preflightStyles.walkRules((rule) => {
      rule.selector = rule.selector
        .split(',')
        .map((selector) => `#wptelegram-settings ${selector}`)
        .join(',');
    });
  
    addBase(preflightStyles.nodes as CssInJs);
  })