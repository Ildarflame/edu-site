import { readFileSync } from 'fs';

const parsed = JSON.parse(readFileSync('/tmp/parsed-deals.json', 'utf8'));
const ourSlugs = readFileSync('/tmp/our-slugs.txt', 'utf8').trim().split('\n').map(s => s.trim());

// Create a set of normalized names we already have
const ourKeys = new Set();
ourSlugs.forEach(s => {
  ourKeys.add(s.replace(/-students?|-startups?|-oss|-education|-pro|-ai/g, '').replace(/-/g, ''));
});

// Also add known brand names
const extraKeys = ['github','notion','figma','jetbrains','vercel','aws','copilot','spotify',
  'coursera','openai','stripe','docker','supabase','sentry','mongodb','linear','digitalocean',
  'cloudflare','railway','slack','adobe','azure','youtube','apple','amazon','airtable','algolia',
  'alibaba','amplitude','anthropic','asana','auth0','bitbucket','calm','canva','circleci','clickup',
  'codacy','codecademy','codeium','comet','cursor','datacamp','datagrip','deepl','discord',
  'educative','evernote','firebase','framer','freecodecamp','gitkraken','gitlab','google',
  'grammarly','headspace','heroku','hubspot','huggingface','intercom','jasper','kaggle',
  'linkedin','linode','mailchimp','marvel','microsoft','monday','neon','netlify','oracle',
  'planetscale','pluralsight','popsql','postman','protopie','render','replit','scaleway',
  'segment','sendgrid','sketch','spline','tableplus','tabnine','termius','tower','travis',
  'twilio','unity','unreal','vercel','visualstudio','vultr','wandb','webflow','zendesk',
  'autodesk','axure','bootstrap','browserstack','configcat','dashlane','datadog','frontend',
  'gitpod','hulu','lambdatest','lastpass','mapbox','namecheap','perplexity','roboform',
  'squarespace','tableau','1password','polypane','icons8','iconscout','typeform','mailgun',
  'honeybadger','simpleanalytics','crowdin','adafruit','xojo','codescene','baremetrics',
  'gorails','interviewcake','workingcopy','coveralls','name','tech','envato','rhino','chaos',
  'shapr3d','lumion','qt','ptc','gurobi','minecraft','basecamp','blackfire','anydesk','prezi',
  'lucidchart','mubi'];
extraKeys.forEach(k => ourKeys.add(k));

const missing = [];
for (const d of parsed) {
  try {
    const domain = new URL(d.url).hostname.replace('www.', '').split('.')[0].toLowerCase();
    const nameKey = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const dominated = ourKeys.has(domain) || ourKeys.has(nameKey) ||
      [...ourKeys].some(k => nameKey.includes(k) && k.length > 3);

    if (!dominated) {
      missing.push({ name: d.name, url: d.url.slice(0, 70), benefits: d.benefits.slice(0, 60) });
    }
  } catch {
    // skip
  }
}

console.log(`Missing from our DB (${missing.length}):\n`);
missing.forEach((m, i) => console.log(`${i + 1}. ${m.name} | ${m.url} | ${m.benefits}`));
