import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Center from "./Center";
import { CartContext } from "./CartContext";
import { useRouter } from "next/router";

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
  flex-shrink: 0;
  span { color: #D4821A; }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
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

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #D4821A;
    background: rgba(255,255,255,0.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  padding: 8px 12px;
  width: 200px;

  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const SearchBtn = styled.button`
  background: none;
  border: none;
  color: rgba(255,255,255,0.5);
  padding: 8px 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover { color: #D4821A; }
`;

// ── Mobile ────────────────────────────────────────────────────
const MobileRight = styled.div`
  display: none;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileCartLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 700;
  background: #D4821A;
  padding: 8px 14px;
  border-radius: 6px;
  white-space: nowrap;
`;

const HamburgerBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const HamburgerLine = styled.span`
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.25s, opacity 0.25s;

  &:nth-child(1) {
    transform: ${props => props.open ? 'translateY(7px) rotate(45deg)' : 'none'};
  }
  &:nth-child(2) {
    opacity: ${props => props.open ? '0' : '1'};
  }
  &:nth-child(3) {
    transform: ${props => props.open ? 'translateY(-7px) rotate(-45deg)' : 'none'};
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.open ? 'flex' : 'none'};
    flex-direction: column;
    background: #1C1C1E;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 8px 0 16px;
  }
`;

const MobileNavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 14px 20px;
  transition: color 0.2s, background 0.2s;
  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }
`;

const MobileSearchForm = styled.form`
  display: flex;
  align-items: center;
  margin: 4px 16px 8px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  overflow: hidden;

  &:focus-within { border-color: #D4821A; }
`;

const MobileSearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  padding: 10px 12px;
  flex: 1;
  &::placeholder { color: rgba(255,255,255,0.35); }
`;

const Header = () => {
  const { cartProducts, mounted } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearch, setMobileSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keep search input in sync with URL query
  useEffect(() => {
    setSearchQuery(router.query.search || '');
    setMobileSearch(router.query.search || '');
  }, [router.query.search]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setMenuOpen(false);
  }

  function handleMobileSearch(e) {
    e.preventDefault();
    if (mobileSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(mobileSearch.trim())}`);
    } else {
      router.push('/products');
    }
    setMenuOpen(false);
  }

  const cartCount = mounted ? cartProducts.length : 0;

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href="/">my<span>Pasal</span></Logo>

          {/* Desktop nav */}
          <DesktopNav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">All Products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/account">Account</NavLink>
            <Divider />
            <SearchForm onSubmit={handleSearch}>
              <SearchInput
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <SearchBtn type="submit">🔍</SearchBtn>
            </SearchForm>
            <Divider />
            <CartLink href="/cart">🛒 Cart ({cartCount})</CartLink>
          </DesktopNav>

          {/* Mobile */}
          <MobileRight>
            <MobileCartLink href="/cart">🛒 {cartCount}</MobileCartLink>
            <HamburgerBtn onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
              <HamburgerLine open={menuOpen} />
              <HamburgerLine open={menuOpen} />
              <HamburgerLine open={menuOpen} />
            </HamburgerBtn>
          </MobileRight>
        </Wrapper>
      </Center>

      <MobileMenu open={menuOpen}>
        <MobileSearchForm onSubmit={handleMobileSearch}>
          <MobileSearchInput
            placeholder="Search products..."
            value={mobileSearch}
            onChange={e => setMobileSearch(e.target.value)}
          />
          <SearchBtn type="submit">🔍</SearchBtn>
        </MobileSearchForm>
        <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
        <MobileNavLink href="/products" onClick={() => setMenuOpen(false)}>All Products</MobileNavLink>
        <MobileNavLink href="/categories" onClick={() => setMenuOpen(false)}>Categories</MobileNavLink>
        <MobileNavLink href="/account" onClick={() => setMenuOpen(false)}>Account</MobileNavLink>
      </MobileMenu>
    </StyledHeader>
  );
};

export default Header;