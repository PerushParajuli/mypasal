import { CartContextProvider } from "@/components/CartContext";
import { SessionProvider } from "next-auth/react";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    --cream: #F8F5F0;
    --charcoal: #1C1C1E;
    --amber: #D4821A;
    --amber-light: #F0A830;
    --muted: #6B6B6B;
    --border: #E2DDD6;
  }

  body {
    padding: 0;
    margin: 0;
    background-color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    color: var(--charcoal);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3 {
    font-family: 'Playfair Display', serif;
  }

  a { color: inherit; }
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} />
      </CartContextProvider>
    </SessionProvider>
  );
}
