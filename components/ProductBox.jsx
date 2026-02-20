import React, { useContext, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CartIcon from "@/icons/CartIcon";
import Link from "next/link";
import { CartContext } from "./CartContext";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProductWrapper = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #E2DDD6;
  transition: box-shadow 0.25s, transform 0.25s;
  animation: ${fadeUp} 0.4s ease both;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 12px 40px rgba(28, 28, 30, 0.12);
    transform: translateY(-4px);
  }
`;

const ImageBox = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: #F8F5F0;
  height: 200px;
  text-decoration: none;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 150px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.06);
  }
`;

const ProductInfoBox = styled.div`
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductTitle = styled(Link)`
  font-weight: 500;
  font-size: 0.95rem;
  color: #1C1C1E;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
  line-height: 1.4;
  flex: 1;
  &:hover { color: #D4821A; }
`;

const StockBadge = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${props => props.low ? '#E67E22' : '#2d6a4f'};
  background: ${props => props.low ? '#fef3e2' : '#e6f4ea'};
  border: 1px solid ${props => props.low ? '#f5c677' : '#b7dfca'};
  padding: 2px 8px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 10px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Price = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #1C1C1E;
  font-family: 'Playfair Display', serif;

  span {
    font-size: 0.75rem;
    font-weight: 400;
    font-family: 'DM Sans', sans-serif;
    color: #6B6B6B;
    margin-right: 2px;
  }
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${props => props.outofstock ? '#E2DDD6' : props.added ? '#1C1C1E' : '#D4821A'};
  color: ${props => props.outofstock ? '#999' : '#fff'};
  border: none;
  padding: 9px 14px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: ${props => props.outofstock ? 'not-allowed' : 'pointer'};
  transition: background 0.2s, transform 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.outofstock ? '#E2DDD6' : props.added ? '#333' : '#F0A830'};
    transform: ${props => props.outofstock ? 'none' : 'translateY(-1px)'};
  }

  svg { width: 15px; height: 15px; }
`;

const ProductBox = ({ _id, title, price, images, quantity }) => {
  const { addProduct, registerStock, isAtStockLimit, cartProducts, mounted } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const url = '/product/' + _id;

  useEffect(() => {
    if (_id && quantity !== undefined) {
      registerStock(_id, quantity);
    }
  }, [_id, quantity]);

  // Before mounted, show safe defaults to match SSR
  const currentQty = mounted ? cartProducts.filter(id => id === _id).length : 0;
  const outOfStock = quantity === 0;
  const atLimit = mounted ? isAtStockLimit(_id) : false;

  function handleAdd() {
    if (outOfStock || atLimit) return;
    addProduct(_id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  function getStockLabel() {
    if (quantity === 0) return null;
    if (quantity <= 5) return `Only ${quantity} left`;
    return null;
  }

  const stockLabel = getStockLabel();

  return (
    <ProductWrapper>
      <ImageBox href={url}>
        <img src={images?.[0]} alt={title} />
      </ImageBox>
      <ProductInfoBox>
        <ProductTitle href={url}>{title}</ProductTitle>
        {outOfStock && <StockBadge low>Out of stock</StockBadge>}
        {!outOfStock && stockLabel && <StockBadge low>{stockLabel}</StockBadge>}
        <PriceRow>
          <Price><span>Rs</span>{price}</Price>
          <AddBtn
            onClick={handleAdd}
            added={added ? 1 : 0}
            outofstock={outOfStock || atLimit ? 1 : 0}
          >
            {outOfStock
              ? 'Out of Stock'
              : atLimit
              ? `Max (${currentQty})`
              : added
              ? '✓ Added'
              : <><CartIcon /> Add</>
            }
          </AddBtn>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
};

export default ProductBox;