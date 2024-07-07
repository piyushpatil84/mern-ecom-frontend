//4:55:00 hrs User Profile page
import './App.css';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Cart from './features/cart/Cart';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import Protected from './features/auth/components/Protected';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './features/auth/authSlice';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import { ErrorPage } from './pages/ErrorPage';
import OrderSuccessPage from './features/order/Order';
import UserOrderPage from './pages/UserOrderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Protected>
      <Home />
    </Protected>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/cart',
    element: <Protected>
      <Cart />
    </Protected>,
  },
  {
    path: '/checkout',
    element: <Protected>
      <Checkout />
    </Protected>,
  },
  {
    path: '/product-detail/:id',
    element: <Protected>
      <ProductDetailPage />
    </Protected>,
  },
  {
    path: '/order-success/:id',
    element: <Protected>
      <OrderSuccessPage />
    </Protected>,
  },
  {
    path: '/orders',
    element: <Protected>
      <UserOrderPage />
    </Protected>,
  },
  {
    path: '*',
    element: <ErrorPage />
  },
]);

function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectLoggedInUser)
  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync(user.id))
    }
  }, [dispatch, user?.id])
  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

