import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice"

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // New state for search input
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  // Filtering orders based on searchTerm
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();

    // Check order ID match (without # sign)
    const idMatch = order._id.toLowerCase().includes(term);

    // Check customer name match
    const customerName = order.user?.name || '';
    const customerMatch = customerName.toLowerCase().includes(term);

    // Check city match
    // Assuming you have city in order.shippingAddress.city or similar
    const city = order.shippingAddress?.city || '';
    const cityMatch = city.toLowerCase().includes(term);

    return idMatch || customerMatch || cityMatch;
  });

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold m-6'>Order Management</h2>

      {/* Search Bar */}
      <div className='mb-4'>
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name or City"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </div>

      <div className='overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='min-w-full text-left text-gray-500 '>
          <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
            <tr>
              <th className='py-3 px-4'>Order Id</th>
              <th className='py-3 px-4'>Customer</th>
              <th className='py-3 px-4'>Total Price</th>
              <th className='py-3 px-4'>Status</th>
              <th className='py-3 px-4'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                >
                  <td 
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className='py-4 px-4 font-medium text-gray-900 whitespace-nowrap'>
                    #{order._id}
                  </td>
                  <td className='p-4'>{order.user?.name}</td>
                  <td className='p-4'>{order.totalPrice.toFixed(2)}</td>
                  <td className='p-4'>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className='p-4'>
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='p-4 text-center text-gray-500'>
                  No Orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderManagement
