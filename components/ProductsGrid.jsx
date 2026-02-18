import React from 'react'
import ProductBox from './ProductBox'
import styled from 'styled-components';

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #6B6B6B;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    margin-bottom: 8px;
    color: #1C1C1E;
  }

  p {
    font-size: 0.95rem;
  }
`;

const ProductsGrid = ({ products }) => {
  return (
    <StyledProductsGrid>
      {products?.length > 0
        ? products.map((product, i) => (
            <ProductBox key={product._id} {...product} style={{ animationDelay: `${i * 0.05}s` }} />
          ))
        : (
          <EmptyState>
            <h3>No products found</h3>
            <p>Check back soon for new arrivals.</p>
          </EmptyState>
        )
      }
    </StyledProductsGrid>
  )
}

export default ProductsGrid
