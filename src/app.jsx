import React, {useState, useEffect} from 'react';
import './assets/css/reset.css';
import './assets/css/index.css';
import Ajax from './util/request';
import Calender from './Calender/index.jsx';
import Tcp from './TCP/index.jsx';
import Udp from './Udp/index.jsx';
import CircleTable from './CircleTable/index.jsx';

function App(props) {

    const [isTcp, setTcpState] = useState(true);
    const [sendData, setSendData] = useState(null);
    const [recvData, setRecvData] = useState(null);
    const [date, setDate] = useState('');

    const chooseOne = status => {
        setTcpState(status);
    }

    const onChange = data => {
        const {date: time, ratio_rb, ratio_tb} = data;
        setDate(time);
        setSendData(ratio_tb);
        setRecvData(ratio_rb);
    }

    return <div className="all-wrapper">
        <div className="choose-box">
            <div className={`choose-item${isTcp ? ' active-item' : ''}`} onClick={() => chooseOne(true)}>TCP</div>
            <div className={`choose-item${isTcp ? '' : ' active-item'}`} onClick={() => chooseOne(false)}>UDP</div>
        </div>
        <div className="left-block">
            <Calender onChange={onChange} />
            <div className="network-wrapper">
                {isTcp ? <Tcp /> : <Udp />}
            </div>
        </div>
        <div className="right-block">
            {sendData && <div className="every-circle">
                <CircleTable data={sendData} />
                <p className="table-name">{date}TCP发送端流量分析扇形图</p>
            </div>}
            {recvData && <div className="every-circle">
                <CircleTable data={sendData} />
                <p className="table-name">{date}TCP接收端流量分析扇形图</p>
            </div>}
        </div>
    </div>
};

export default <App />;