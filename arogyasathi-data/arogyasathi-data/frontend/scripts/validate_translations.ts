import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf-8'));
const ta = JSON.parse(fs.readFileSync(path.join(localesDir, 'ta.json'), 'utf-8'));
const hi = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi.json'), 'utf-8'));

let errors = 0;
const keys = Object.keys(en);

function validateLanguage(langData: any, langName: string) {
  for (const key of keys) {
    if (!langData[key]) {
      console.error(`Missing key "${key}" in ${langName}.json`);
      errors++;
    } else {
      // check placeholders
      const enPlaceholders = (en[key].match(/\{[^}]+\}/g) || []).sort();
      const langPlaceholders = (langData[key].match(/\{[^}]+\}/g) || []).sort();
      if (JSON.stringify(enPlaceholders) !== JSON.stringify(langPlaceholders)) {
        console.error(`Placeholder mismatch in key "${key}" for ${langName}.json`);
        errors++;
      }
    }
  }
}

validateLanguage(ta, 'ta');
validateLanguage(hi, 'hi');

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} errors.`);
  process.exit(1);
} else {
  console.log('Translations validated successfully!');
  process.exit(0);
}
