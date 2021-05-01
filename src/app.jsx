import React, {useState, useEffect} from 'react';
import './assets/css/reset.css';
import './assets/css/index.css';
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
        const {date: time, recv, send} = data;
        setDate(time);
        setSendData(send);
        setRecvData(recv);
    }

    const circleConfig = {
        height: 460,
        width: 460,
        renderSize: 2
    }

    return <div className="all-wrapper">
        <div className="choose-box">
            <div className={`choose-item${isTcp ? ' active-item' : ''}`} onClick={() => chooseOne(true)}>TCP</div>
            <div className={`choose-item${isTcp ? '' : ' active-item'}`} onClick={() => chooseOne(false)}>UDP</div>
        </div>
        <div className="left-block">
            <Calender onChange={onChange} isTcp={isTcp} />
            <div className="network-wrapper">
                {isTcp ? <Tcp /> : <Udp />}
            </div>
        </div>
        <div className="right-block">
            {sendData && <div className="every-circle">
                <CircleTable data={sendData} config={circleConfig} />
                <p className="table-name">{date}--{isTcp ? 'TCP' : 'UDP' }发送端流量占比扇形图</p>
            </div>}
            {recvData && <div className="every-circle">
                <CircleTable data={recvData} config={circleConfig} />
                <p className="table-name">{date}--{isTcp ? 'TCP' : 'UDP' }接收端流量占比扇形图</p>
            </div>}
        </div>
    </div>
};

export default <App />;