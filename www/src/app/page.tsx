import About from "~/components/landing/about";
import Components from "~/components/landing/components";
import Footer from "~/components/landing/footer";
import Header from "~/components/landing/header";
import Hero from "~/components/landing/hero";

export default function Home() {
  return (
    <div className={`
      mx-auto flex min-h-screen max-w-screen-xl flex-col items-center
      justify-center
    `}
    >
      <Header />
      <Hero />
      <About />
      <Components />
      <Footer />
    </div>
  );
}
