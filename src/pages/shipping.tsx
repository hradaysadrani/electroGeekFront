import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../redux/store";
import { CartReducerInitialState } from "../types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import React from "react";

const Shipping: React.FC = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === "pinCode") {
      if (e.target.value.length > 6) {
        setErrors({
          ...errors,
          pinCode: "Pin Code must be exactly 6 characters long",
        });
      } else {
        setErrors({
          ...errors,
          pinCode: "",
        });
      }
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));
    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    // Check if pinCode is valid before submitting
    if (shippingInfo.pinCode.length !== 6) {
      alert(
        "Oopsie! You have entered an invalid Pincode! Please enter a valid pincode."
      );
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <Link to="/cart" className="back-btn">
        <BiArrowBack />
      </Link>
      <form onSubmit={submitHandler}>
        <h1>Enter Shipping Address</h1>
        {/* Make sure name matches with state variables! */}
        <input
          required
          type="text"
          placeholder="Building, Street info"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Select Country</option>
          <option value="india">India</option>
          <option value="bangladesh">Bangladesh</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pincode"
          name="pinCode"
          minLength={6}
          maxLength={6}
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        {errors.pinCode && <p style={{ color: "red" }}>{errors.pinCode}</p>}
        <button>Pay Now!</button>
        <h2>Simple. Quick. Secure</h2>
      </form>
    </div>
  );
};

export default Shipping;
