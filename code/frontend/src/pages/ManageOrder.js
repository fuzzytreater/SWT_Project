import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import StaffHeader from "../components/StaffHeader";
import { toast } from "react-toastify";
import instance from "../services/auth/customize-axios";
import {
  formatPrice,
  ordersAll,
  getOrderById,
  confirmOrder,
} from "../services/auth/UsersService";
import StaffSideBar from "../components/StaffSideBar";
import "../assets/css/manage.css";
import StaffBackToTop from "../components/StaffBackToTop";
import { routes } from "../routes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from "@mui/material";

export default function ManageOrder() {
  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const [isConfirmOrderDialogOpen, setIsConfirmOrderDialogOpen] =
    useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const userRole = localStorage.getItem("userRole");
      if (!userRole || userRole !== "ROLE_STAFF") {
        navigate("/");
      }
    };
    checkAuthentication();

    const fetchOrders = async () => {
      try {
        let response = await ordersAll();
        if (response) {
          setOrderList(response);
          setFilteredOrders(applyStatusFilter(response, filterStatus));
        } else {
          setOrderList([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải đơn hàng!");
        setOrderList([]);
        setFilteredOrders([]);
      }
    };
    fetchOrders();
  }, [refresh, filterStatus]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOrders(applyStatusFilter(orderList, filterStatus));
    } else {
      const filtered = orderList.filter((order) =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(applyStatusFilter(filtered, filterStatus));
    }
  }, [searchQuery, orderList, filterStatus]);

  const applyStatusFilter = (orders, status) => {
    if (status === "") return orders;
    return orders.filter((order) => order.status.includes(status));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const CustomDialog = styled(Dialog)({
    "& .MuiDialog-paper": {
      width: "70%",
      maxHeight: "650px",
    },
    "& .MuiPaper-root": {
      borderRadius: "20px",
    },
  });

  const CustomDialogTitle = styled(DialogTitle)({
    fontWeight: "bold",
    backgroundColor: "#c0bfbf",
    color: "#2d3436",
    marginBottom: "20px",
  });

  const CustomButton = styled(Button)({
    backgroundColor: "#c0bfbf",
    color: "#2d3436",
    "&:hover": {
      background: "#979797",
    },
    marginBottom: "20px",
    marginRight: "5px",
    borderRadius: "10px",
    width: "150px",
  });

  const handleOrderClick = async (order) => {
    const { orderId } = order;
    try {
      const response = await getOrderById(orderId);
      setSelectedOrder(response);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  const handleConfirmOrder = (order) => {
    setOrderToConfirm(order);
    setIsConfirmOrderDialogOpen(true);
  };

  const handleConfirmed = async () => {
    try {
      const response = await confirmOrder(orderToConfirm.orderId);
      if (response) {
        setRefresh(!refresh);
        toast.success(`Đơn hàng ${orderToConfirm.orderId} đã được xác nhận`);
      } else {
        toast.error(`Không thể xác nhận đơn hàng ${orderToConfirm.orderId}`);
      }
    } catch (error) {
      toast.error(`Không thể xác nhận đơn hàng ${orderToConfirm.orderId}`);
      console.error(error);
    }
    setIsConfirmOrderDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmOrderDialogOpen(false);
  };

  const getStatusDisplay = (status) => {
    if (status === "COD_PENDING" || status === "ONLINE_PENDING") {
      return { text: "Chưa xác nhận", color: "orange" };
    } else if (status === "COD_CONFIRMED" || status === "ONLINE_CONFIRMED") {
      return { text: "Đã xác nhận", color: "#2980b9" };
    } else if (status === "COD_RECEIVED" || status === "ONLINE_RECEIVED") {
      return { text: "Giao thành công", color: "green" };
    }
  };

  const getPayMentDisplay = (status) => {
    if (status.includes("COD")) {
      return "Thanh toán khi nhận hàng";
    } else if (status.includes("ONLINE")) {
      return "Thanh toán bằng VnPay";
    }
  };

  return (
    <div>
      <StaffHeader />

      <div className="manage-content">
        <StaffSideBar />

        <div className="manage-content-detail">
          <div className="search-add-table">
            <div className="table-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="manage-button-search-bar">
              <button
                className={filterStatus === "PENDING" ? "selected" : ""}
                onClick={() => handleStatusFilter("PENDING")}
              >
                Chưa xác nhận
              </button>
              <button
                className={filterStatus === "CONFIRMED" ? "selected" : ""}
                onClick={() => handleStatusFilter("CONFIRMED")}
              >
                Đã xác nhận
              </button>
              <button
                className={filterStatus === "RECEIVED" ? "selected" : ""}
                onClick={() => handleStatusFilter("RECEIVED")}
              >
                Giao thành công
              </button>
              <button
                className={filterStatus === "" ? "selected" : ""}
                onClick={() => handleStatusFilter("")}
              >
                Tất cả
              </button>
            </div>
          </div>
          <table className="manage-table">
            <thead>
              <tr>
                <th className="index-head" style={{ width: "5%" }}>
                  STT
                </th>
                <th className="createdDate-head" style={{ width: "10%" }}>
                  Ngày tạo đơn
                </th>
                <th className="status-head" style={{ width: "10%" }}>
                  Tình trạng
                </th>
                <th className="orderId-head" style={{ width: "10%" }}>
                  Mã đơn hàng
                </th>
                <th className="name-head" style={{ width: "15%" }}>
                  Người nhận
                </th>
                <th className="phone-head" style={{ width: "10%" }}>
                  Số điện thoại
                </th>
                <th className="detail-head" style={{ width: "9%" }}>
                  Chi tiết
                </th>
              </tr>
            </thead>

            <tbody className="manage-table-body">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="index-body">{index + 1}</td>
                    <td className="createdDate-body">{order.createdDate}</td>
                    <td
                      className="status-body"
                      style={{ color: getStatusDisplay(order.status).color }}
                    >
                      {getStatusDisplay(order.status).text}
                    </td>
                    <td className="orderId-body">{order.orderId}</td>
                    <td className="name-body">{order.cusName}</td>
                    <td className="phone-body">{order.cusPhone}</td>
                    <td className="update-body">
                      <Link
                        className="update-link"
                        onClick={() => handleOrderClick(order)}
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Không có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CustomDialog
          open={!!selectedOrder}
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomDialogTitle>Chi tiết đơn hàng</CustomDialogTitle>
          <DialogContent>
            {selectedOrder && (
              <div>
                <p>
                  <b>Mã đơn hàng:</b> {selectedOrder.orderId}
                </p>
                <p>
                  <b>Địa chỉ giao hàng: </b>
                  {selectedOrder.cusStreet +
                    ", " +
                    selectedOrder.cusWard +
                    ", " +
                    selectedOrder.cusDistrict +
                    ", " +
                    selectedOrder.cusCity}
                </p>
                <p>
                  <b>Tổng số sản phẩm:</b> {selectedOrder.orderDetails.length}
                </p>
                <p>
                  <b>Tình trạng:</b>{" "}
                  {getStatusDisplay(selectedOrder.status).text}
                </p>
                <p>
                  <b>Mã vận đơn:</b> {selectedOrder.trackingCode}
                </p>

                <div>
                  {selectedOrder.orderDetails.map((orderDetail) => (
                    <div
                      style={{ display: "flex", margin: "20px 0" }}
                      key={orderDetail.product.productId}
                    >
                      <div className="popup-detail-left">
                        <img
                          src={`${instance.defaults.baseURL}/images/products/${orderDetail.product.productImages[0].imagePath}`}
                          alt={orderDetail.product.name}
                          style={{ width: "100px", height: "100px" }}
                        />
                      </div>
                      <div className="popup-detail-right">
                        <Link
                          to={`${routes.products}/${orderDetail.product.name}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div style={{ fontWeight: "bold", color: "black" }}>
                            {orderDetail.product.name}
                          </div>
                        </Link>
                        <div>x {orderDetail.quantity}</div>
                        <div>{formatPrice(orderDetail.price)}đ</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tổng tiền hàng:</span>{" "}
                  {formatPrice(selectedOrder.basePrice)}đ
                </p>
                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Phí vận chuyển:</span>
                  {formatPrice(selectedOrder.shippingFee)}đ
                </p>

                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Giảm giá:</span> -{" "}
                  {formatPrice(
                    selectedOrder.basePrice +
                      selectedOrder.shippingFee -
                      selectedOrder.postDiscountPrice
                  )}
                  đ
                </p>
                <p style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Phương thức thanh toán:</span>
                  {getPayMentDisplay(selectedOrder.status)}
                </p>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #9fa0a0b0",
                    padding: "10px 0",
                  }}
                >
                  <span>
                    <b>Thành tiền:</b>{" "}
                  </span>
                  {formatPrice(selectedOrder.postDiscountPrice)}đ
                </p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={() => handleConfirmOrder(selectedOrder)}>
              Xác nhận đơn
            </CustomButton>
            <CustomButton onClick={handleClose}>Đóng</CustomButton>
          </DialogActions>
        </CustomDialog>
        <CustomDialog
          open={isConfirmOrderDialogOpen}
          onClose={handleCloseConfirmDialog}
          fullWidth
          maxWidth="xs"
        >
          <CustomDialogTitle>Xác nhận đơn hàng</CustomDialogTitle>
          <DialogContent>
            <span style={{ fontSize: "18px" }}>
              Bạn có chắc chắn muốn xác nhận đơn hàng?
            </span>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleConfirmed} color="secondary">
              Có
            </CustomButton>
            <CustomButton onClick={handleCloseConfirmDialog} color="primary">
              Không
            </CustomButton>
          </DialogActions>
        </CustomDialog>
        <StaffBackToTop />
      </div>
    </div>
  );
}
