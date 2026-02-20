import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

const PageWrapper = styled.div`min-height: 100vh;`;

const PageHeader = styled.div`
  background: #1C1C1E;
  color: #fff;
  padding: 56px 0 44px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 36px 0 28px;
    margin-bottom: 36px;
  }
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding-bottom: 80px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 48px;
  }
`;

const Sidebar = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E2DDD6;
  padding: 24px;
  height: fit-content;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 16px;
  border: 3px solid #D4821A;
`;

const AvatarPlaceholder = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4821A, #F0A830);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto 16px;
`;

const UserName = styled.h3`
  text-align: center;
  margin: 0 0 4px;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
`;

const UserEmail = styled.p`
  text-align: center;
  color: #6B6B6B;
  font-size: 0.82rem;
  margin: 0 0 24px;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? '#F8F5F0' : 'transparent'};
  color: ${props => props.active ? '#D4821A' : '#1C1C1E'};
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  margin-bottom: 4px;
  &:hover { background: #F8F5F0; }
`;

const SignOutBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border-radius: 8px;
  border: 1.5px solid #E2DDD6;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: #6B6B6B;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #ff4444; color: #ff4444; }
`;

const MainPanel = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E2DDD6;
  padding: 36px;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
`;

const PanelTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 1.5rem;
  letter-spacing: -0.3px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`margin-bottom: 16px;`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #6B6B6B;
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #E2DDD6;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  background: #F8F5F0;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus { border-color: #D4821A; background: #fff; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SaveBtn = styled.button`
  background: #D4821A;
  color: #fff;
  border: none;
  padding: 13px 28px;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, opacity 0.2s;
  &:hover { background: #F0A830; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Toast = styled.div`
  display: inline-block;
  margin-left: 14px;
  font-size: 0.85rem;
  color: ${props => props.error ? '#e74c3c' : '#2d6a4f'};
  font-weight: 500;
  vertical-align: middle;

  @media (max-width: 768px) {
    display: block;
    margin-left: 0;
    margin-top: 10px;
    text-align: center;
  }
`;

const EmptyPanel = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6B6B6B;
  div { font-size: 3rem; margin-bottom: 16px; }
  h3 { font-family: 'Playfair Display', serif; color: #1C1C1E; margin-bottom: 8px; }

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E2DDD6;
  padding: 60px 40px;
  text-align: center;
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    padding: 40px 24px;
    min-height: 300px;
  }
`;

const LoginTitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 12px;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LoginDesc = styled.p`
  color: #6B6B6B;
  margin: 0 0 36px;
  font-size: 1rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
`;

const GoogleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  color: #1C1C1E;
  border: 1.5px solid #E2DDD6;
  padding: 14px 28px;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;
  &:hover {
    border-color: #D4821A;
    box-shadow: 0 4px 16px rgba(212,130,26,0.15);
  }
  img { width: 22px; height: 22px; }
`;

const AdminBadge = styled.div`
  background: linear-gradient(135deg, #D4821A, #F0A830);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 16px;
`;

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const loading = status === "loading";

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');
  const [toastError, setToastError] = useState(false);

  useEffect(() => {
    if (!session || profileLoaded) return;
    axios.get('/api/profile').then(res => {
      const data = res.data;
      setFirstName(data.firstName || session.user.name?.split(' ')[0] || '');
      setLastName(data.lastName   || session.user.name?.split(' ').slice(1).join(' ') || '');
      setPhone(data.phone || '');
      setProfileLoaded(true);
    });
  }, [session]);

  async function saveProfile() {
    setSaving(true);
    setToast('');
    try {
      await axios.put('/api/profile', { firstName, lastName, phone });
      setToast('✓ Saved successfully');
      setToastError(false);
    } catch {
      setToast('Failed to save. Try again.');
      setToastError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setToast(''), 3000);
    }
  }

  return (
    <PageWrapper>
      <Header />
      <PageHeader>
        <Center>
          <Label>My</Label>
          <PageTitle>Account</PageTitle>
        </Center>
      </PageHeader>
      <Center>
        <ContentGrid>
          {!session && !loading ? (
            <LoginBox>
              <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>👤</div>
              <LoginTitle>Sign in to myPasal</LoginTitle>
              <LoginDesc>
                Track your orders, save your addresses,<br />
                and enjoy a personalised shopping experience.
              </LoginDesc>
              <GoogleBtn onClick={() => signIn("google")}>
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Continue with Google
              </GoogleBtn>
            </LoginBox>
          ) : loading ? (
            <LoginBox>
              <div style={{ color: '#6B6B6B' }}>Loading...</div>
            </LoginBox>
          ) : (
            <>
              <Sidebar>
                {session.user.image
                  ? <Avatar src={session.user.image} alt={session.user.name} />
                  : <AvatarPlaceholder>👤</AvatarPlaceholder>
                }
                {session.user.isAdmin && <AdminBadge>⚡ Admin</AdminBadge>}
                <UserName>{profileLoaded ? `${firstName} ${lastName}`.trim() : session.user.name}</UserName>
                <UserEmail>{session.user.email}</UserEmail>

                <NavItem active={activeTab === 'profile' ? 1 : 0} onClick={() => setActiveTab('profile')}>👤 Profile</NavItem>
                <NavItem active={activeTab === 'orders' ? 1 : 0} onClick={() => setActiveTab('orders')}>📦 Orders</NavItem>
                <NavItem active={activeTab === 'addresses' ? 1 : 0} onClick={() => setActiveTab('addresses')}>📍 Addresses</NavItem>
                {session.user.isAdmin && (
                  <NavItem onClick={() => window.location.href = '/admin'}>⚙️ Admin Panel</NavItem>
                )}
                <SignOutBtn onClick={() => signOut()}>Sign out</SignOutBtn>
              </Sidebar>

              <MainPanel>
                {activeTab === 'profile' && (
                  <>
                    <PanelTitle>Profile Information</PanelTitle>
                    <FormRow>
                      <FormGroup>
                        <FormLabel>First Name</FormLabel>
                        <FormInput
                          autoComplete="off"
                          name="mypasal-firstname"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Last Name</FormLabel>
                        <FormInput
                          autoComplete="off"
                          name="mypasal-lastname"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                        />
                      </FormGroup>
                    </FormRow>
                    <FormGroup>
                      <FormLabel>Email</FormLabel>
                      <FormInput
                        autoComplete="off"
                        value={session.user.email}
                        disabled
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Phone</FormLabel>
                      <FormInput
                        autoComplete="off"
                        name="mypasal-phone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </FormGroup>
                    <SaveBtn onClick={saveProfile} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </SaveBtn>
                    {toast && <Toast error={toastError ? 1 : 0}>{toast}</Toast>}
                  </>
                )}

                {activeTab === 'orders' && (
                  <>
                    <PanelTitle>Order History</PanelTitle>
                    <EmptyPanel>
                      <div>📦</div>
                      <h3>No orders yet</h3>
                      <p>Your completed orders will appear here.</p>
                    </EmptyPanel>
                  </>
                )}

                {activeTab === 'addresses' && (
                  <>
                    <PanelTitle>Saved Addresses</PanelTitle>
                    <EmptyPanel>
                      <div>📍</div>
                      <h3>No addresses saved</h3>
                      <p>Saved addresses will appear here.</p>
                    </EmptyPanel>
                  </>
                )}
              </MainPanel>
            </>
          )}
        </ContentGrid>
      </Center>
    </PageWrapper>
  );
}