import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'
import { fetchOrderDetails } from '../../redux/slices/orderSlice';
import { updateOrderStatus, updateOrderExpectedDelivery } from '../../redux/slices/adminOrderSlice';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  const [expectedDate, setExpectedDate] = useState('');
  const [status, setStatus] = useState('');
  const [editingDate, setEditingDate] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (orderDetails) {
      setExpectedDate(orderDetails.expectedDelivery ? orderDetails.expectedDelivery.split('T')[0] : '');
      setStatus(orderDetails.status || 'Processing');
    }
  }, [orderDetails]);

  const handleStatusUpdate = () => {
    dispatch(updateOrderStatus({ id, status })).then(() => {
      dispatch(fetchOrderDetails(id));  // Refresh after status update
    });
  };

  const handleExpectedDateSave = () => {
    if (!expectedDate) {
      alert('Please select a valid date');
      return;
    }
    dispatch(updateOrderExpectedDelivery({ id, expectedDelivery: expectedDate }))
      .then(() => {
        dispatch(fetchOrderDetails(id));  // Refresh after expected date update
        setEditingDate(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!orderDetails) return <p>No order found</p>;

  // Disable editing date if order is delivered
  const canEditDate = status !== 'Delivered';

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Admin Order Details</h2>

      <div className='mb-4'>
        <p><strong>Order ID:</strong> #{orderDetails._id}</p>
        <p><strong>Placed On:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8'>
        <div>
          <h4 className='font-semibold mb-2'>Payment Info</h4>
          <p>Method: {orderDetails.paymentMethod}</p>
          <p>Status: {orderDetails.isPaid ? 'Paid' : 'Pending'}</p>
        </div>
        <div>
          <h4 className='font-semibold mb-2'>Shipping</h4>
          <p>👤 {orderDetails?.user?.name}</p>
          <p>🏠 {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
        </div>
        <div>
          <h4 className='font-semibold mb-2'>Expected Delivery</h4>
          {!editingDate ? (
            <>
              {status === 'Delivered' && orderDetails.deliveredAt ? (
                <p>Delivered at {new Date(orderDetails.deliveredAt).toLocaleString()}</p>
              ) : (
                <p>{expectedDate || 'Not Set'}</p>
              )}
              {canEditDate && (
                <button
                  onClick={() => setEditingDate(true)}
                  className='text-blue-500 hover:underline mt-1'
                >
                  Edit Date
                </button>
              )}
            </>
          ) : (
            <>
              <input
                type="date"
                value={expectedDate}
                min={new Date().toISOString().split('T')[0]} // no past date
                onChange={(e) => setExpectedDate(e.target.value)}
                className='p-2 border rounded w-full mb-2'
              />
              <button
                onClick={handleExpectedDateSave}
                className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2'
              >
                Save
              </button>
              <button
                onClick={() => setEditingDate(false)}
                className='bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400'
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className='mb-6'>
        <label className='block text-sm font-semibold mb-1'>Update Order Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='p-2 border rounded w-full max-w-sm mb-2'
        >
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleStatusUpdate}
          className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
        >
          Update Status
        </button>
      </div>

      <h4 className='text-lg font-semibold mb-4'>Products</h4>
      <table className='min-w-full text-left mb-6'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='py-2 px-4'>Product</th>
            <th className='py-2 px-4'>Price</th>
            <th className='py-2 px-4'>Qty</th>
            <th className='py-2 px-4'>Total</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.orderItems.map((item) => (
            <tr key={item.productId} className='border-b'>
              <td className='py-2 px-4 flex items-center'>
                <img src={item.image} alt={item.name} className='w-10 h-10 object-cover mr-2 rounded' />
                {item.name}
              </td>
              <td className='py-2 px-4'>${item.price}</td>
              <td className='py-2 px-4'>{item.quantity}</td>
              <td className='py-2 px-4'>${item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate("/admin/orders")}
        className='text-blue-500 hover:underline'
      >
        ← Back to Orders
      </button>
    </div>
  );
};

export default AdminOrderDetails;
