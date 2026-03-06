import * as fs from "fs";
import * as path from "path";

const LOGOS_DIR = path.resolve(__dirname, "..", "public", "logos");

const icons: Record<string, string> = {
  gitkraken: "gitkraken",
  termius: "termius",
  popsql: "popsql",
  "tower-git": "git",
  codacy: "codacy",
  "travis-ci": "travisci",
  circleci: "circleci",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  postman: "postman",
  insomnia: "insomnia",
  tableplus: "tableplus",
  datagrip: "jetbrains",
  "visual-studio": "visualstudio",
  unity: "unity",
  "unreal-engine": "unrealengine",
  planetscale: "planetscale",
  neon: "neon",
  turso: "turso",
  anthropic: "anthropic",
  "google-cloud": "googlecloud",
  huggingface: "huggingface",
  wandb: "weightsandbiases",
  "comet-ml": "cometml",
  "neptune-ai": "neptune",
  replit: "replit",
  cursor: "cursor",
  tabnine: "tabnine",
  codeium: "codeium",
  deepl: "deepl",
  grammarly: "grammarly",
  jasper: "jasper",
  replicate: "replicate",
  kaggle: "kaggle",
  hetzner: "hetzner",
  linode: "linode",
  vultr: "vultr",
  render: "render",
  "fly-io": "flydotio",
  netlify: "netlify",
  heroku: "heroku",
  "ibm-cloud": "ibm",
  "oracle-cloud": "oracle",
  "alibaba-cloud": "alibabacloud",
  scaleway: "scaleway",
  back4app: "back4app",
  firebase: "firebase",
  airtable: "airtable",
  asana: "asana",
  monday: "monday",
  clickup: "clickup",
  intercom: "intercom",
  zendesk: "zendesk",
  hubspot: "hubspot",
  mailchimp: "mailchimp",
  sendgrid: "sendgrid",
  twilio: "twilio",
  auth0: "auth0",
  algolia: "algolia",
  segment: "segment",
  amplitude: "amplitude",
  loom: "loom",
  canva: "canva",
  sketch: "sketch",
  invision: "invision",
  framer: "framer",
  webflow: "webflow",
  zeplin: "zeplin",
  marvel: "marvelapp",
  protopie: "protopie",
  spline: "spline",
  educative: "educative",
  pluralsight: "pluralsight",
  datacamp: "datacamp",
  codecademy: "codecademy",
  udemy: "udemy",
  linkedin: "linkedin",
  freecodecamp: "freecodecamp",
  edx: "edx",
  brilliant: "brilliant",
  discord: "discord",
  headspace: "headspace",
  calm: "calm",
  duolingo: "duolingo",
  microsoft: "microsoft",
};

function makePlaceholder(slug: string): string {
  const letter = slug.charAt(0).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="#6366f1" opacity="0.15"/><text x="12" y="16.5" text-anchor="middle" font-size="14" font-family="system-ui,sans-serif" font-weight="600" fill="#6366f1">${letter}</text></svg>`;
}

async function downloadLogo(slug: string, iconName: string): Promise<string> {
  const filepath = path.join(LOGOS_DIR, `${slug}.svg`);

  if (fs.existsSync(filepath)) {
    return "skipped";
  }

  // Try simple-icons
  const url1 = `https://api.iconify.design/simple-icons/${iconName}.svg`;
  const res1 = await fetch(url1);
  if (res1.ok) {
    const svg = await res1.text();
    if (svg.includes("<svg")) {
      fs.writeFileSync(filepath, svg);
      return "downloaded";
    }
  }

  // Try mdi
  const url2 = `https://api.iconify.design/mdi/${iconName}.svg`;
  const res2 = await fetch(url2);
  if (res2.ok) {
    const svg = await res2.text();
    if (svg.includes("<svg")) {
      fs.writeFileSync(filepath, svg);
      return "downloaded-mdi";
    }
  }

  // Placeholder
  fs.writeFileSync(filepath, makePlaceholder(slug));
  return "placeholder";
}

async function main() {
  let downloaded = 0;
  let placeholder = 0;
  let skipped = 0;

  const entries = Object.entries(icons);

  // Process in batches of 5 to avoid overwhelming the API
  for (let i = 0; i < entries.length; i += 5) {
    const batch = entries.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(async ([slug, iconName]) => {
        const result = await downloadLogo(slug, iconName);
        return { slug, result };
      })
    );

    for (const { slug, result } of results) {
      if (result === "skipped") {
        skipped++;
      } else if (result === "placeholder") {
        placeholder++;
        console.log(`  PLACEHOLDER: ${slug}.svg`);
      } else {
        downloaded++;
        console.log(`  OK: ${slug}.svg`);
      }
    }
  }

  console.log(`\nDone! Downloaded: ${downloaded}, Placeholder: ${placeholder}, Skipped: ${skipped}`);
}

main().catch(console.error);
