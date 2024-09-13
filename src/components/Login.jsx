import "./Login.css";
import "./Spinner.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import logo from "../assets/systory-logo.png";

const Login = (props) => {
  const IP_ADDRESS = import.meta.env.VITE_IP_ADDRESS;
  console.log(IP_ADDRESS);
  const [userInput, setUserInput] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { records } = props;

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    if (
      username &&
      records &&
      records.length > 0 &&
      records[records.length-1].LIB_ID
    ) {
      navigate(`/content?id=${records[records.length-1].LIB_ID}`);
    } else if (records && records.length > 0) {
      navigate("/");
    }
  }, [records, navigate]);

  const onLogin = async () => {
    setLoading(true);
    try {
      if (!userInput || !password) return;
      const response = await axios.post(`${IP_ADDRESS}/getUser`, {
        userInput,
        password,
      });
      console.log(response);
      let user = response.data;
      console.log(user);
      if (user.length > 0) {
        sessionStorage.setItem("username", user[0].name);
        sessionStorage.setItem("admin", user[0].role);
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      {loading && <Spinner />}
      <div className="form-login">
        <div className="box">
          <h1 className="text-center">Login to website</h1>
          <form>
            <div className="form-group">
              <label className="form-label fw-bold" htmlFor="email">
                Username or Email
              </label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Name or Email"
                onChange={(e) => setUserInput(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label fw-bold" htmlFor="password">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
            </div>
            <button
              className="btn"
              type="button"
              name="signin"
              style={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                textAlign: "center",
                fontSize: "18px",
              }}
              onClick={() => onLogin()}
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
