const fs = require('fs');
const path = require('path');

const DATA_ROOT = path.join(__dirname, '..');

const errors = [];
const warnings = [];
let schemesChecked = 0;
let sourcesChecked = 0;

function validate() {
  console.log("Starting Scheme Data Validation...");

  // 1. Read master index
  const schemeIndexFile = path.join(DATA_ROOT, 'master', 'schemes.json');
  if (!fs.existsSync(schemeIndexFile)) {
    errors.push("Missing master/schemes.json");
    return finish();
  }

  let schemes = [];
  try {
    schemes = JSON.parse(fs.readFileSync(schemeIndexFile, 'utf8'));
  } catch (e) {
    errors.push("Invalid JSON in master/schemes.json");
    return finish();
  }

  const seenIds = new Set();
  schemes.forEach(schemeDef => {
    schemesChecked++;
    if (!schemeDef.scheme_id) {
      errors.push("Scheme missing scheme_id");
      return;
    }
    if (seenIds.has(schemeDef.scheme_id)) {
      errors.push(`Duplicate scheme_id found: ${schemeDef.scheme_id}`);
    }
    seenIds.add(schemeDef.scheme_id);

    // Validate related files exist
    const schemeFile = path.join(DATA_ROOT, 'master', schemeDef.scheme_file);
    if (!fs.existsSync(schemeFile)) errors.push(`Missing scheme file for ${schemeDef.scheme_id}: ${schemeDef.scheme_file}`);
    else {
      try {
        const data = JSON.parse(fs.readFileSync(schemeFile, 'utf8'));
        if (data.scheme_id !== schemeDef.scheme_id) {
          errors.push(`Mismatching scheme_id inside ${schemeDef.scheme_file}`);
        }
      } catch(e) {
        errors.push(`Invalid JSON in ${schemeDef.scheme_file}`);
      }
    }

    const ruleFile = path.join(DATA_ROOT, 'master', schemeDef.rule_file);
    if (!fs.existsSync(ruleFile)) warnings.push(`Missing rule file for ${schemeDef.scheme_id}: ${schemeDef.rule_file}`);

    if (schemeDef.status.includes('NEEDS_VERIFICATION') || schemeDef.status.includes('UNVERIFIED') || schemeDef.status.includes('OUTDATED')) {
      warnings.push(`${schemeDef.scheme_id} has unresolved status: ${schemeDef.status}`);
    }
  });

  // 2. Read sources
  const sourceRegistryFile = path.join(DATA_ROOT, 'sources', 'source_registry.json');
  if (fs.existsSync(sourceRegistryFile)) {
    try {
      const registry = JSON.parse(fs.readFileSync(sourceRegistryFile, 'utf8'));
      const seenSources = new Set();
      if (registry.sources) {
        registry.sources.forEach(src => {
          sourcesChecked++;
          if (seenSources.has(src.source_id)) {
            errors.push(`Duplicate source_id: ${src.source_id}`);
          }
          seenSources.add(src.source_id);
          
          if (!src.url || src.url === "UNKNOWN") {
            warnings.push(`Source ${src.source_id} is missing a URL.`);
          }
        });
      }
    } catch(e) {
      errors.push("Invalid JSON in source_registry.json");
    }
  } else {
    warnings.push("No source_registry.json found.");
  }

  finish();
}

function finish() {
  const output = {
    errors,
    warnings,
    summary: {
      schemes_checked: schemesChecked,
      sources_checked: sourcesChecked
    }
  };

  console.log(JSON.stringify(output, null, 2));

  if (errors.length > 0) {
    console.error("VALIDATION FAILED: Critical errors found.");
    process.exit(1);
  } else {
    console.log("Validation completed successfully.");
    process.exit(0);
  }
}

validate();
