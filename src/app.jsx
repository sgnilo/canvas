import React, {useState, useEffect} from 'react';
import './assets/css/reset.css';
import './assets/css/index.css';
import Ajax from './util/request';
import Calender from './Calender/index.jsx';
import Tcp from './TCP/index.jsx';
import Udp from './Udp/index.jsx';
import CircleTable from './CircleTable/index.jsx';

function App(props) {

    const [dates, setDates] = useState([]);
    const [isTcp, setTcpState] = useState(true);
    const [sendData, setSendData] = useState(null);
    const [recvData, setRecvData] = useState(null);


    
    useEffect(() => {
        // Ajax.jsonp({
        //     url: '/api/wall'
        // }).then(res => {
        // });
        
        
    }, []);
    

    const myDate = [
        {
            date: '4月21'
        },
        {
            date: '4月22'
        },
        {
            date: '4月23'
        },
        {
            date: '4月24'
        },
        {
            date: '4月25'
        },
        {
            date: '4月26'
        },
        {
            date: '4月27'
        },
        {
            date: '4月28'
        },
        {
            date: '4月29'
        },
        {
            date: '4月30'
        },
        {
            date: '5月1日'
        }
    ]

    useEffect(() => {
        const tempDate = myDate.map((item, index) => {
            let info = [
                {percent: 0.1, color: 'rgb(0, 255, 255)', name: 'a', activeColor: 'rgba(0, 255, 255, 0.6)'},
                {percent: 0.15, color: 'rgb(0, 211, 255)', name: 'b', activeColor: 'rgba(0, 211, 255, 0.6)'},
                {percent: 0.2, color: 'rgb(0, 177, 255)', name: 'c', activeColor: 'rgba(0, 177, 255, 0.6)'},
                {percent: 0.25, color: 'rgb(0, 144, 255)', name: 'd', activeColor: 'rgba(0, 144, 255, 0.6)'},
                {percent: 0.3, color: 'rgb(0, 100, 255)', name: 'e', activeColor: 'rgba(0, 100, 255, 0.6)'}
            ];
            if (index % 2) {
                info = [
                    {percent: 0.4, color: 'rgb(0, 255, 255)', name: 'a', activeColor: 'rgba(0, 255, 255, 0.6)'},
                    {percent: 0.05, color: 'rgb(0, 211, 255)', name: 'b', activeColor: 'rgba(0, 211, 255, 0.6)'},
                    {percent: 0.15, color: 'rgb(0, 177, 255)', name: 'c', activeColor: 'rgba(0, 177, 255, 0.6)'},
                    {percent: 0.2, color: 'rgb(0, 144, 255)', name: 'd', activeColor: 'rgba(0, 144, 255, 0.6)'},
                    {percent: 0.2, color: 'rgb(0, 100, 255)', name: 'e', activeColor: 'rgba(0, 100, 255, 0.6)'}
                ]
            }
            return {...item, info}
            
        });
        setDates(tempDate);
    }, []);

    const chooseOne = status => {
        setTcpState(status);
    }

    const onChange = data => {
        console.log(data);
        setSendData(data);
        setRecvData(data);
    }

    
    return <div className="all-wrapper">
        <div className="choose-box">
            <div className={`choose-item${isTcp ? ' active-item' : ''}`} onClick={() => chooseOne(true)}>TCP</div>
            <div className={`choose-item${isTcp ? '' : ' active-item'}`} onClick={() => chooseOne(false)}>UDP</div>
        </div>
        <div className="left-block">
            <Calender dates={dates} onChange={onChange} />
            <div className="network-wrapper">
                {isTcp ? <Tcp /> : <Udp />}
            </div>
        </div>
        <div className="right-block">
            {sendData && <div className="every-circle">
                <CircleTable data={sendData} />
                <p className="table-name">TCP流量分析扇形图1</p>
            </div>}

        </div>
    </div>
};

export default <App />;