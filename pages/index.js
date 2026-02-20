import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

// ── Animations ──────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ── Hero ─────────────────────────────────────────────────────
const HeroSection = styled.section`
  background: #1C1C1E;
  min-height: 88vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 120px 0 80px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,130,26,0.18) 0%, transparent 70%);
    right: -100px;
    top: -100px;
    pointer-events: none;
  }
`;

const HeroInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
  width: 100%;
`;

const HeroEyebrow = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #D4821A;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.6s ease both;
`;

const HeroHeadline = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -2px;
  margin: 0 0 28px;
  animation: ${fadeUp} 0.7s 0.1s ease both;
  opacity: 0;
  animation-fill-mode: forwards;

  em {
    font-style: italic;
    background: linear-gradient(90deg, #D4821A, #F0A830, #D4821A);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const HeroSub = styled.p`
  font-size: 1.15rem;
  color: rgba(255,255,255,0.55);
  max-width: 480px;
  line-height: 1.7;
  margin: 0 0 44px;
  animation: ${fadeUp} 0.7s 0.2s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const HeroCTAs = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.7s 0.3s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const PrimaryBtn = styled(Link)`
  background: #D4821A;
  color: #fff;
  text-decoration: none;
  padding: 15px 32px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  transition: background 0.2s, transform 0.15s;
  &:hover { background: #F0A830; transform: translateY(-2px); }
`;

const SecondaryBtn = styled(Link)`
  background: rgba(255,255,255,0.07);
  color: #fff;
  text-decoration: none;
  padding: 15px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid rgba(255,255,255,0.15);
  transition: background 0.2s, transform 0.15s;
  &:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
`;

const HeroStats = styled.div`
  display: flex;
  gap: 48px;
  margin-top: 72px;
  padding-top: 40px;
  border-top: 1px solid rgba(255,255,255,0.1);
  animation: ${fadeUp} 0.7s 0.4s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const Stat = styled.div`
  div:first-child {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    color: #D4821A;
  }
  div:last-child {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
`;

// ── Page wrapper ──────────────────────────────────────────────
const PageBg = styled.div`
  background: #F8F5F0;
  min-height: 100vh;
`;

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 40px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const SectionEyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #D4821A;
  margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1C1C1E;
  margin: 0;
  letter-spacing: -0.5px;
`;

const ViewAll = styled(Link)`
  color: #D4821A;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  white-space: nowrap;
  padding-bottom: 2px;
  border-bottom: 1.5px solid #D4821A;
  transition: color 0.2s, border-color 0.2s;
  &:hover { color: #F0A830; border-color: #F0A830; }
`;

// ── Categories ────────────────────────────────────────────────
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled(Link)`
  background: #fff;
  border: 1px solid #E2DDD6;
  border-radius: 14px;
  padding: 24px 12px;
  text-decoration: none;
  text-align: center;
  transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &:hover {
    box-shadow: 0 8px 32px rgba(28,28,30,0.1);
    transform: translateY(-4px);
    border-color: #D4821A;
  }
`;

const CategoryEmoji = styled.div`
  font-size: 1.8rem;
  line-height: 1;
`;

const CategoryName = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: 0.3px;
`;

// ── Products grid ─────────────────────────────────────────────
const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

// ── Divider ───────────────────────────────────────────────────
const Divider = styled.div`
  height: 1px;
  background: #E2DDD6;
  max-width: 1100px;
  margin: 0 auto;
`;

// ── Data ──────────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Electronics",   slug: "electronics",   emoji: "💻" },
  { name: "Clothing",      slug: "clothing",       emoji: "👕" },
  { name: "Home & Living", slug: "home & living",  emoji: "🏠" },
  { name: "Books",         slug: "books",          emoji: "📚" },
  { name: "Sports",        slug: "sports",         emoji: "⚽" },
  { name: "Beauty",        slug: "beauty",         emoji: "✨" },
];

// ── Page ──────────────────────────────────────────────────────
export default function Home({ newProducts }) {
  return (
    <PageBg>
      <Header />

      {/* Hero */}
      <HeroSection>
        <HeroInner>
          <HeroEyebrow>Welcome to myPasal</HeroEyebrow>
          <HeroHeadline>
            Shop smarter,<br />
            live <em>better.</em>
          </HeroHeadline>
          <HeroSub>
            Curated products delivered to your door across Nepal.
            Quality you can trust, prices you'll love.
          </HeroSub>
          <HeroCTAs>
            <PrimaryBtn href="/products">Shop Now →</PrimaryBtn>
            <SecondaryBtn href="/categories">Browse Categories</SecondaryBtn>
          </HeroCTAs>
          <HeroStats>
            <Stat>
              <div>100%</div>
              <div>Authentic Products</div>
            </Stat>
            <Stat>
              <div>Fast</div>
              <div>Nepal-wide Delivery</div>
            </Stat>
            <Stat>
              <div>Easy</div>
              <div>Returns & Support</div>
            </Stat>
          </HeroStats>
        </HeroInner>
      </HeroSection>

      {/* Categories */}
      <Section>
        <SectionHeader>
          <div>
            <SectionEyebrow>Explore</SectionEyebrow>
            <SectionTitle>Shop by Category</SectionTitle>
          </div>
          <ViewAll href="/categories">All categories →</ViewAll>
        </SectionHeader>
        <CategoriesGrid>
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.slug} href={`/products?category=${cat.slug}`}>
              <CategoryEmoji>{cat.emoji}</CategoryEmoji>
              <CategoryName>{cat.name}</CategoryName>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>

      <Divider />

      {/* New Arrivals */}
      <Section>
        <SectionHeader>
          <div>
            <SectionEyebrow>Just dropped</SectionEyebrow>
            <SectionTitle>New Arrivals</SectionTitle>
          </div>
          <ViewAll href="/products">View all products →</ViewAll>
        </SectionHeader>
        <ProductsGrid>
          {newProducts.map(product => (
            <ProductBox key={product._id} {...product} />
          ))}
        </ProductsGrid>
      </Section>
    </PageBg>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
  const newProducts = await Product.find({}, null, { sort: { _id: -1 }, limit: 10 });
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}