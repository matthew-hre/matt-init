import About from "~/components/landing/about";
import Components from "~/components/landing/components";
import Footer from "~/components/landing/footer";
import Header from "~/components/landing/header";
import Hero from "~/components/landing/hero";

export default function Home() {
  return (
    <div className="max-w-screen-xl flex flex-col items-center justify-center mx-auto min-h-screen">
      <Header />
      <Hero />
      <About />
      <Components />
      <Footer />
    </div>
  );
}
