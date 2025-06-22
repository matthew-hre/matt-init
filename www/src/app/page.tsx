import About from "./(components)/about";
import Components from "./(components)/components";
import Footer from "./(components)/footer";
import Header from "./(components)/header";
import Hero from "./(components)/hero";

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
