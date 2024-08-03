
import { MdErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";


const NotFound = () => {
  return (
    <div className="container not-found">
        <h1>ERROR 404 - Page Not Found!</h1>    
        <MdErrorOutline />
        <button>
            <Link to={`/`}> Back to Home Page</Link>
        </button>
    </div>
  )
}

export default NotFound