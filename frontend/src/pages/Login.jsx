import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
    `${API_URL}/api/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to login. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
      *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Inter,sans-serif;
      }

      body{
          background:#f5f7fb;
      }

      .container{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
      }

      .card{
          width:420px;
          background:white;
          border-radius:20px;
          padding:40px;
          box-shadow:0 10px 35px rgba(0,0,0,.08);
      }

      .logo{
          text-align:center;
          font-size:30px;
          margin-bottom:10px;
      }

      h1{
          text-align:center;
          margin-bottom:8px;
          color:#222;
      }

      .subtitle{
          text-align:center;
          color:#777;
          margin-bottom:30px;
      }

      label{
          display:block;
          margin-bottom:8px;
          font-weight:600;
          color:#444;
      }

      input{
          width:100%;
          padding:14px;
          border:1px solid #ddd;
          border-radius:10px;
          margin-bottom:18px;
          font-size:15px;
          outline:none;
      }

      input:focus{
          border-color:#5b5ce2;
      }

      .passwordBox{
          position:relative;
      }

      .showBtn{
          position:absolute;
          right:15px;
          top:14px;
          cursor:pointer;
          color:#666;
          font-size:14px;
      }

      button{
          width:100%;
          border:none;
          background:#5b5ce2;
          color:white;
          padding:15px;
          border-radius:10px;
          font-size:16px;
          cursor:pointer;
          transition:.25s;
          font-weight:600;
      }

      button:hover{
          background:#4547d6;
      }

      button:disabled{
          opacity:.7;
          cursor:not-allowed;
      }

      .error{
          color:red;
          margin-bottom:18px;
          text-align:center;
      }

      .footer{
          margin-top:25px;
          text-align:center;
          color:#666;
      }

      .footer span{
          color:#5b5ce2;
          cursor:pointer;
          font-weight:600;
      }
      `}</style>

      <div className="container">
        <div className="card">

          <div className="logo">🎯</div>

          <h1>PrepInterview</h1>

          <p className="subtitle">
            Login to continue your AI mock interview
          </p>

          <form onSubmit={handleLogin}>

            {error && <div className="error">{error}</div>}

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <div className="passwordBox">

              <input
                type={showPassword ? "text":"password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <span
                className="showBtn"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide":"Show"}
              </span>

            </div>

            <button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="footer">
            Don't have an account?{" "}
            <span onClick={()=>navigate("/register")}>
              Register
            </span>
          </div>

        </div>
      </div>
    </>
  );
}