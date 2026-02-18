import Link from "next/link";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: #1c1c1e;
  color: #fff;
  padding: 56px 0 44px;
  margin-bottom: 60px;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #d4821a;
  margin-bottom: 10px;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -1px;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 32px;
  padding-bottom: 80px;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Box = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2ddd6;
  padding: 32px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  margin: 0 0 24px;
  font-size: 1.4rem;
  letter-spacing: -0.3px;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #e2ddd6;

  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background: #f8f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 64px;
    max-height: 64px;
    object-fit: contain;
  }
`;

const ItemInfo = styled.div``;

const ItemName = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-size: 0.85rem;
  color: #6b6b6b;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e2ddd6;
  border-radius: 8px;
  overflow: hidden;
`;

const QtyBtn = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  background: #f8f5f0;
  color: #1c1c1e;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e2ddd6;
  }
`;

const QtyNum = styled.span`
  width: 36px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 0;
  margin-top: 8px;
  border-top: 2px solid #1c1c1e;
`;

const TotalLabel = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const TotalPrice = styled.div`
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  font-weight: 700;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b6b6b;

  div {
    font-size: 3rem;
    margin-bottom: 16px;
  }
  h3 {
    font-family: "Playfair Display", serif;
    color: #1c1c1e;
    margin-bottom: 8px;
  }
  a {
    color: #d4821a;
    font-weight: 500;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 14px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2ddd6;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  background: #f8f5f0;
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: #d4821a;
    background: #fff;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  background: #d4821a;
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-family: "DM Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
  margin-top: 8px;

  &:hover {
    background: #f0a830;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 80px 20px;

  div {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  h2 {
    font-family: "Playfair Display", serif;
    font-size: 2rem;
    margin-bottom: 12px;
  }
  p {
    color: #6b6b6b;
  }
`;

const Cart = () => {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  async function goToPayment() {
    if (
      !name ||
      !email ||
      !phone ||
      !city ||
      !postalCode ||
      !streetAddress ||
      !country
    ) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/checkout", {
        name,
        email,
        phone,
        city,
        postalCode,
        streetAddress,
        country,
        cartProducts,
      });
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert("Payment initiation failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <SuccessBox>
            <div>✅</div>
            <h2>Order Confirmed!</h2>
            <p>
              Thanks for shopping at myPasal. We'll email you when your order is
              on its way.
            </p>
          </SuccessBox>
        </Center>
      </>
    );
  }

  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Label>Review your</Label>
          <PageTitle>Cart</PageTitle>
        </Center>
      </PageHeader>
      <Center>
        <ColumnsWrapper>
          <Box>
            <SectionTitle>Your Items</SectionTitle>
            {!cartProducts?.length ? (
              <EmptyCart>
                <div>🛒</div>
                <h3>Your cart is empty</h3>
                <p>
                  Looks like you haven&apos;t added anything yet.{" "}
                  <Link href="/products">Browse products →</Link>
                </p>
              </EmptyCart>
            ) : (
              <>
                {products.map((product) => {
                  const qty = cartProducts.filter(
                    (id) => id === product._id,
                  ).length;
                  return (
                    <CartItem key={product._id}>
                      <ItemImage>
                        <img src={product.images?.[0]} alt={product.title} />
                      </ItemImage>
                      <ItemInfo>
                        <ItemName>{product.title}</ItemName>
                        <ItemPrice>Rs {product.price} each</ItemPrice>
                      </ItemInfo>
                      <div>
                        <QtyControl>
                          <QtyBtn onClick={() => removeProduct(product._id)}>
                            −
                          </QtyBtn>
                          <QtyNum>{qty}</QtyNum>
                          <QtyBtn onClick={() => addProduct(product._id)}>
                            +
                          </QtyBtn>
                        </QtyControl>
                        <div
                          style={{
                            textAlign: "center",
                            marginTop: 6,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          Rs {qty * product.price}
                        </div>
                      </div>
                    </CartItem>
                  );
                })}
                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalPrice>Rs {total}</TotalPrice>
                </TotalRow>
              </>
            )}
          </Box>

          {!!cartProducts?.length && (
            <Box>
              <SectionTitle>Delivery Info</SectionTitle>
              <FormGroup>
                <FormInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </FormGroup>
              <FormGroup>
                <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </FormGroup>
              <FormGroup>
                <FormInput
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <FormInput
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </FormGroup>
                <FormGroup>
                  <FormInput
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <FormInput
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street address"
                />
              </FormGroup>
              <FormGroup>
                <FormInput
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </FormGroup>
              <CheckoutBtn onClick={goToPayment} disabled={loading}>
                {loading ? "Processing..." : "Continue to Payment →"}
              </CheckoutBtn>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </PageWrapper>
  );
};

export default Cart;
