import React from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";

export default function StaffSideBar() {
    return (

        <div className="manage-side-bar">
            <div className="manage-nav-bar">

                <Link to={routes.manageOrder} style={{ color: 'black' }}>
                    Quản lý đơn hàng
                </Link>

                <Link to={routes.manageProduct} style={{ color: 'black' }}>
                    Quản lý sản phẩm
                </Link>

                <Link to={routes.manageArticle} style={{ color: 'black' }}>
                    Quản lý bài viết
                </Link>

                <Link to={routes.manageVoucher} style={{ color: 'black' }}>
                    Quản lý voucher
                </Link>

                <Link to={routes.manageGift} style={{ color: 'black' }}>
                    Quản lý quà tặng
                </Link>

                <Link to={routes.staffChat} style={{ color: 'black' }}>
                    Chăm sóc khách hàng
                </Link>
            </div>
        </div>


    );
}

