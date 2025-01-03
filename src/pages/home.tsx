import {Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import  { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler =(cartItem: CartItem) => {
    if(cartItem.stock < 1){
      return toast.error("Sorry, Product is out of Stock!");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart Successfully!");
  };

  if(isError){
    toast.error("Cannot fetch Products.");
  }

  return (
    <div className="home">
      <section>
      </section>
      <h1> Latest Products
      <Link to="/search" className="findmore"> 
       More
       </Link>
      </h1>
      <main>
        { isLoading ? <Skeleton /> :
          (data?.products.map(i => 
          <ProductCard 
          key={i._id}
          productId={i._id} 
          name={i.name.length > 50 ? `${i.name.slice(0, 50)}...` : i.name}
          price= {i.price} 
          stock= {i.stock}
          photo= {i.photo}
          handler={addToCartHandler}/>))
        }
      </main>
      </div>
  )
}

export default Home