import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`min-height: 100vh;`;

const PageHeader = styled.div`
  background: #1C1C1E;
  color: #fff;
  padding: 56px 0 44px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 36px 0 28px;
    margin-bottom: 36px;
  }
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
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductCount = styled.p`
  color: rgba(255,255,255,0.45);
  margin: 8px 0 0;
  font-size: 0.9rem;
`;

const GridSection = styled.div`
  padding-bottom: 80px;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: 768px) {
    padding-bottom: 48px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6B6B6B;

  div { font-size: 3rem; margin-bottom: 16px; }
  h3 {
    font-family: 'Playfair Display', serif;
    color: #1C1C1E;
    margin-bottom: 8px;
    font-size: 1.4rem;
  }
  p { font-size: 0.95rem; }
`;

const ProductsPage = ({ products, category, search }) => {
  function getTitle() {
    if (search) return `Results for "${search}"`;
    if (category) return category;
    return 'All Products';
  }

  function getLabel() {
    if (search) return 'Search';
    return 'Shop';
  }

  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Label>{getLabel()}</Label>
          <PageTitle>{getTitle()}</PageTitle>
          <ProductCount>{products?.length || 0} items found</ProductCount>
        </Center>
      </PageHeader>
      <Center>
        <GridSection>
          {products?.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <NoResults>
              <div>🔍</div>
              <h3>No products found</h3>
              <p>Try a different search term or browse all products.</p>
            </NoResults>
          )}
        </GridSection>
      </Center>
    </PageWrapper>
  );
};

export default ProductsPage;

export async function getServerSideProps({ query }) {
  await mongooseConnect();

  const filter = {};

  if (query.category) {
    filter.category = { $regex: new RegExp(`^${query.category}$`, 'i') };
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filter, null, { sort: { '_id': -1 } });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      category: query.category || null,
      search: query.search || null,
    }
  };
}