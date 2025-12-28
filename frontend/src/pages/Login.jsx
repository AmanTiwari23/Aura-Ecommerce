import { useState } from "react";
import {useDispatch,useSelector} from "react-redux";
import {loginUser } from "../redux/authSlice"
import {useNavigate} from "react-router-dom";

const Login = () =>{
   const [email,setEmail] = useState("");
   const [password, setPassword] = useState("");

   const dispatch = useDispatch();
   const navigate = useNavigate()

   const {loading , error} = useSelector((state) => state.auth);

   const submitForm = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

   return(
    <div className="min-h-screen flex items-center justify-center">
        <form
        onSubmit={submitForm}
        className="w-full max-w-md p-6 border rounded "
        >

            <h2 className="text-2xl font-bold mb-4"> Login to Aura </h2>
            {error && <p className=" text-red-500">{error}</p>}

            <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-3" 
            value={email}
            onChange={(e)=> setEmail(e.target.value)}/>

            
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

          <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2"
        > {loading ? "Logging in..." : "Login"}</button>

        </form>

    </div>
   )
   
}

export default Login;