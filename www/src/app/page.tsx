import About from "./(components)/about";
import Components from "./(components)/components";
import Footer from "./(components)/footer";
import Header from "./(components)/header";
import Hero from "./(components)/hero";

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
