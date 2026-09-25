const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '../frontend/src/locales');
const languages = ['en', 'ta', 'hi'];

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, el) => {
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...acc, ...getKeys(obj[el], `${prefix}${el}.`)];
    }
    return [...acc, `${prefix}${el}`];
  }, []);
}

function getPlaceholders(str) {
  const matches = str.match(/{{(.*?)}}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
}

function validate() {
  const enFile = path.join(localesPath, 'en', 'common.json');
  if (!fs.existsSync(enFile)) {
    console.error('English locale not found');
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  const enKeys = getKeys(enData);
  let hasErrors = false;

  languages.filter(l => l !== 'en').forEach(lang => {
    const langFile = path.join(localesPath, lang, 'common.json');
    if (!fs.existsSync(langFile)) {
      console.error(`Locale file missing for ${lang}`);
      hasErrors = true;
      return;
    }
    
    const langData = JSON.parse(fs.readFileSync(langFile, 'utf8'));
    const langKeys = getKeys(langData);

    // Check missing keys
    enKeys.forEach(key => {
      if (!langKeys.includes(key)) {
        console.error(`[${lang}] Missing key: ${key}`);
        hasErrors = true;
      } else {
        // Check placeholders
        const enVal = key.split('.').reduce((o, i) => o[i], enData);
        const langVal = key.split('.').reduce((o, i) => o[i], langData);
        
        const enPh = getPlaceholders(enVal);
        const langPh = getPlaceholders(langVal);

        enPh.forEach(ph => {
          if (!langPh.includes(ph)) {
            console.error(`[${lang}] Missing placeholder {{${ph}}} in key: ${key}`);
            hasErrors = true;
          }
        });
      }
    });
  });

  if (hasErrors) {
    console.error('Translation validation failed.');
    process.exit(1);
  } else {
    console.log('Translation validation passed.');
  }
}

validate();
