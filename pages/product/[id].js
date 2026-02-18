import Link from "next/link";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { CartContext } from "@/components/CartContext";
import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import styled, { keyframes } from "styled-components";
import { useContext, useState, useEffect } from "react";
import CartIcon from "@/icons/CartIcon";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  padding-bottom: 80px;
`;

const Breadcrumb = styled.div`
  padding: 20px 0 0;
  font-size: 0.82rem;
  color: #6b6b6b;

  a {
    color: #6b6b6b;
    text-decoration: none;
    &:hover {
      color: #d4821a;
    }
  }

  span {
    margin: 0 6px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  margin-top: 32px;
  animation: ${fadeIn} 0.5s ease both;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ImageSection = styled.div``;

const MainImage = styled.div`
  background: #f8f5f0;
  border-radius: 20px;
  border: 1px solid #e2ddd6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  margin-bottom: 16px;
  min-height: 380px;

  img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.04);
    }
  }
`;

const ThumbnailRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Thumbnail = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background: #f8f5f0;
  border: 2px solid ${(props) => (props.active ? "#D4821A" : "#E2DDD6")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;

  img {
    max-width: 56px;
    max-height: 56px;
    object-fit: contain;
  }

  &:hover {
    border-color: #d4821a;
  }
`;

const InfoSection = styled.div``;

const CategoryTag = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #d4821a;
  margin-bottom: 12px;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: #1c1c1e;
`;

const PriceTag = styled.div`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 20px;

  span {
    font-size: 1rem;
    font-weight: 400;
    font-family: "DM Sans", sans-serif;
    color: #6b6b6b;
    margin-right: 4px;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${(props) =>
    props.out ? "#f9f9f9" : props.low ? "#fef9f0" : "#f0faf4"};
  border: 1px solid
    ${(props) => (props.out ? "#E2DDD6" : props.low ? "#f5c677" : "#b7dfca")};
`;

const StockDot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(props) =>
    props.out ? "#ccc" : props.low ? "#E67E22" : "#27AE60"};
`;

const StockLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => (props.out ? "#999" : props.low ? "#E67E22" : "#27AE60")};
`;

const StockSub = styled.div`
  font-size: 0.78rem;
  color: #6b6b6b;
  margin-left: auto;
`;

const Description = styled.p`
  color: #4a4a4a;
  line-height: 1.8;
  font-size: 0.95rem;
  margin: 0 0 32px;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const QtyLabel = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b6b6b;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e2ddd6;
  border-radius: 10px;
  overflow: hidden;
`;

const QtyBtn = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f5f0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1c1c1e;

  &:hover:not(:disabled) {
    background: #e2ddd6;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QtyNum = styled.span`
  width: 48px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
`;

const InCartNote = styled.div`
  font-size: 0.8rem;
  color: #6b6b6b;
`;

const AddToCartBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: ${(props) =>
    props.disabled ? "#E2DDD6" : props.added ? "#1C1C1E" : "#D4821A"};
  color: ${(props) => (props.disabled ? "#aaa" : "#fff")};
  border: none;
  padding: 18px 32px;
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition:
    background 0.2s,
    transform 0.15s;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    background: ${(props) => (props.added ? "#333" : "#F0A830")};
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2ddd6;
  margin: 28px 0;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b6b6b;

  strong {
    color: #1c1c1e;
  }
`;

function getStockInfo(quantity) {
  if (quantity === 0)
    return {
      label: "Out of stock",
      sub: "This item is currently unavailable",
      type: "out",
    };
  if (quantity <= 3)
    return {
      label: `Only ${quantity} left!`,
      sub: "Order soon before it sells out",
      type: "low",
    };
  if (quantity <= 10)
    return {
      label: `Low stock — ${quantity} remaining`,
      sub: "Limited availability",
      type: "low",
    };
  return { label: "In stock", sub: `${quantity} units available`, type: "ok" };
}

export default function ProductPage({ product }) {
  const { addProduct, registerStock, cartProducts } = useContext(CartContext);
  const [activeImg, setActiveImg] = useState(0);
  const [addQty, setAddQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product?._id) {
      registerStock(product._id, product.quantity || 0);
    }
  }, [product, registerStock]);

  if (!product) return <div>Product not found.</div>;

  const inCart = cartProducts.filter((id) => id === product._id).length;
  const remaining = (product.quantity || 0) - inCart;
  const outOfStock = (product.quantity || 0) === 0;
  const canAdd = !outOfStock && remaining > 0 && addQty <= remaining;
  const stock = getStockInfo(product.quantity || 0);

  function handleAddQty(delta) {
    setAddQty((q) => Math.max(1, Math.min(q + delta, remaining)));
  }

  function handleAddToCart() {
    if (!canAdd) return;
    for (let i = 0; i < addQty; i++) addProduct(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <PageWrapper>
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/products">Products</Link>
          <span>›</span>
          {product.title}
        </Breadcrumb>

        <ProductGrid>
          <ImageSection>
            <MainImage>
              <img src={product.images?.[activeImg]} alt={product.title} />
            </MainImage>
            {product.images?.length > 1 && (
              <ThumbnailRow>
                {product.images.map((img, i) => (
                  <Thumbnail
                    key={i}
                    active={activeImg === i ? 1 : 0}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`thumb-${i}`} />
                  </Thumbnail>
                ))}
              </ThumbnailRow>
            )}
          </ImageSection>

          <InfoSection>
            {product.category && <CategoryTag>{product.category}</CategoryTag>}
            <ProductTitle>{product.title}</ProductTitle>
            <PriceTag>
              <span>Rs</span>
              {product.price}
            </PriceTag>

            <StockInfo
              out={stock.type === "out" ? 1 : 0}
              low={stock.type === "low" ? 1 : 0}
            >
              <StockDot
                out={stock.type === "out" ? 1 : 0}
                low={stock.type === "low" ? 1 : 0}
              />
              <div>
                <StockLabel
                  out={stock.type === "out" ? 1 : 0}
                  low={stock.type === "low" ? 1 : 0}
                >
                  {stock.label}
                </StockLabel>
              </div>
              <StockSub>{stock.sub}</StockSub>
            </StockInfo>

            {product.description && (
              <Description>{product.description}</Description>
            )}

            {!outOfStock && remaining > 0 && (
              <QtyRow>
                <QtyLabel>Qty</QtyLabel>
                <QtyControl>
                  <QtyBtn
                    onClick={() => handleAddQty(-1)}
                    disabled={addQty <= 1}
                  >
                    −
                  </QtyBtn>
                  <QtyNum>{addQty}</QtyNum>
                  <QtyBtn
                    onClick={() => handleAddQty(1)}
                    disabled={addQty >= remaining}
                  >
                    +
                  </QtyBtn>
                </QtyControl>
                {inCart > 0 && (
                  <InCartNote>{inCart} already in cart</InCartNote>
                )}
              </QtyRow>
            )}

            <AddToCartBtn
              onClick={handleAddToCart}
              disabled={!canAdd}
              added={added ? 1 : 0}
            >
              {outOfStock ? (
                "Out of Stock"
              ) : remaining <= 0 ? (
                `Cart full (${inCart} added)`
              ) : added ? (
                `✓ Added ${addQty > 1 ? `${addQty} items` : ""} to Cart`
              ) : (
                <>
                  <CartIcon /> Add {addQty > 1 ? `${addQty} items` : ""} to Cart
                </>
              )}
            </AddToCartBtn>

            <Divider />

            <MetaRow>
              <strong>Category:</strong> {product.category || "Uncategorized"}
            </MetaRow>
          </InfoSection>
        </ProductGrid>
      </Center>
    </PageWrapper>
  );
}

export async function getServerSideProps({ params }) {
  await mongooseConnect();
  const product = await Product.findById(params.id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
