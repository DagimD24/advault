import MarketplaceExplorer from "@/components/MarketplaceExplorer";
import { OFFERS, COMPANY_OFFERS } from "@/lib/data";

export default function Home() {
  return (
    <MarketplaceExplorer 
      initialOffers={OFFERS} 
      initialCompanyOffers={COMPANY_OFFERS} 
    />
  );
}
