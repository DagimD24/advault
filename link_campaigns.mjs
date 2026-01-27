import fs from 'fs';
import { execSync } from 'child_process';

const getBrandMapping = () => {
  try {
    const output = execSync('npx convex run brands:list', { encoding: 'utf8' });
    const brands = JSON.parse(output.substring(output.indexOf('[')));
    const mapping = {};
    brands.forEach(b => {
      mapping[b.name] = b._id;
    });
    return mapping;
  } catch (err) {
    console.error("Error fetching brands from Convex:", err);
    process.exit(1);
  }
};

const mapping = getBrandMapping();
const campaigns = fs.readFileSync('campaigns.jsonl', 'utf8').trim().split('\n').map(JSON.parse);

const updatedCampaigns = campaigns.map(c => {
  const brandId = mapping[c.brandName];
  if (!brandId) {
    console.warn(`Warning: No brand ID found for ${c.brandName}`);
    return c;
  }
  const { brandName, ...rest } = c;
  return { ...rest, brandId };
});

fs.writeFileSync('campaigns.jsonl', updatedCampaigns.map(c => JSON.stringify(c)).join('\n') + '\n');
console.log("Successfully updated campaigns.jsonl with brandId!");
