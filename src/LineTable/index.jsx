import {useState, useRef, useEffect} from 'react';
import './LineTable.less';

const LineTable = props => {

    const [hasTip, setHasTipState] = useState(false);
    const [moveStyle, setMoveStyle] = useState({});
    const [canvasStyle, setCanvasStyle] = useState({});
    const [tipName, setTipName] = useState('');
    const [tipData, setTipData] = useState('');
    const [example, updateExample] = useState([]);

    const {height = 300, width = 400, canvasOption, data, tableConfig, tipOption} = props;
    const {masterLineWidth, ruleHeight, renderSize = 1, showX = true, showY = true} = canvasOption || {};
    const {canvasTipName, canvasTipData} = tipOption;
    const canvas = useRef();
    const startX = 80;
    const endX = width - startX;
    const endY = 80;
    const startY = height - endY;
    const {yList, xList, xName, yName, tableName} = tableConfig;
    let moveHandler = null;

    const [infos, setInfos] = useState({});

    const drawLine = data => {
        const {points, lineColor, lineName} = data;
        const context = canvas.current.getContext('2d');
        context.strokeStyle = lineColor;
        context.lineWidth = 2
        const result = points.map(item => {
            const x = infos.x[item.x];
            const y = startY - (item.y / infos.yMax) * (startY - endY) + infos.yMin * infos.yFreq;
            return {x, y};
        });
        result.forEach((item, index) => {
            const {x, y} = item;
            if (y) {
                context.beginPath();
                context.arc(x, y, 1, 0, 2 * Math.PI);
                context.stroke();
                const next = result[index + 1];
                if (next) {
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(next.x, next.y);
                    context.stroke();
                }
            }
        });
        if (!example.some(item => item.name === lineName)) {
            const tempList = example;
            tempList.push({
                name: lineName,
                color: lineColor
            });
            updateExample(tempList);
        }
    };

    const mouseMoveListener = e => {
        if (moveHandler) {
            clearTimeout(moveHandler);
            moveHandler = null;
        }
        const {offsetX, offsetY} = e.nativeEvent;
        moveHandler = setTimeout(() => {
            const activeX = xList[Math.round((offsetX * renderSize - startX) / infos.xFreq)];
            if (activeX !== tipName) {
                const activeData = data.points.filter(item => item.x === activeX)[0]?.y;
                setTipName(activeData ? new Date(activeX).toLocaleTimeString() : '--');
                setTipData(activeData ? `${activeData}KB` : '--');
            }
            let realX, realY;
            if (offsetY < (endY / renderSize)) {
                realY = (endY / renderSize) + 20;
            } else if (offsetY + 40 + 20 > (startY / renderSize)) {
                realY = (startY / renderSize) - 40;
            } else {
                realY = offsetY + 20;
            }
            if (offsetX * renderSize < startX) {
                realX = (startX / renderSize) + 20;
            } else if ((offsetX - 120) * renderSize > endX){
                realX = (endX / renderSize) - 20;
            } else if ((offsetX + 120) * renderSize > endX) {
                realX = offsetX - 120;
            } else {
                realX = offsetX + 20;
            }
            setMoveStyle({
                transform: `translate(${realX}px, ${realY}px)`
            });
        }, 50);
    };

    const drawTable = () => {
        setCanvasStyle({
            height: height / renderSize,
            width: width / renderSize
        });

        const context = canvas.current.getContext('2d');
        context.strokeStyle = '#FFF';
        context.lineWidth = masterLineWidth || 2;
        context.textBaseLine = 'middle';
        const fontSize = `${12 * renderSize}px Pingfang`;
        context.font = fontSize;
        context.fillStyle = '#FFF';
        context.beginPath();
        // 横纵坐标轴
        context.moveTo(startX, startY);
        context.lineTo(startX, endY);
        context.moveTo(startX, startY);
        context.lineTo(endX, startY);

        //刻度 & info
        const yFreq = (startY - endY) / yList.length;
        const xFreq = (endX - startX) / xList.length;
        const fakeInfos = infos;
        fakeInfos.x = {};
        fakeInfos.xFreq = xFreq;
        fakeInfos.yMax = yList[yList.length - 1];
        fakeInfos.Xmax = xList[xList.length - 1];
        fakeInfos.yMin = yList[0];
        fakeInfos.yFreq = yFreq;
        xList.forEach((item, index) => {
            const x = index * xFreq + startX;
            context.moveTo(x, startY);
            context.lineTo(x, startY - ruleHeight);
            fakeInfos.x[item] = x;
            if (showX) {
                const text = context.measureText(item);
                context.fillText(item, x - (text.width / 2), startY + ruleHeight + (8 * renderSize));
            }
        });
        if (xName) {
            const text = context.measureText(xName);
            context.fillText(xName, endX + 20, startY + 5);
        }
        fakeInfos.y = [];
        yList.forEach((item, index) => {
            const y = startY - (index * yFreq);
            context.moveTo(startX, y);
            context.lineTo(startX + ruleHeight, y);
            fakeInfos.y[item] = y;
            if (showY) {
                const text = context.measureText(item);
                context.fillText(item, startX - (ruleHeight * renderSize) - text.width, y + (4 * renderSize));
            }
        });
        if (yName) {
            const text = context.measureText(yName);
            context.fillText(yName, startX - (text.width / 2), endY - 20);
        }

        if (tableName) {
            const text = context.measureText(tableName);
            context.fillText(tableName, (canvas.current.width / 2) - (text.width / 2), 20);

        }

        setInfos(fakeInfos);
        
        context.stroke();

    };

    const clearAll = () => {
        const context = canvas.current.getContext('2d');
        context.clearRect(0, 0, width, height);
    }

    const mouseEnter = e => {
        setHasTipState(true);
    }

    const mouseLeave = e => {
        setHasTipState(false);
    }

    useEffect(() => {
        clearAll();
        drawTable();
        const {sendLine, recvLine} = data;
        drawLine(sendLine);
        drawTable(recvLine);
    }, [data, tableConfig]);
    
    return <div className="canvas-wrapper">
                <canvas
                    id="canvas"
                    ref={canvas}
                    height={height}
                    width={width}
                    style={canvasStyle}
                    onMouseMove={mouseMoveListener}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={mouseLeave}
                ></canvas>
                {hasTip && <div className="line-tip" style={moveStyle} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
                    <p>{canvasTipName || '名称'}：{tipName}</p>
                    <p>{canvasTipData || '数据'}：{tipData}</p>
                </div>}
                <div className="example">

            {example.map(item => {
                return <div className="example-line">
                            <div className="color-block" style={{background: item.color}}></div>
                            <span>{item.name}</span>
                        </div>
                    })}
                </div>
            </div>
};

export default LineTable;