import { MoreVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Add_Blog from "./Add_Blog";
import Update_Blogs from "./Update_Blogs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";

const Api = import.meta.env.VITE_BACKEND_URL;

const AdminPanel = () => {
  // for searchbar
  const [search, setSearch] = useState("");

  // for model open and close and also navigate
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // try a index open card
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);

  //for update popup menu
  const [update, setUpdate] = useState(false);

  // function for toggle button
  const handleToggleMenu = (event, index) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  // for outside the menu close
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenuIndex(null);
    }
  };

  useEffect(() => {
    if (openMenuIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuIndex, handleClickOutside]);

  // for get data from api(backend)
  const [getdata, setGetdata] = useState([]);
  const [updateData, setUpdateData] = useState(null);

  const fetchRes = () => {
     axios
       .get(`${Api}/api/blogs`)
       .then((res) => setGetdata(res.data))
       .catch((error) => console.error("Error fetching users:", error));
  };
  useEffect(() => {
    fetchRes();
  }, []);

  /*for update*/
  const handleUpdate = async (e, item) => {
    e.preventDefault();
    setUpdateData(item);
    setUpdate(true);
  };

  // Ensure that when the update modal closes, it fetches new data
  const handleUpdateClose = () => {
    setUpdate(false);
    fetchRes(); // Refresh data after update
  };

  // for delete
 const handleDelete = async (e, index) => {
   e.preventDefault();

   const blogId = getdata[index]._id;
   const token = localStorage.getItem("token");

   try {
     const response = await fetch(`http://127.0.0.1:8080/api/blogs/${blogId}`, {
       method: "DELETE",
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     if (response.ok) {
       fetchRes(); // Refresh after deletion
     } else {
       const errorData = await response.json();
       console.error(
         "Delete failed:",
         errorData.message || response.statusText
       );
     }
   } catch (err) {
     console.error("Delete request error:", err);
   }

   setOpenMenuIndex(null);
 };


  const handleAddClose = () => {
    setShowModal(false);
    fetchRes(); // Refresh data after adding a new blog
  };

  // search filtering
  const filterdata = getdata.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="w-full z-10 overflow-y-auto bg-gradient-to-r from-gray-300 via-white to-gray-100">
        <div>
          {showModal && <Add_Blog onClose={handleAddClose} />}
          {update && (
            <Update_Blogs onClose={handleUpdateClose} oldData={updateData} />
          )}
        </div>
        <div className="flex justify-between">
          {/* searchbar */}
          <div className="relative w-fit m-2">
            <input
              type="text"
              placeholder="Search"
              name="text"
              className="w-[150px] p-2 text-black pl-10 border border-gray-800 rounded-full outline-none opacity-80 transition-all duration-200 ease-in-out focus:w-[250px] focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              fill="#000000"
              width="20px"
              height="20px"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1/2 left-3 transform -translate-y-1/2"
            >
              <path
                d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                fillRule="evenodd"
              />
            </svg>
          </div>
          {/* Add Blog Button */}
          <div className="relative inline-block m-2">
            <button
              onClick={() => setShowModal(true)}
              className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium tracking-wide text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-lg shadow-md group"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                +
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">
                Add
              </span>
              <span className="relative invisible">Add</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filterdata.map((d, index) => {
            return (
              <div
                key={index}
                className="bg-white shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 w-auto m-2 h-[270px] text-black rounded-xl relative"
              >
                <div className="flex">
                  <button
                    variant="ghost"
                    className="p-2"
                    onClick={(e) => handleToggleMenu(e, index)}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuIndex === index && (
                    <div ref={menuRef} className="absolute left-8 top-0">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white pb-1 mt-1 mr-4 rounded-lg w-16"
                        onClick={(e) => handleDelete(e, index)}
                      >
                        Delete
                      </button>
                      <button
                        className=" bg-green-600 hover:bg-green-700 text-white pb-1 mt-1 rounded-lg w-16"
                        onClick={(e) => handleUpdate(e, d)}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
                <div className="img h-28 rounded-t-xl flex justify-center items-center">
                  <img
                    src={d.mediaUrl}
                    alt=""
                    className="h-28 w-36 rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="info text-center mt-4 space-y-1">
                  <p className="font-semibold text-lg">{d.title}</p>
                  <p className="text-sm text-gray-600">{d.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminPanel;
