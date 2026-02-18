import Link from "next/link";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";

const StyledHeader = styled.header`
  background-color: #1C1C1E;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid #D4821A;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  span {
    color: #D4821A;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  letter-spacing: 0.3px;

  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.07);
  }
`;

const CartLink = styled(Link)`
  color: #1C1C1E;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 6px;
  background: #D4821A;
  transition: background 0.2s, transform 0.1s;
  letter-spacing: 0.3px;
  white-space: nowrap;

  &:hover {
    background: #F0A830;
    transform: translateY(-1px);
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.15);
  margin: 0 4px;
`;

const Header = () => {
  const { cartProducts } = useContext(CartContext);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">my<span>Pasal</span></Logo>
          <StyledNav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All Products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/account">Account</NavLink>
            <Divider />
            <CartLink href="/cart">
              🛒 Cart ({cartProducts.length})
            </CartLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
};

export default Header;
