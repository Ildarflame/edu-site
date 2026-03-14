const PACK_URL = 'https://education.github.com/pack/offers';

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function guessCategory(text) {
  const t = text.toLowerCase();
  if (/cloud|hosting|deploy|server|infrastructure|cdn/.test(t)) return 'Cloud';
  if (/design|ui|ux|prototype|graphics|3d|cad/.test(t)) return 'Design';
  if (/learn|course|tutorial|education|training|certif/.test(t)) return 'Learning';
  if (/ai|machine.?learning|gpt|llm|copilot/.test(t)) return 'AI';
  if (/music|video|stream|entertain|game/.test(t)) return 'Entertainment';
  if (/crm|project|task|productivity|workspace|email|form/.test(t)) return 'SaaS';
  return 'Dev';
}

export async function discover() {
  console.log('Fetching GitHub Education Pack offers...\n');

  try {
    const res = await fetch(PACK_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StudentPerksBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error('GitHub Pack returned ' + res.status);
      return [];
    }

    const html = await res.text();

    const offers = [];
    // Extract offer cards from GitHub Pack HTML structure
    const offerRegex = /<h3[^>]*class="[^"]*"[^>]*>([^<]+)<\/h3>[\s\S]*?<p[^>]*>([^<]+)<\/p>/gi;
    let match;
    while ((match = offerRegex.exec(html)) !== null) {
      const name = match[1].trim();
      const description = match[2].trim();
      if (name && description && name.length < 60) {
        offers.push({ name, description });
      }
    }

    // Fallback: data attributes
    if (offers.length === 0) {
      const nameRegex = /data-offer-name="([^"]+)"/gi;
      while ((match = nameRegex.exec(html)) !== null) {
        offers.push({ name: match[1].trim(), description: '' });
      }
    }

    // Fallback 2: JSON-like patterns in page data
    if (offers.length === 0) {
      const jsonRegex = /"name"\s*:\s*"([^"]{2,50})"\s*,\s*"description"\s*:\s*"([^"]{2,200})"/gi;
      while ((match = jsonRegex.exec(html)) !== null) {
        offers.push({ name: match[1].trim(), description: match[2].trim() });
      }
    }

    console.log('Found ' + offers.length + ' offers from GitHub Pack\n');

    return offers.map(o => {
      const slug = slugify(o.name) + '-students';
      return {
        slug,
        name: o.name,
        source: 'github-pack',
        sourceUrl: PACK_URL,
        category: guessCategory(o.description),
        audiences: ['Students'],
        tagline: o.description.slice(0, 120) || (o.name + ' — free via GitHub Education'),
        value: 'Free via GitHub Pack',
        url: PACK_URL,
        hasEducationSignal: true,
      };
    });
  } catch (err) {
    console.error('GitHub Pack fetch error: ' + err.message);
    return [];
  }
}
