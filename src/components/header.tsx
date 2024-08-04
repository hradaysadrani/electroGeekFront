import { signOut } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { User } from '../types/types';
// const user = { _id : "", role: ""};

interface PropsType {
    user: User | null;

}

const Header = ({user}: PropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = async () => {
       try {
         await signOut(auth);
         toast.success("Successfully logged out! See You Again!");
         setIsOpen(false);
       } catch (error) {    
        toast.error("Sign Out Failed.");
       }
    }
  return (
    <nav className={`header`}>
        <Link onClick={() => setIsOpen(false)}  to={"/"}>HOME</Link>
        <section className='header_icons'>
        <Link onClick={() => setIsOpen(false)}  to={"/search"}><FaSearch /></Link>
        </section ><section className='header_icons'>
        <Link onClick={() => setIsOpen(false)}  to={"/cart"}><FaShoppingBag /></Link>
        </section>
        {
            user?._id?(
                <>
                <button onClick={() => setIsOpen((prev) => !prev)}>
                    <FaUser />
                </button>
                <dialog open={isOpen}>
                    <div>
                    {user.role === "admin" && (
                        <p>
                        <Link to="/admin/dashboard">Admin </Link>
                        </p>
                    )}
                    <p>
                    <Link to="/orders"> Orders</Link>
                    </p>
                    <button onClick={logoutHandler}>
                        Logout
                    </button>
                    </div>
                </dialog>
                </>
            ) :  <Link to={"/login"}>LOGIN</Link>

        }
    </nav>
  )
}

export default Header;