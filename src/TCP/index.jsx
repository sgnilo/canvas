import {useEffect, useState} from 'react';
import Ajax from '../util/request';
import LineTable from '../LineTable/index.jsx';

const Tcp = props => {

    const [sendLine, setSendLine] = useState({
        lineColor: 'rgb(0, 255, 255)',
        lineName: '发送端',
        points: []
    });

    const [recvLine, setRecvLine] = useState({
        lineColor: '#f73131',
        lineName: '接收端',
        points: []
    });

    const [myList, setList] = useState([
        0, 0.5, 1, 1.5, 2
    ]);

    const [width, setWidth] = useState(1400);
    const [height, setHeight] = useState(700);
    const [tableConfig, setTableConfig] = useState({
        xList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
        yList: [0, 0.5, 1, 1.5, 2],
        xName: '时间',
        yName: '流量大小(KB)',
        tableName: 'TCP流量实时监控'
    });

    const callSelf = yList => {
        let tempY = yList;
        Ajax.get({url: 'http://192.168.8.8:8010/time/tcp'}).then(res => {
            const result = JSON.parse(res);
            const {time, sum_rb, sum_tb} = result;
            const sendPonits = sendLine.points;
            const recvPoints = recvLine.points;
            const tempConfig = {...tableConfig};
            if (sendPonits.length >= 15) {
                sendPonits.shift();
            }
            sendPonits.push({x: time, y: sum_tb});
            if (recvPoints.length >= 15) {
                recvPoints.shift();
            }
            recvPoints.push({x: time, y: sum_rb});
            if (tempConfig.xList.length > 15) {
                tempConfig.xList.shift()
            };
            tempConfig.xList.push(time);
            const maxNewY = Math.max(sum_rb, sum_tb, ...sendPonits.map(item => item.y), ...recvPoints.map(item => item.y));
            if (yList[4] < maxNewY || maxNewY < yList[1]) {
                const freq = Math.ceil((maxNewY - yList[0]) / 4);
                tempY = [];
                for (let i = 0; i < 5; i++) {
                    tempY.push(parseInt(freq * i));
                }
                tempConfig.yList = tempY;
                setList(tempY)
            }
            setTableConfig({...tableConfig, ...tempConfig});
            setSendLine({...sendLine, points: sendPonits});
            setRecvLine({...recvLine, points: recvPoints});
        });
        setTimeout(() => callSelf(tempY), 1000);
    };

    
    const canvasOption = {
        ruleHeight: 5,
        renderSize: window.devicePixelRatio || 1,
        showX: false
    };
    const tipOption = {
        canvasTipName: '时间',
        canvasTipData: '流量大小'
    }


    useEffect(() => {
        callSelf(myList);
        setWidth((window.screen.width - 200) * 0.55 * (window.devicePixelRatio || 1));
        setHeight(400 * (window.devicePixelRatio || 1));
    }, []);

    return <LineTable
        tableConfig={{...tableConfig, yList: myList}}
        canvasOption={canvasOption}
        tipOption={tipOption}
        data={{sendLine, recvLine}}
        height={height}
        width={width}
    />
};

export default Tcp;