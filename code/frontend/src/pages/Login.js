import { useState } from "react";
import React, { useEffect } from "react";
import backgroundImage from "../assets/images/backgroundDemo.jpg";
import "../assets/css/loginAndRegister.css";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { loginAPI } from "../services/auth/UsersService";
import "react-toastify/dist/ReactToastify.css"; // import first
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email_or_username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email_or_username || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      setLoadingAPI(true);
      let res = await loginAPI(email_or_username, password);
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        navigate(routes.homePage);
      } else {
        if (res && res.status === 401) {
          toast.error(res.data.error);
        }
      }
    } catch (error) {}
    setLoadingAPI(false);
  };

  useEffect(() => {
    // Set class and background image for the body
    document.body.classList.add("img");
    document.body.classList.add("js-fullheight");
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    let token = localStorage.getItem("token");
    if (token) {
      navigate(routes.homePage);
    }
    // Cleanup function to remove added class and background image
    return () => {
      document.body.classList.remove("img");
      document.body.classList.remove("js-fullheight");
      document.body.style.backgroundImage = "none";
    };
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="ftco-section-login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="login-wrap p-0">
                <h3 className="mb-4 text-center">Đăng nhập LittleLoveLy</h3>
                <form onSubmit={handleLogin} className="signin-form">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Gmail hoặc Số điện thoại"
                      value={email_or_username}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      id="password-field"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      toggle="#password-field"
                      className={
                        showPassword
                          ? "fa fa-fw fa-eye-slash field-icon"
                          : "fa fa-fw fa-eye field-icon"
                      }
                      onClick={() => {
                        setShowPassword((prevState) => !prevState);
                      }}></span>
                  </div>
                  <div className="form-group">
                    <button
                      className={"form-control btn btn-primary submit px-3"}
                      disabled={email_or_username && password ? false : true}
                      type="submit">
                      Đăng nhập &nbsp;
                      {loadingAPI && <i className="fas fa-spinner fa-spin"></i>}
                    </button>
                  </div>
                  <div className="form-group">
                    <div className="forgot-pwd text-center">
                      <a
                        href={routes.forgotPassword}
                        style={{ color: "#fff", textDecoration: "none" }}>
                        Quên mật khẩu ?
                      </a>
                    </div>
                  </div>
                </form>
                <p className="w-100 text-center">
                  &mdash; Chưa có tài khoản ? &mdash;
                </p>
                <div className="form-group">
                  <button
                    onClick={() => {
                      navigate({
                        pathname: routes.register,
                      });
                    }}
                    className="form-control btn btn-primary submit px-3">
                    Đăng kí tài khoản
                  </button>
                </div>
                <div className="form-group">
                  <div className="forgot-pwd text-center">
                    <Link
                      to={routes.homePage}
                      style={{ textDecoration: "none", color: "white" }}>
                      Quay lại trang chủ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
