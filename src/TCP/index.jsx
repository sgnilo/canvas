import {useEffect, useState} from 'react';
import Ajax from '../util/request';
import LineTable from '../LineTable/index.jsx';

const Tcp = props => {

    const [sendLine, setSendLine] = useState({
        lineColor: 'rgb(0, 255, 255)',
        lineName: '发送端流量',
        points: []
    });

    const [recvLine, setRecvLine] = useState({
        lineColor: 'rgb(0, 44, 44)',
        lineName: '接收端流量',
        points: []
    });

    const [width, setWidth] = useState(1400);
    const [height, setHeight] = useState(700);
    const [tableConfig, setTableConfig] = useState({
        xList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
        yList: [0, 50, 100, 150, 200],
        xName: '时间',
        yName: '流量大小(KB)',
        tableName: 'TCP流量实时监控'
    });

    const callSelf = () => {
        Ajax.get({url: 'http://192.168.8.8:8010/time/tcp'}).then(res => {
            const result = JSON.parse(res);
            const {time, sum_rb, sum_tb} = result;
            const sendPonits = sendLine.points;
            const recvPoints = recvLine.points;
            const tempConfig = {...tableConfig};
            if (sendPonits.length >= 15) {
                sendPonits.unshift();
            }
            sendPonits.push({x: time, y: sum_tb});
            if (recvPoints.length >= 15) {
                recvPonits.unshift();
            }
            recvPoints.push({x: time, y: sum_rb});
            if (tempConfig.xList.length > 15) {
                tempConfig.xList.unshift()
            };
            tempConfig.xList.push(time);
            const maxNewY = Matn.max(sum_rb, sum_tb);
            if (tempConfig.yList[tempConfig.yList - 1] < maxNewY) {
                const freq = (maxNewY - tempConfig.yList[0]) / 5;
                const tempY = [];
                for (let i = 0; i < 5; i++) {
                    tempY.push(freq * i);
                }
                tempConfig.yList = tempY;
            }
            setTableConfig({...tableConfig, ...tempConfig});
            setSendLine({...sendLine, points: sendPonits});
            setRecvLine({...recvLine, points: recvPoints});
        });
        setTimeout(callSelf, 1000);
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
        callSelf();
        setWidth((window.screen.width - 200) * 0.55 * (window.devicePixelRatio || 1));
        setHeight(400 * (window.devicePixelRatio || 1));
    }, []);

    return <LineTable
        tableConfig={tableConfig}
        canvasOption={canvasOption}
        tipOption={tipOption}
        data={{sendLine, recvLine}}
        height={height}
        width={width}
    />
};

export default Tcp;