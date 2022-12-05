import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Notification from './components/UI/Notification';

import { uiActions } from "./store/ui-slice";

let isInitial = true; 

function App() {
  const cartIsVisible = useSelector((state) => state.ui.cartIsVisible);

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cat data!",
        })
      );
      const response = await fetch(
        "https://react-demo-10627-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success...",
          message: "Sent cart data successfully!",
        })
      );
    };

    if(isInitial){
      // To avoid send blank cart data when the useEffect run for the first time
      isInitial=false; 
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <>
    {notification && <Notification status={notification.status} title={notification.title} message={notification.message}/>} 
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
