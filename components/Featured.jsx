import React, { useContext } from "react";
import Center from "./Center";
import styled, { keyframes } from "styled-components";
import ButtonLink from "./ButtonLink";
import CartIcon from "@/icons/CartIcon";
import { CartContext } from "./CartContext";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Bg = styled.div`
  background: linear-gradient(135deg, #1C1C1E 0%, #2C2416 60%, #1C1C1E 100%);
  color: #fff;
  padding: 80px 0 70px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(212, 130, 26, 0.15) 0%, transparent 65%);
    pointer-events: none;
  }
`;

const Tag = styled.div`
  display: inline-block;
  background: rgba(212, 130, 26, 0.2);
  color: #F0A830;
  border: 1px solid rgba(212, 130, 26, 0.4);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 20px;
  margin-bottom: 22px;
  animation: ${fadeIn} 0.6s ease both;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-weight: 700;
  font-size: 3.4rem;
  line-height: 1.12;
  letter-spacing: -1px;
  animation: ${fadeIn} 0.6s ease 0.1s both;

  span {
    color: #D4821A;
  }
`;

const Desc = styled.p`
  color: #9A9A9A;
  font-size: 1rem;
  line-height: 1.7;
  max-width: 440px;
  margin: 0 0 32px;
  font-weight: 300;
  animation: ${fadeIn} 0.6s ease 0.2s both;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  animation: ${fadeIn} 0.6s ease 0.3s both;
`;

const AddToCartBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #D4821A;
  color: #fff;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: #F0A830;
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ReadMoreBtn = styled(ButtonLink)`
  display: flex;
  align-items: center;
  background: transparent;
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.25);
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: rgba(255,255,255,0.5);
    background: rgba(255,255,255,0.05);
  }
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
`;

const Column = styled.div``;

const ImageColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease 0.2s both;
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;

  &::before {
    content: '';
    position: absolute;
    inset: -12px;
    border: 1px solid rgba(212, 130, 26, 0.2);
    border-radius: 20px;
  }

  img {
    width: 100%;
    border-radius: 16px;
    display: block;
    filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5));
  }
`;

const PriceTag = styled.div`
  position: absolute;
  bottom: -16px;
  left: -16px;
  background: #D4821A;
  color: #fff;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.3rem;
  font-family: 'Playfair Display', serif;
  box-shadow: 0 8px 24px rgba(212, 130, 26, 0.4);
`;

const Featured = ({ product }) => {
  const { addProduct } = useContext(CartContext);

  if (!product) return null;

  function addFeaturedToCart() {
    if (product?._id) addProduct(product._id);
  }

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <Tag>✦ Featured Product</Tag>
            <Title>{product.title}</Title>
            <Desc>{product.description}</Desc>
            <ButtonsWrapper>
              <ReadMoreBtn href={"/product/" + product._id}>
                View Details →
              </ReadMoreBtn>
              <AddToCartBtn onClick={addFeaturedToCart}>
                <CartIcon />
                Add to Cart
              </AddToCartBtn>
            </ButtonsWrapper>
          </Column>
          <ImageColumn>
            <ImageFrame>
              <img
                src={product.images?.[0] || "https://qgdorbczieanupqwsnaf.supabase.co/storage/v1/object/public/nelen-ecommerce/images/p3a30m21yged9.png"}
                alt={product.title}
              />
              <PriceTag>Rs {product.price}</PriceTag>
            </ImageFrame>
          </ImageColumn>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
};

export default Featured;
