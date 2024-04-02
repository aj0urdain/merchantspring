import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import FlagIcon from "./components/flagIcon";

import "rc-pagination/assets/index.css";
import Controls from "./components/widget/controls";
import { Modal } from "./components/modal";

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #cccccc;
  font-family: "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
`;

const AppHeader = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
`;

const HeaderText = styled.h1`
  font-family: "Roboto", sans-serif;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
`;

const Username = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  font-weight: 600;
`;

const Email = styled.span`
  font-family: "Roboto", sans-serif;
  font-size: 0.8rem;
`;

// Define an interface for the button's props
interface SortButtonProps {
  selected: boolean;
}

const SortButton = styled.button<SortButtonProps>`
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  border: none;
  padding: 0; // Removes padding
  background-color: transparent;

  svg {
    fill: ${(props) => (props.selected ? "red" : "#ccc")};
  }

  &:hover svg {
    fill: red;
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

const Stage = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const WidgetWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const WidgetHeader = styled.div`
  background-color: white;
  padding: 1rem 2rem;

  border-radius: 1rem 1rem 0 0;
  max-width: 100%;
  /* max-width: 1024px; */
  display: flex;
  justify-content: space-between;
`;

const WidgetHeaderPageInfo = styled.div``;

const TableHeader = styled.th`
  background-color: #f5f6fa;
  padding: 1rem 2rem;
  text-align: left;
  text-transform: uppercase;
  color: #a3a6b5;
  font-size: 0.8rem;
`;

const MarketplaceHeader = styled(TableHeader)`
  max-width: 100px;
`;

const StoreHeader = styled(TableHeader)``;

const OrderIDHeader = styled(TableHeader)`
  min-width: 100px;
`;

const OrderValueHeader = styled(TableHeader)`
  text-align: right;
  max-width: 50px;
`;

const ItemsHeader = styled(TableHeader)`
  text-align: center;
  max-width: 50px;
`;

const DestinationHeader = styled(TableHeader)``;

const DaysOverdueHeader = styled(TableHeader)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #f4f4f4;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingTableRow = styled(TableRow)`
  color: black;
  background-color: #f5f6fa;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      background-color: white;
    }
    50% {
      background-color: #e9ecef;
    }
    100% {
      background-color: white;
    }
  }
`;

const LoadingTableCell = styled.td`
  padding: 1.5rem 2rem;
  font-weight: 500;
  color: #606060;
  min-width: 100px;
`;

const FlagContainer = styled.div`
  width: 50px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 25px;
`;

const TableCell = styled.td`
  padding: 1.5rem 2rem;
  font-weight: 500;
`;

const StoreCell = styled(TableCell)`
  text-align: left;
`;

const MarketplaceCell = styled(TableCell)`
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OverdueCell = styled(TableCell)`
  color: red;
  text-align: center;
  font-weight: 800;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 2rem 0;
  border-radius: 0 0 1rem 1rem;
`;

const OrderIDCell = styled(TableCell)``;

const OrderValueCell = styled(TableCell)`
  text-align: right;
`;

const ItemsCell = styled(TableCell)`
  text-align: center;
`;

const DestinationCell = styled(TableCell)`
  font-size: 0.8rem;
`;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

interface Order {
  orderId: string;
  destination: string;
  items: string;
  orderValue: string;
  daysOverdue: number;
  marketplace: string;
  shopName: string;
  country: string;
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortDirection, setSortDirection] = useState("desc");

  const [loading, setLoading] = useState(true);
  const [retryFetchToggle, setRetryFetchToggle] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [limit, setLimit] = useState(5);

  const handlePageChange = (current: number, pageSize: number) => {
    setCurrentPage(current);
    setLimit(pageSize);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageFromURL = searchParams.get("page");
    const sortFromURL = searchParams.get("sort");

    setCurrentPage(pageFromURL ? Number(pageFromURL) : 1);
    setSortDirection(sortFromURL || "desc");
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", currentPage.toString());
    searchParams.set("sort", sortDirection);

    const newSearchString = searchParams.toString();
    if (location.search !== `?${newSearchString}`) {
      navigate({ search: `?${newSearchString}` }, { replace: true });
    }
  }, [currentPage, sortDirection, navigate, location.search]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/user");

        if (!response.ok) {
          // Check if the response was not successful
          throw new Error(`HTTP error: The status is ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        // Handle the error state here as necessary, for example:
        setError(error.message || "Failed to load user data.");
        setShowModal(true); // Only if you want to show a modal for this error as well
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset previous errors
      setShowModal(false); // Close the modal if it was previously opened

      try {
        const response = await fetch(
          `http://localhost:8080/sales?page=${currentPage}&limit=${limit}&sortDirection=${sortDirection}`
        );
        if (!response.ok) {
          // Check if the response was not successful
          throw new Error(`HTTP error: The status is ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.data);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        console.error("Error fetching sales data:", error);
        setError(error.message || "Failed to connect to the server."); // Capture the error message
        setShowModal(true); // Show the modal
      }

      setLoading(false);
    };

    fetchData();
  }, [currentPage, limit, sortDirection, retryFetchToggle]);

  return (
    <AppWrapper>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          retryFetch={() => setRetryFetchToggle((prev) => !prev)}
        >
          <p>Failed to connect to database!</p>
        </Modal>
      )}
      <AppHeader>
        <HeaderText>Analytics Dashboard</HeaderText>
        <ProfileContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "0.25rem",
              alignItems: "flex-end",
            }}
          >
            <Username>
              Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
            </Username>
            <Email>
              {user ? user.email : "Please log in to view your orders."}
            </Email>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={40}
            height={40}
          >
            <title>account-circle</title>
            <path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
          </svg>
        </ProfileContainer>
      </AppHeader>

      <Stage>
        {!error && orders.length > 0 && (
          <WidgetWrapper>
            <WidgetHeader>
              <h2
                style={{
                  color: "#5e5e5e",
                }}
              >
                Overdue Orders
              </h2>
              <WidgetHeaderPageInfo>
                <h4>
                  Page {currentPage} of {totalPages}
                </h4>
              </WidgetHeaderPageInfo>
            </WidgetHeader>
            <Table>
              <thead>
                <tr>
                  <OrderIDHeader>ID</OrderIDHeader>
                  <MarketplaceHeader>Marketplace</MarketplaceHeader>
                  <StoreHeader>Store</StoreHeader>
                  <DestinationHeader>Destination</DestinationHeader>
                  <ItemsHeader>Items</ItemsHeader>
                  <OrderValueHeader>Value</OrderValueHeader>
                  <DaysOverdueHeader>
                    Days Overdue
                    <SortButton
                      selected={sortDirection === "desc"}
                      onClick={() => setSortDirection("desc")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                      >
                        <path d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" />
                      </svg>
                    </SortButton>
                    <SortButton
                      selected={sortDirection === "asc"}
                      onClick={() => setSortDirection("asc")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width={24}
                        height={24}
                      >
                        <path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" />
                      </svg>
                    </SortButton>
                  </DaysOverdueHeader>
                </tr>
              </thead>

              <tbody>
                {loading
                  ? Array.from(new Array(limit), (_, index) => (
                      <LoadingTableRow key={index}>
                        <LoadingTableCell colSpan={7}>
                          Loading...
                        </LoadingTableCell>
                      </LoadingTableRow>
                    ))
                  : orders.map((order) => (
                      <TableRow key={order.orderId}>
                        <OrderIDCell>{order.orderId}</OrderIDCell>

                        <MarketplaceCell>
                          {order.country && (
                            <FlagContainer>
                              <FlagIcon countryCode3={order.country} />
                            </FlagContainer>
                          )}
                          {order.marketplace}
                        </MarketplaceCell>
                        <StoreCell>{order.shopName}</StoreCell>
                        <DestinationCell>{order.destination}</DestinationCell>
                        <ItemsCell>{order.items}</ItemsCell>

                        <OrderValueCell>
                          ${parseFloat(order.orderValue).toFixed(2)}
                        </OrderValueCell>
                        <OverdueCell>{order.daysOverdue}</OverdueCell>
                      </TableRow>
                    ))}
              </tbody>
            </Table>

            <Controls
              {...{
                currentPage,
                handlePageChange: (current: number, pageSize?: number) =>
                  handlePageChange(current, pageSize || limit),
                totalPages,
                limit,
                loading,
              }}
            />
          </WidgetWrapper>
        )}
      </Stage>
    </AppWrapper>
  );
};

export default App;
