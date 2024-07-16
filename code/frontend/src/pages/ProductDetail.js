import React, { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";
import ProductDetailPresentation from "../components/ProductDetailPresentation";
import "../assets/css/productDetail.css";
import Breadcrumb from "../components/Breadcrum";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { name: productName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const userRole = localStorage.getItem("userRole");
      if (userRole === "ROLE_STAFF" || userRole === "ROLE_ADMIN") {
        navigate("/");
      }
    };
    checkAuthentication();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="content">
        <Sidebar
          role={localStorage.getItem("userRole")}
          customerName={localStorage.getItem("name")}
          customerPoint={localStorage.getItem("point")}
        />
        <div className="content-detail">
          <Breadcrumb value={productName} customName="Tất cả sản phẩm" />
          <div className="content-display ">
            <div className="content-product-detail-row-1">
              <ProductDetailPresentation />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
