import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Introduction from "@/components/site/Introduction";
import Features from "@/components/site/Features";
import HowItWorks from "@/components/site/HowItWorks";
import Dashboard from "@/components/site/Dashboard";
import Alerts from "@/components/site/Alerts";
import TechStack from "@/components/site/TechStack";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Introduction />
      <Features />
      <HowItWorks />
      <Dashboard />
      <Alerts />
      <TechStack />
      <Footer />
    </main>
  );
};

export default Index;
