#!/bin/bash
# Download SVG logos from Iconify API for new deals
LOGOS_DIR="/Users/ildarflame/Desktop/edu-site/public/logos"

# Map: filename -> simple-icons name (or mdi name)
declare -A ICONS=(
  ["gitkraken"]="gitkraken"
  ["termius"]="termius"
  ["popsql"]="popsql"
  ["tower-git"]="git"
  ["codacy"]="codacy"
  ["travis-ci"]="travisci"
  ["circleci"]="circleci"
  ["gitlab"]="gitlab"
  ["bitbucket"]="bitbucket"
  ["postman"]="postman"
  ["insomnia"]="insomnia"
  ["tableplus"]="tableplus"
  ["datagrip"]="jetbrains"
  ["visual-studio"]="visualstudio"
  ["unity"]="unity"
  ["unreal-engine"]="unrealengine"
  ["planetscale"]="planetscale"
  ["neon"]="neon"
  ["turso"]="turso"
  ["anthropic"]="anthropic"
  ["google-cloud"]="googlecloud"
  ["huggingface"]="huggingface"
  ["wandb"]="weightsandbiases"
  ["comet-ml"]="cometml"
  ["neptune-ai"]="neptune"
  ["replit"]="replit"
  ["cursor"]="cursor"
  ["tabnine"]="tabnine"
  ["codeium"]="codeium"
  ["deepl"]="deepl"
  ["grammarly"]="grammarly"
  ["jasper"]="jasper"
  ["replicate"]="replicate"
  ["kaggle"]="kaggle"
  ["hetzner"]="hetzner"
  ["linode"]="linode"
  ["vultr"]="vultr"
  ["render"]="render"
  ["fly-io"]="flydotio"
  ["netlify"]="netlify"
  ["heroku"]="heroku"
  ["ibm-cloud"]="ibm"
  ["oracle-cloud"]="oracle"
  ["alibaba-cloud"]="alibabacloud"
  ["scaleway"]="scaleway"
  ["back4app"]="back4app"
  ["firebase"]="firebase"
  ["airtable"]="airtable"
  ["asana"]="asana"
  ["monday"]="monday"
  ["clickup"]="clickup"
  ["intercom"]="intercom"
  ["zendesk"]="zendesk"
  ["hubspot"]="hubspot"
  ["mailchimp"]="mailchimp"
  ["sendgrid"]="sendgrid"
  ["twilio"]="twilio"
  ["auth0"]="auth0"
  ["algolia"]="algolia"
  ["segment"]="segment"
  ["amplitude"]="amplitude"
  ["loom"]="loom"
  ["canva"]="canva"
  ["sketch"]="sketch"
  ["invision"]="invision"
  ["framer"]="framer"
  ["webflow"]="webflow"
  ["zeplin"]="zeplin"
  ["marvel"]="marvelapp"
  ["protopie"]="protopie"
  ["spline"]="spline"
  ["educative"]="educative"
  ["pluralsight"]="pluralsight"
  ["datacamp"]="datacamp"
  ["codecademy"]="codecademy"
  ["udemy"]="udemy"
  ["linkedin"]="linkedin"
  ["freecodecamp"]="freecodecamp"
  ["edx"]="edx"
  ["brilliant"]="brilliant"
  ["discord"]="discord"
  ["headspace"]="headspace"
  ["calm"]="calm"
  ["duolingo"]="duolingo"
  ["microsoft"]="microsoft"
)

downloaded=0
placeholder=0
skipped=0

for slug in "${!ICONS[@]}"; do
  filepath="$LOGOS_DIR/${slug}.svg"

  # Skip if already exists
  if [ -f "$filepath" ]; then
    skipped=$((skipped + 1))
    continue
  fi

  icon_name="${ICONS[$slug]}"
  url="https://api.iconify.design/simple-icons/${icon_name}.svg"

  # Try downloading
  http_code=$(curl -s -o "$filepath" -w "%{http_code}" "$url")

  if [ "$http_code" = "200" ] && [ -s "$filepath" ]; then
    downloaded=$((downloaded + 1))
    echo "  OK: ${slug}.svg (simple-icons/${icon_name})"
  else
    # Try mdi
    url2="https://api.iconify.design/mdi/${icon_name}.svg"
    http_code2=$(curl -s -o "$filepath" -w "%{http_code}" "$url2")

    if [ "$http_code2" = "200" ] && [ -s "$filepath" ]; then
      downloaded=$((downloaded + 1))
      echo "  OK: ${slug}.svg (mdi/${icon_name})"
    else
      # Create placeholder SVG with first letter
      first_letter=$(echo "${slug}" | head -c 1 | tr '[:lower:]' '[:upper:]')
      cat > "$filepath" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><rect width="24" height="24" rx="4" fill="#6366f1" opacity="0.15"/><text x="12" y="16.5" text-anchor="middle" font-size="14" font-family="system-ui,sans-serif" font-weight="600" fill="#6366f1">${first_letter}</text></svg>
SVGEOF
      placeholder=$((placeholder + 1))
      echo "  PLACEHOLDER: ${slug}.svg"
    fi
  fi
done

echo ""
echo "Done! Downloaded: $downloaded, Placeholder: $placeholder, Skipped: $skipped"
