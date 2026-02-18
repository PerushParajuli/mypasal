import Header from "@/components/Header";
import Center from "@/components/Center";
import styled, { keyframes } from "styled-components";
import Link from "next/link";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: #1C1C1E;
  color: #fff;
  padding: 56px 0 44px;
  margin-bottom: 60px;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #D4821A;
  margin-bottom: 10px;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-bottom: 80px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  align-items: flex-end;
  text-decoration: none;
  height: 200px;
  border-radius: 16px;
  padding: 24px;
  background: ${props => props.bg || '#2C2416'};
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: ${props => props.delay || '0s'};
  border: 1px solid #E2DDD6;
  transition: transform 0.25s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(28,28,30,0.15);
  }

  &::before {
    content: '${props => props.icon || '🛍️'}';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 2.5rem;
    opacity: 0.6;
  }
`;

const CategoryName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.dark ? '#1C1C1E' : '#fff'};
  margin: 0 0 4px;
`;

const CategoryCount = styled.p`
  font-size: 0.8rem;
  color: ${props => props.dark ? '#6B6B6B' : 'rgba(255,255,255,0.65)'};
  margin: 0;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6B6B6B;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: #1C1C1E;
    margin-bottom: 8px;
  }
`;

// Placeholder categories — replace with real DB data when you add a Category model
const PLACEHOLDER_CATEGORIES = [
  { name: "Electronics", icon: "⚡", bg: "#1C1C1E", count: null },
  { name: "Clothing", icon: "👗", bg: "#F8F5F0", dark: true, count: null },
  { name: "Home & Living", icon: "🏠", bg: "#2C2416", count: null },
  { name: "Books", icon: "📚", bg: "#F0A830", dark: true, count: null },
  { name: "Sports", icon: "⚽", bg: "#1C1C1E", count: null },
  { name: "Beauty", icon: "✨", bg: "#F8F5F0", dark: true, count: null },
];

export default function CategoriesPage() {
  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Label>Browse by</Label>
          <PageTitle>Categories</PageTitle>
        </Center>
      </PageHeader>
      <Center>
        <Grid>
          {PLACEHOLDER_CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.name}
              href={`/products?category=${cat.name.toLowerCase()}`}
              bg={cat.bg}
              icon={cat.icon}
              delay={`${i * 0.07}s`}
            >
              <div>
                <CategoryName dark={cat.dark}>{cat.name}</CategoryName>
                <CategoryCount dark={cat.dark}>
                  {cat.count !== null ? `${cat.count} products` : 'Browse all'}
                </CategoryCount>
              </div>
            </CategoryCard>
          ))}
        </Grid>
      </Center>
    </PageWrapper>
  );
}
