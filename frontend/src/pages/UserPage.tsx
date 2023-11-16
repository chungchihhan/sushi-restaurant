import React from 'react';
import BlueSquare from '../components/BlueSquare';
// import './UserInfo.css';

const UserPage = () => {
    return (
        <>
            {/* <div>
                <BlueSquare />
            </div> */}
            <div className="userinfo-overlay">
                <div className="userinfo-content">
                    <h1>個人資料設定</h1>
                    <div className="left-side">
                        <div className="userinfo-row">
                            <label>名稱</label>
                            <input type="text" placeholder="輸入名稱" />
                        </div>
                        <div className="userinfo-row">
                            <label>Email</label>
                            <input type="text" placeholder="輸入Email" />
                        </div>
                        <div className="userinfo-row">
                            <label>手機</label>
                            <input type="text" placeholder="輸入手機" />
                        </div>
                        <div className="userinfo-row">
                            <label>生日</label>
                            <input type="text" placeholder="輸入生日" />
                        </div>
                        <div className="userinfo-row">
                            <label>工號</label>
                            <input type="text" placeholder="輸入工號" />
                        </div>
                        <div className="userinfo-row">
                            <label>預設地址</label>
                            <input type="text" placeholder="輸入預設地址" />
                        </div>
                    </div>
                    <div className="right-side">
                        <div className="info-box">
                            <h2>當月累積消費金額</h2>
                            <p>100000</p>
                        </div>
                    </div>
                    <button className="user-confirm-button">確認</button>
                    {/* <button onClick={onClose}>Close</button> */}
                </div>
            </div>
        </>
    );
}

export default UserPage;
