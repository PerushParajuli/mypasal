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

const ProductCount = styled.p`
  color: rgba(255,255,255,0.45);
  margin: 8px 0 0;
  font-size: 0.9rem;
`;

const GridSection = styled.div`
  padding-bottom: 80px;
  animation: ${fadeIn} 0.5s ease both;
`;

const ProductsPage = ({ products }) => {
  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Label>Shop</Label>
          <PageTitle>All Products</PageTitle>
          <ProductCount>{products?.length || 0} items available</ProductCount>
        </Center>
      </PageHeader>
      <Center>
        <GridSection>
          <ProductsGrid products={products} />
        </GridSection>
      </Center>
    </PageWrapper>
  );
};

export default ProductsPage;

export async function getServerSideProps() {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { '_id': -1 } });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  }
}
