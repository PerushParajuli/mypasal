import React from "react";
import styled from "styled-components";
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

const Section = styled.section`
  padding: 60px 0 80px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
`;

const TitleGroup = styled.div``;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #D4821A;
  margin-bottom: 6px;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  margin: 0;
  font-weight: 700;
  color: #1C1C1E;
  letter-spacing: -0.5px;
`;

const ViewAll = styled.a`
  font-size: 0.9rem;
  font-weight: 500;
  color: #D4821A;
  text-decoration: none;
  border-bottom: 1.5px solid transparent;
  transition: border-color 0.2s;
  padding-bottom: 2px;
  white-space: nowrap;

  &:hover {
    border-color: #D4821A;
  }
`;

const NewProducts = ({ products }) => {
  return (
    <Section>
      <Center>
        <SectionHeader>
          <TitleGroup>
            <Label>Just dropped</Label>
            <Title>New Arrivals</Title>
          </TitleGroup>
          <ViewAll href="/products">View all products →</ViewAll>
        </SectionHeader>
        <ProductsGrid products={products} />
      </Center>
    </Section>
  );
};

export default NewProducts;
