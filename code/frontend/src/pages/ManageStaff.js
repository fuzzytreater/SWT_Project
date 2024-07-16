import React, { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "../assets/css/manage.css";
import {
  getUsersByRoleAll,

} from "../services/auth/UsersService";
import AdminSideBar from "../components/AdminSideBar";
import StaffBackToTop from "../components/StaffBackToTop";
import { routes } from "../routes";

export default function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const userRole = localStorage.getItem("userRole");
      if (!userRole || userRole !== "ROLE_ADMIN") {
        navigate("/");
      }
    };
    checkAuthentication();

    const fetchStaffs = async () => {
      try {
        let response = await getUsersByRoleAll("ROLE_STAFF");
        if (response) {
          setStaffList(response);
        } else {
          setStaffList([]);
        }
      } catch (error) {
        console.error("Error fetching staffs:", error);
        toast.error("Không thể tải nhân viên");
        setStaffList([]);
      }
    };
    fetchStaffs();
  }, [navigate, location]);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredStaffList = staffList.filter((staff) =>
    staff.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div>
      <AdminHeader />

      <div className="manage-content">
        <AdminSideBar />

        <div className="manage-content-detail">
          <div className="search-add-table">
            <div className="table-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>

            <div className="add-product-btn">
              <Link to={routes.addStaff} className="add-product-link">
                Thêm nhân viên mới
              </Link>
            </div>
          </div>

          <table className="manage-table">
            <thead className="manage-table-head">
              <tr>
                <th className="index-head" style={{ width: "5%" }}>STT</th>
                <th className="name-head" style={{ width: "19%" }}>Họ và tên</th>
                <th className="username-head" style={{ width: "15%" }}>Tên tài khoản</th>
                <th className="mail-head" style={{ width: "18%" }}>Gmail</th>
                <th className="phone-head" style={{ width: "16%" }}>Số điện thoại</th>
                <th className="regisDate-head" style={{ width: "16%" }}>Ngày đăng kí</th>
                <th className="update-head" style={{ width: "10%" }}>Chỉnh sửa</th>
              </tr>
            </thead>

            <tbody className="manage-table-body">
              {filteredStaffList.length > 0 ? (
                filteredStaffList.map((staff, index) => (
                  <tr key={index}>
                    <td className="index-body">{index + 1}</td>
                    <td className="name-body">{staff.name}</td>
                    <td className="username-body">{staff.username}</td>
                    <td className="mail-body">{staff.mail}</td>
                    <td className="phone-body">{staff.phone}</td>
                    <td className="regisDate-body">{staff.registeredDate}</td>
                    <td className="update-body">
                      <Link
                        to={`${routes.updateStaff}/${staff.username}`}
                        className="update-link">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Không có nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <StaffBackToTop />
    </div>
  );
}
