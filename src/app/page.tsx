import AuthGate from "@/components/auth/AuthGate";
import TravelScrapbookApp from "@/features/scrapbook/TravelScrapbookApp";

export default function Home() {
  return (
    <AuthGate>
      <TravelScrapbookApp />
    </AuthGate>
  );
}