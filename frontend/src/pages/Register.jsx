import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
    `${API_URL}/api/interview`,
        {
          name,
          email,
          password,
        }
      );

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register."
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
          background:#f4f6fb;
      }

      .container{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:20px;
      }

      .card{
          width:430px;
          background:white;
          border-radius:18px;
          padding:40px;
          box-shadow:0 10px 30px rgba(0,0,0,.08);
      }

      .logo{
          font-size:34px;
          text-align:center;
          margin-bottom:10px;
      }

      h1{
          text-align:center;
          margin-bottom:10px;
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
          border-radius:10px;
          border:1px solid #ddd;
          margin-bottom:18px;
          outline:none;
          font-size:15px;
      }

      input:focus{
          border-color:#5b5ce2;
      }

      .passwordBox{
          position:relative;
      }

      .toggle{
          position:absolute;
          right:15px;
          top:14px;
          cursor:pointer;
          color:#666;
          font-size:14px;
      }

      button{
          width:100%;
          padding:15px;
          background:#5b5ce2;
          color:white;
          border:none;
          border-radius:10px;
          font-size:16px;
          cursor:pointer;
          font-weight:600;
          transition:.25s;
      }

      button:hover{
          background:#4849d4;
      }

      button:disabled{
          opacity:.7;
      }

      .error{
          background:#ffe6e6;
          color:#c62828;
          padding:12px;
          border-radius:8px;
          margin-bottom:18px;
          text-align:center;
      }

      .success{
          background:#e7ffe9;
          color:#2e7d32;
          padding:12px;
          border-radius:8px;
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

          <h1>Create Account</h1>

          <p className="subtitle">
            Join PrepInterview and practice smarter.
          </p>

          <form onSubmit={handleRegister}>

            {error && <div className="error">{error}</div>}

            {success && <div className="success">{success}</div>}

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />

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
                className="toggle"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide":"Show"}
              </span>

            </div>

            <button disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <div className="footer">
            Already have an account?{" "}
            <span onClick={()=>navigate("/login")}>
              Login
            </span>
          </div>

        </div>

      </div>
    </>
  );
}