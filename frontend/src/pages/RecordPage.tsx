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

interface OrderRecordDialogProps {
    // onClose: () => void;
}

const RecordPage: React.FC<OrderRecordDialogProps> = () => {
    return (
      <>
        <div className="order-record-overlay">
            <div className="order-record-content">
                {orders.map((order, index) => (
                    <div className={`order ${index % 2 === 0 ? 'gray-background' : ''}`} key={index}>
                        <div className="tags">
                            <div className="status-tag">{order.status}</div>
                            <div className="date-tag">{order.date}</div>
                        </div>
                        <div className="order-details">
                            <div className="store">{order.store}</div>
                            <div className="amount">${order.amount}</div>
                        </div>
                        <button className="view-details-button">查看訂單細節</button>
                    </div>
                ))}
                {/* <button onClick={onClose}>Close</button> */}
            </div>
        </div>
      </>
    );
}

export default RecordPage;
