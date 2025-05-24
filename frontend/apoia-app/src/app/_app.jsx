import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }) {
  
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
}
