import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../routes";
import StaffHeader from "../components/StaffHeader";
import { toast } from "react-toastify";
import Switch from 'react-switch';
import instance from "../services/auth/customize-axios";
import {
  giftsAll,
  deactivateGift,
  activateGift,
} from "../services/auth/UsersService";
import StaffSideBar from "../components/StaffSideBar";
import "../assets/css/manage.css";
import StaffBackToTop from "../components/StaffBackToTop"
export default function ManageGift() {
  const [giftList, setGiftList] = useState([]);
  const [filteredGifts, setFilteredGifts] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortByActive, setSortByActive] = useState(null);
  const [sortOrderActive, setSortOrderActive] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const giftsPerPage = 20;

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkAuthentication = () => {
      const userRole = localStorage.getItem("userRole");
      if (!userRole || userRole !== "ROLE_STAFF") {
        navigate('/');
      }
    };
    checkAuthentication();

    const fetchGifts = async () => {
      try {
        let response = await giftsAll();
        if (response) {
          setGiftList(response);
          setFilteredGifts(response);
        } else {
          setGiftList([]);
          setFilteredGifts([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải quà tặng!");
        setGiftList([]);
        setFilteredGifts([]);
      }
    };
    fetchGifts();
  }, [navigate]);

  const sortGifts = (field) => {
    let sortedGifts = [...filteredGifts];
    if (field === 'active') {
      sortedGifts.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));
    } else {
      sortedGifts.sort((a, b) => {
        if (field === 'name') {
          return a.name.localeCompare(b.name);
        } else if (field === 'point') {
          return a.point - b.point;
        } else if (field === 'stock') {
          return a.stock - b.stock;
        }
        return 0;
      });
    }
    if (sortOrder === 'desc') {
      sortedGifts.reverse();
    }
    setFilteredGifts(sortedGifts);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    sortGifts(field);
  };

  const handleActiveSort = () => {
    if (sortByActive === 'active') {
      setSortOrderActive(sortOrderActive === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByActive('active');
      setSortOrderActive('asc');
    }
    sortGifts('active');
  };

  const handleToggle = async (giftId, currentStatus) => {
    if (currentStatus) {
      await deactivateGift(giftId);
    } else {
      await activateGift(giftId);
    }
    setFilteredGifts(prevState =>
      prevState.map(gift =>
        gift.giftId === giftId ? { ...gift, active: !gift.active } : gift
      )
    );
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = giftList.filter(gift =>
      gift.name.toLowerCase().includes(query)
    );
    setFilteredGifts(filtered);
    setCurrentPage(1);
  };

  const indexOfLastGift = currentPage * giftsPerPage;
  const indexOfFirstGift = indexOfLastGift - giftsPerPage;
  const currentGifts = filteredGifts.slice(indexOfFirstGift, indexOfLastGift);
  const totalPages = Math.ceil(filteredGifts.length / giftsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                placeholder="Tìm kiếm quà tặng..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="add-product-btn">
              <Link to={routes.addGift} className="add-product-link">
                Thêm quà tặng mới
              </Link>
            </div>
          </div>
          <table className="manage-table">
            <thead className="manage-table-head">
              <tr>
                <th className="index-head" style={{ width: '5%' }}>STT</th>
                <th className="name-head" style={{ width: '22%' }} onClick={() => handleSort('name')}>
                  Tên quà tặng
                  {sortBy === 'name' && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th className="img-head" style={{ width: '15%' }}>Hình ảnh</th>
                <th className="name-head" style={{ width: '15%' }} onClick={() => handleSort('point')}>
                  Điểm đổi quà
                  {sortBy === 'point' && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th className="img-head" style={{ width: '15%' }} onClick={() => handleSort('stock')}>
                  Tồn kho
                  {sortBy === 'stock' && (
                    <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th className="img-head" style={{ width: '11%' }} onClick={handleActiveSort}>
                  Trạng thái
                  {sortByActive === 'active' && (
                    <span>{sortOrderActive === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
                <th className="img-head" style={{ width: '9%' }}>Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody className="manage-table-body">
              {currentGifts.length > 0 ? (
                currentGifts.map((gift, index) => (
                  <tr key={gift.giftId}>
                    <td className="index-body">{indexOfFirstGift + index + 1}</td>
                    <td className="name-body">{gift.name}</td>
                    <td className="img-body">
                      <img
                        src={`${instance.defaults.baseURL}/images/gifts/${gift.imagePath}`}
                        alt={gift.name}
                        style={{ width: '50%', height: '50%' }}
                      />
                    </td>
                    <td className="point-body">{gift.point}</td>
                    <td className="stock-body">{gift.stock}</td>
                    <td className="active-body">
                      <Switch
                        onChange={() => handleToggle(gift.giftId, gift.active)}
                        checked={gift.active}
                        offColor="#ff0000"
                        onColor="#27ae60"
                      />
                    </td>
                    <td className="update-body">
                      <Link
                        to={`${routes.updateGift}/${gift.name}?id=${gift.giftId}`} className="update-link">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>

                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Không có quà tặng nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="manage-pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleClick(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
      <StaffBackToTop />
    </div>
  );
}
