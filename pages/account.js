import Header from "@/components/Header";
import Center from "@/components/Center";
import styled from "styled-components";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const PageWrapper = styled.div`min-height: 100vh;`;

const PageHeader = styled.div`
  background: #1C1C1E;
  color: #fff;
  padding: 56px 0 44px;
  margin-bottom: 60px;
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
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  padding-bottom: 80px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E2DDD6;
  padding: 24px;
  height: fit-content;
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
`;

const PanelTitle = styled.h2`
  margin: 0 0 28px;
  font-size: 1.5rem;
  letter-spacing: -0.3px;
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
  transition: border-color 0.2s;
  &:focus { border-color: #D4821A; background: #fff; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  transition: background 0.2s;
  &:hover { background: #F0A830; }
`;

const EmptyPanel = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6B6B6B;
  div { font-size: 3rem; margin-bottom: 16px; }
  h3 { font-family: 'Playfair Display', serif; color: #1C1C1E; margin-bottom: 8px; }
`;

// Login screen shown when not authenticated
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
`;

const LoginTitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 12px;
  letter-spacing: -0.5px;
`;

const LoginDesc = styled.p`
  color: #6B6B6B;
  margin: 0 0 36px;
  font-size: 1rem;
  line-height: 1.6;
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
    box-shadow: 0 4px 16px rgba(212, 130, 26, 0.15);
  }

  img {
    width: 22px;
    height: 22px;
  }
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
                Track your orders, save your addresses,<br />and enjoy a personalised shopping experience.
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
                <UserName>{session.user.name}</UserName>
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
                        <FormInput defaultValue={session.user.name?.split(' ')[0]} />
                      </FormGroup>
                      <FormGroup>
                        <FormLabel>Last Name</FormLabel>
                        <FormInput defaultValue={session.user.name?.split(' ').slice(1).join(' ')} />
                      </FormGroup>
                    </FormRow>
                    <FormGroup>
                      <FormLabel>Email</FormLabel>
                      <FormInput defaultValue={session.user.email} disabled style={{ opacity: 0.6 }} />
                    </FormGroup>
                    <FormGroup>
                      <FormLabel>Phone</FormLabel>
                      <FormInput placeholder="+977 98XXXXXXXX" />
                    </FormGroup>
                    <SaveBtn>Save Changes</SaveBtn>
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
                    <FormGroup>
                      <FormLabel>Street Address</FormLabel>
                      <FormInput placeholder="Street address" />
                    </FormGroup>
                    <FormRow>
                      <FormGroup><FormLabel>City</FormLabel><FormInput placeholder="City" /></FormGroup>
                      <FormGroup><FormLabel>Postal Code</FormLabel><FormInput placeholder="Postal code" /></FormGroup>
                    </FormRow>
                    <FormGroup><FormLabel>Country</FormLabel><FormInput placeholder="Country" /></FormGroup>
                    <SaveBtn>Save Address</SaveBtn>
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
