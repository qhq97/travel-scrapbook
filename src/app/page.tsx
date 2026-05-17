import AuthGate from "@/components/AuthGate";
import TravelScrapbookMVP from "@/components/TravelScrapbookMVP";

export default function Home() {
  return (
    <AuthGate>
      <TravelScrapbookMVP />
    </AuthGate>
  );
}