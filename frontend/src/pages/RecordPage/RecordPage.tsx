import React from 'react';
// import './OrderRecord.css';

const orders = [
  {
    status: '製作中',
    date: '2023/11/11',
    store: '藏壽司',
    amount: 100,
  },
  {
    status: '已完成',
    date: '2023/11/10',
    store: '湯包店',
    amount: 50,
  },
  {
    status: '訂單失敗',
    date: '2023/11/09',
    store: '披薩店',
    amount: 200,
  },
  // Add more orders as needed
];

const RecordPage = () => {
  return (
    <>
      <div className="order-record-overlay p-8 rounded-md">
        <div className="order-record-content grid gap-4">
          {orders.map((order, index) => (
            <div
              className={`order ${index % 2 === 0 ? 'gray-background' : ''} flex bg-info items-center p-4 rounded-md`}
              key={index}
            >
                <div>
                    <div className="tags flex gap-4 rounded-md">
                        <div className="status-tag bg-blue-300">{order.status}</div>
                        <div className="date-tag bg-green-300">{order.date}</div>
                    </div>
                    <div className="order-details">
                        <div className="store">{order.store}</div>
                    </div>
                    <div className="order-details">
                        <div className="amount">${order.amount}</div>
                    </div>
                </div>
                <div>
                    <button className="view-details-button justify-end">查看訂單細節</button>
                </div> 
            </div>
          ))}
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </>
  );
};

export default RecordPage;
