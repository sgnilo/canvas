import {useEffect, useState} from 'react';
import LineTable from '../LineTable/index.jsx';

const Udp = props => {

    const [data, setData] = useState({
        lineColor: 'rgb(0, 255, 255)',
        lineName: 'UDP',
        points: [
        {x: 'a', y: 1.5},
        {x: 'b', y: 2.2},
        {x: 'c', y: 3.3},
        {x: 'd', y: 1.8},
        {x: 'e', y: 4.5},
        {x: 'f', y: 1.5},
        {x: 'g', y: 2.2},
        {x: 'h', y: 3.3},
        {x: 'i', y: 1.8},
        {x: 'j', y: 4.5},
        {x: 'k', y: 1.5},
        {x: 'l', y: 2.2},
        {x: 'm', y: 3.3},
        {x: 'n', y: 1.8}
    ]});

    const callSelf = data => {
        setTimeout(() => {
            const points = data.points.map((item, index, list) => {
                let newY;
                if (list[index + 1]) {
                    newY = list[index + 1].y;
                } else {
                    newY = (Math.random() * 5 + 1).toFixed(2);
                }
                return {...item, y: newY};
            });
            const newList = {...data, points};
            setData(newList);
           callSelf(newList);
        }, 1000);
    };

    const tableConfig = {
        xList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
        yList: [1, 2, 3, 4, 5],
        xName: '时间',
        yName: '流量大小'
    };
    const canvasOption = {
        ruleHeight: 5,
        renderSize: window.devicePixelRatio || 1,
        showX: false
    };
    const tipOption = {
        canvasTipName: 'x轴',
        canvasTipData: 'y轴'
    }


    useEffect(() => {
        callSelf(data);
    }, []);


    return <LineTable
        tableConfig={tableConfig}
        canvasOption={canvasOption}
        tipOption={tipOption}
        data={data}
        height={800}
        width={1400}
    />
};

export default Udp;