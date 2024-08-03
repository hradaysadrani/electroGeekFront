import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
// import toast from "react-hot-toast";
import toast from "react-hot-toast";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";

// const cartItems = [
//   {
//     productId:"123",
//     photo :"https://5.imimg.com/data5/SELLER/Default/2023/1/LQ/FR/AA/32473795/18650-lithium-ion-battery-3000-mah-500x500.jpg",
//     name:"3000mah 18650 Li-ion",
//     price :219,
//     quantity: 2,
//     stock:20,
//   }
// ];
// const subtotal = 4000;
// const tax = Math.round(subtotal*0.18);
// const shippingCharges = 40;
// const discount = 400;
// const total = subtotal + tax + shippingCharges - discount;

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges, discount} = useSelector((state: {cartReducer: CartReducerInitialState}) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);
  const dispatch = useDispatch();
  
  const incrementHandler =(cartItem: CartItem) => {
    if(cartItem.quantity >= cartItem.stock)
       return toast.error("Sorry, stocks are limited!");
    
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1}))
  };

  const decrementHandler =(cartItem: CartItem) => {
    if(cartItem.quantity < 2)
      return toast.error("Minimum order quantity is 1");
    dispatch(addToCart({...cartItem, quantity: cartItem.quantity - 1}));
  };

  const removeHandler =(productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    const {token, cancel} = axios.CancelToken.source()

    const timeOutId = setTimeout(() => {

      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {cancelToken: token})
      .then((res) => {
        dispatch(discountApplied(res.data.discount));
        setisValidCouponCode(true);
        dispatch(calculatePrice());
        if (res.data.total - res.data.discount < 0) {
          setisValidCouponCode(false);
      } else {
          // Apply the discount
          dispatch(calculatePrice());
      } 
      })
      .catch((e) => {
        console.log(e.response.data.message);
        setisValidCouponCode(false);
        dispatch(calculatePrice());
      }) 
    },800);

    return () => {
       clearTimeout(timeOutId);
       cancel();
       setisValidCouponCode(false);
    }
  },[couponCode])
  
  useEffect(() => {
    dispatch(calculatePrice());
}, [cartItems])  // As there is an change in cart items, just call the function calculatePrice()

  return (
    <div className="cart">
      <main>

      {
        cartItems.length > 0 ? cartItems.map((i,idx) => (
          <CartItemCard incrementHandler={incrementHandler} decrementHandler={decrementHandler} removeHandler={removeHandler} key={idx} cartItem={i}/>)) : 
          <h3>Well, your cart seems to be empty. Shop Now and Save more!</h3>
      }

      </main>
        <aside>
          <p>Subtotal: ₹{subtotal}</p>
          <p>GST: ₹{tax}</p>
          <p>Shipping Charges (Incl. GST): ₹{shippingCharges}</p>
          <p> Discount:  
            <em className="green">&nbsp; - ₹{discount}</em>
          </p>
          <p>
            <b> Total: ₹{total}</b>
          </p>
          <input 
          type="text"
          placeholder="Coupon Code (if any)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          />

          {
            couponCode && (isValidCouponCode ? (<span className="green"> <em>Congratulations! </em> You get ₹{discount} off by applying <code>{couponCode}</code></span> ): (<span className="red"> 
              Invalid Coupon Code! < MdErrorOutline/>
              </span>
            ))}

            { cartItems.length > 0 && 
              <Link to="/shipping"> Checkout!</Link>
            }
        </aside>
      </div>
  )
}

export default Cart