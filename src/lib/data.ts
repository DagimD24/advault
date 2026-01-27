import fs from 'fs';
import path from 'path';

function loadData(filename: string) {
  try {
    const filePath = path.join(process.cwd(), filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

// 1. Load standalone profiles
export const OFFERS = loadData('creators.jsonl');

// 2. Load relational data
const brandProfilesRaw = loadData('brands.jsonl');
const campaignsRaw = loadData('campaigns.jsonl');

const brandProfiles = Object.fromEntries(
  brandProfilesRaw.map(p => [p.id, p])
);

// 3. Join Campaigns with Brand Profiles
export const COMPANY_OFFERS = campaignsRaw.map(campaign => {
  const brand = brandProfiles[campaign.brandId];
  return {
    ...campaign,
    brand,
  };
});
