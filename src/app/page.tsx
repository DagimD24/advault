import MarketplaceExplorer from "@/components/MarketplaceExplorer";
import { OFFERS } from "@/lib/data";

export default function Home() {
  return (
    <MarketplaceExplorer 
      initialOffers={OFFERS} 
    />
  );
}
