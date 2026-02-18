import { useSession, signIn } from "next-auth/react";
import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const ADMIN_EMAIL = "perushparajuli@gmail.com";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Living",
  "Books",
  "Sports",
  "Beauty",
  "Other",
];

const PageWrapper = styled.div`
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: #1c1c1e;
  color: #fff;
  padding: 40px 0 32px;
  margin-bottom: 48px;
  border-bottom: 2px solid #d4821a;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: #d4821a;
  margin-bottom: 8px;
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const AdminBadge = styled.span`
  background: #d4821a;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  letter-spacing: 1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  padding-bottom: 80px;
`;

const Sidebar = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2ddd6;
  padding: 20px;
  height: fit-content;
`;

const SidebarTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b6b6b;
  margin-bottom: 12px;
  padding: 0 8px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${(props) => (props.active ? "#1C1C1E" : "transparent")};
  color: ${(props) => (props.active ? "#fff" : "#1C1C1E")};
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  margin-bottom: 4px;
  &:hover {
    background: ${(props) => (props.active ? "#1C1C1E" : "#F8F5F0")};
  }
`;

const MainPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2ddd6;
  padding: 36px;
`;

const PanelTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 1.4rem;
  letter-spacing: -0.3px;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #6b6b6b;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2ddd6;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  background: #f8f5f0;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #d4821a;
    background: #fff;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2ddd6;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  background: #f8f5f0;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  &:focus {
    border-color: #d4821a;
    background-color: #fff;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2ddd6;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  background: #f8f5f0;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;
  &:focus {
    border-color: #d4821a;
    background: #fff;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const SaveBtn = styled.button`
  background: #d4821a;
  color: #fff;
  border: none;
  padding: 13px 28px;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f0a830;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMsg = styled.div`
  background: #e6f4ea;
  color: #2d6a4f;
  border: 1px solid #b7dfca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ErrorMsg = styled.div`
  background: #fdecea;
  color: #c0392b;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #e2ddd6;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
  background: #f8f5f0;
  &:hover {
    border-color: #d4821a;
    background: #fff;
  }
  p {
    margin: 8px 0 0;
    color: #6b6b6b;
    font-size: 0.875rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const ImagePreviews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #e2ddd6;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImg = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: #f8f5f0;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2ddd6;
  h3 {
    font-size: 2rem;
    margin: 0 0 4px;
    font-family: "Playfair Display", serif;
    color: #d4821a;
  }
  p {
    margin: 0;
    font-size: 0.85rem;
    color: #6b6b6b;
  }
`;

const ProductList = styled.div`
  margin-top: 8px;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto auto auto auto;
  gap: 16px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #e2ddd6;
  &:last-child {
    border-bottom: none;
  }
`;

const ProductThumb = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2ddd6;
`;

const ProductThumbPlaceholder = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: #f8f5f0;
  border: 1px solid #e2ddd6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
`;

const CategoryPill = styled.span`
  background: #f8f5f0;
  border: 1px solid #e2ddd6;
  color: #6b6b6b;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
`;

const EditBtn = styled.button`
  background: transparent;
  border: 1.5px solid #d4821a;
  color: #d4821a;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background: #d4821a;
    color: #fff;
  }
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: 1.5px solid #e2ddd6;
  color: #6b6b6b;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: all 0.2s;
  &:hover {
    border-color: #ff4444;
    color: #ff4444;
    background: #fff0f0;
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 1.4rem;
  letter-spacing: -0.3px;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #e2ddd6;
  background: #f8f5f0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: #1c1c1e;
    color: #fff;
    border-color: #1c1c1e;
  }
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1.5px solid #e2ddd6;
  color: #6b6b6b;
  padding: 13px 24px;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #1c1c1e;
    color: #1c1c1e;
  }
`;

const AccessDenied = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  div {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  h2 {
    font-family: "Playfair Display", serif;
    margin-bottom: 12px;
  }
  p {
    color: #6b6b6b;
    margin-bottom: 28px;
  }
`;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const fileInputRef = useRef();
  const editFileInputRef = useRef();

  // Add form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);

  const loading = status === "loading";

  useEffect(() => {
    if (session?.user?.email === ADMIN_EMAIL) fetchProducts();
  }, [session]);

  async function fetchProducts() {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (e) {}
  }

  async function handleImageFiles(e, setter) {
    const files = Array.from(e.target.files);
    const newImages = [];
    for (const file of files) {
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = (ev) => {
          newImages.push(ev.target.result);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setter((prev) => [...prev, ...newImages]);
  }

  async function saveProduct(e) {
    e.preventDefault();
    setError("");
    if (!title || !price || !category) {
      setError("Please fill in title, price, and category.");
      return;
    }
    setSaving(true);
    try {
      await axios.post("/api/products", {
        title,
        description,
        price,
        images,
        category,
        quantity,
      });
      setSaved(true);
      setTitle("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setImages([]);
      fetchProducts();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Error saving product. Check the console.");
    }
    setSaving(false);
  }

  function openEdit(product) {
    setEditingProduct({ ...product, images: product.images || [] });
    setEditSaved(false);
  }

  function closeEdit() {
    setEditingProduct(null);
    setEditSaved(false);
  }

  async function saveEdit(e) {
    e.preventDefault();
    setEditSaving(true);
    try {
      await axios.put(`/api/products?id=${editingProduct._id}`, {
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        category: editingProduct.category,
        quantity: editingProduct.quantity,
        images: editingProduct.images,
      });
      setEditSaved(true);
      fetchProducts();
      setTimeout(() => {
        closeEdit();
      }, 1500);
    } catch {
      alert("Error updating product.");
    }
    setEditSaving(false);
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await axios.delete(`/api/products?id=${id}`);
    fetchProducts();
  }

  if (loading)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  if (!session) {
    return (
      <PageWrapper>
        <Header />
        <Center>
          <AccessDenied>
            <div>🔒</div>
            <h2>Sign in required</h2>
            <p>You need to sign in to access the admin panel.</p>
            <SaveBtn onClick={() => signIn("google")}>
              Sign in with Google
            </SaveBtn>
          </AccessDenied>
        </Center>
      </PageWrapper>
    );
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <PageWrapper>
        <Header />
        <Center>
          <AccessDenied>
            <div>🚫</div>
            <h2>Access Denied</h2>
            <p>You don&apos;t have permission to view this page.</p>
            <SaveBtn onClick={() => (window.location.href = "/")}>
              Go Home
            </SaveBtn>
          </AccessDenied>
        </Center>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <HeaderRow>
            <div>
              <Label>Admin</Label>
              <PageTitle>Dashboard</PageTitle>
            </div>
            <AdminBadge>⚡ {session.user.name}</AdminBadge>
          </HeaderRow>
        </Center>
      </PageHeader>

      <Center>
        <Grid>
          <Sidebar>
            <SidebarTitle>Manage</SidebarTitle>
            <NavItem
              active={activeTab === "dashboard" ? 1 : 0}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </NavItem>
            <NavItem
              active={activeTab === "products" ? 1 : 0}
              onClick={() => setActiveTab("products")}
            >
              ➕ Add Product
            </NavItem>
            <NavItem
              active={activeTab === "list" ? 1 : 0}
              onClick={() => {
                setActiveTab("list");
                fetchProducts();
              }}
            >
              📦 All Products
            </NavItem>
            <NavItem onClick={() => (window.location.href = "/account")}>
              👤 My Account
            </NavItem>
            <NavItem onClick={() => (window.location.href = "/")}>
              🏠 View Store
            </NavItem>
          </Sidebar>

          <MainPanel>
            {activeTab === "dashboard" && (
              <>
                <PanelTitle>Overview</PanelTitle>
                <StatsGrid>
                  <StatCard>
                    <h3>{products.length}</h3>
                    <p>Total Products</p>
                  </StatCard>
                  <StatCard>
                    <h3>{CATEGORIES.length - 1}</h3>
                    <p>Categories</p>
                  </StatCard>
                  <StatCard>
                    <h3>
                      {products.reduce((s, p) => s + (p.quantity || 0), 0)}
                    </h3>
                    <p>Total Stock</p>
                  </StatCard>
                </StatsGrid>
                <p
                  style={{
                    color: "#6B6B6B",
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                  }}
                >
                  Welcome back! Use <strong>Add Product</strong> to add new
                  items, or <strong>All Products</strong> to manage existing
                  ones.
                </p>
              </>
            )}

            {activeTab === "products" && (
              <>
                <PanelTitle>Add New Product</PanelTitle>
                {saved && (
                  <SuccessMsg>
                    ✅ Product saved and live on the store!
                  </SuccessMsg>
                )}
                {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}
                <form onSubmit={saveProduct}>
                  <FormGroup>
                    <FormLabel>Product Title *</FormLabel>
                    <FormInput
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Wireless Headphones"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Description</FormLabel>
                    <FormTextarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your product..."
                    />
                  </FormGroup>
                  <FormRow>
                    <FormGroup>
                      <FormLabel>Category *</FormLabel>
                      <FormSelect
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Price (Rs) *</FormLabel>
                      <FormInput
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 2500"
                        min="0"
                      />
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <FormLabel>Quantity in Stock</FormLabel>
                    <FormInput
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 50"
                      min="0"
                      style={{ maxWidth: 200 }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Product Images</FormLabel>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      onChange={(e) => handleImageFiles(e, setImages)}
                      style={{ display: "none" }}
                    />
                    <ImageUploadArea
                      onClick={() => fileInputRef.current.click()}
                    >
                      <UploadIcon>🖼️</UploadIcon>
                      <strong>Click to upload images</strong>
                      <p>PNG, JPG, WEBP — select multiple</p>
                    </ImageUploadArea>
                    {images.length > 0 && (
                      <ImagePreviews>
                        {images.map((src, i) => (
                          <ImagePreview key={i}>
                            <img src={src} alt={`preview-${i}`} />
                            <RemoveImg
                              onClick={() =>
                                setImages((prev) =>
                                  prev.filter((_, j) => j !== i),
                                )
                              }
                            >
                              ✕
                            </RemoveImg>
                          </ImagePreview>
                        ))}
                      </ImagePreviews>
                    )}
                  </FormGroup>
                  <SaveBtn type="submit" disabled={saving}>
                    {saving ? "Saving..." : "💾 Save Product"}
                  </SaveBtn>
                </form>
              </>
            )}

            {activeTab === "list" && (
              <>
                <PanelTitle>All Products ({products.length})</PanelTitle>
                {products.length === 0 ? (
                  <p style={{ color: "#6B6B6B" }}>No products yet.</p>
                ) : (
                  <ProductList>
                    {products.map((p) => (
                      <ProductRow key={p._id}>
                        {p.images?.[0] ? (
                          <ProductThumb src={p.images[0]} alt={p.title} />
                        ) : (
                          <ProductThumbPlaceholder>📦</ProductThumbPlaceholder>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                            {p.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.82rem",
                              color: "#6B6B6B",
                              marginTop: 2,
                            }}
                          >
                            Rs {p.price}
                          </div>
                        </div>
                        <CategoryPill>
                          {p.category || "Uncategorized"}
                        </CategoryPill>
                        <div style={{ fontSize: "0.85rem", color: "#6B6B6B" }}>
                          Qty: {p.quantity || 0}
                        </div>
                        <EditBtn onClick={() => openEdit(p)}>✏️ Edit</EditBtn>
                        <DeleteBtn onClick={() => deleteProduct(p._id)}>
                          🗑 Delete
                        </DeleteBtn>
                      </ProductRow>
                    ))}
                  </ProductList>
                )}
              </>
            )}
          </MainPanel>
        </Grid>
      </Center>

      {/* Edit Modal */}
      {editingProduct && (
        <ModalOverlay onClick={closeEdit}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalCloseBtn onClick={closeEdit}>✕</ModalCloseBtn>
            <ModalTitle>✏️ Edit Product</ModalTitle>
            {editSaved && <SuccessMsg>✅ Product updated!</SuccessMsg>}
            <form onSubmit={saveEdit}>
              <FormGroup>
                <FormLabel>Product Title *</FormLabel>
                <FormInput
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <FormLabel>Category *</FormLabel>
                  <FormSelect
                    value={editingProduct.category || ""}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Price (Rs) *</FormLabel>
                  <FormInput
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((p) => ({
                        ...p,
                        price: e.target.value,
                      }))
                    }
                    min="0"
                  />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <FormLabel>Quantity in Stock</FormLabel>
                <FormInput
                  type="number"
                  value={editingProduct.quantity || ""}
                  onChange={(e) =>
                    setEditingProduct((p) => ({
                      ...p,
                      quantity: e.target.value,
                    }))
                  }
                  min="0"
                  style={{ maxWidth: 200 }}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Images</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={editFileInputRef}
                  onChange={(e) =>
                    handleImageFiles(e, (updater) => {
                      setEditingProduct((p) => ({
                        ...p,
                        images: updater(p.images || []),
                      }));
                    })
                  }
                  style={{ display: "none" }}
                />
                {editingProduct.images?.length > 0 && (
                  <ImagePreviews>
                    {editingProduct.images.map((src, i) => (
                      <ImagePreview key={i}>
                        <img src={src} alt={`img-${i}`} />
                        <RemoveImg
                          onClick={() =>
                            setEditingProduct((p) => ({
                              ...p,
                              images: p.images.filter((_, j) => j !== i),
                            }))
                          }
                        >
                          ✕
                        </RemoveImg>
                      </ImagePreview>
                    ))}
                  </ImagePreviews>
                )}
                <ImageUploadArea
                  onClick={() => editFileInputRef.current.click()}
                  style={{ marginTop: 12 }}
                >
                  <UploadIcon>🖼️</UploadIcon>
                  <strong>Add more images</strong>
                  <p>Click to upload</p>
                </ImageUploadArea>
              </FormGroup>
              <ModalBtnRow>
                <SaveBtn type="submit" disabled={editSaving}>
                  {editSaving ? "Saving..." : "💾 Save Changes"}
                </SaveBtn>
                <CancelBtn type="button" onClick={closeEdit}>
                  Cancel
                </CancelBtn>
              </ModalBtnRow>
            </form>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}
