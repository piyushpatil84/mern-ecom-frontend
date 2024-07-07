import NavBar from "../features/navbar/Navbar";
import UserOrders from "../features/user/component/UserOrders";
function UserOrderPage() {
    return (
        <>
            <NavBar>
                <h1 className="mx-auto text-2xl font-semibold">My Orders</h1>
                <UserOrders />
            </NavBar>
        </>
    );
}

export default UserOrderPage;