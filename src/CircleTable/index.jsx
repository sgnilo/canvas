import {useState, useRef, useEffect} from 'react';
import './CircleTable.less';

const CircleTable = props => {

    const {data} = props;

    const canvas = useRef();

    const [rectList, setRectList] = useState([]);
    const [activePath, setActivePath] = useState(null);
    const [tipName, setTipName] = useState('');
    const [tipData, setTipData] = useState('');
    const [hasTip, setHasTipState] = useState(false);
    const [moveStyle, setMoveStyle] = useState({});

    const reDraw = list => {
        canvas.current.width = canvas.current.width;
        const tempList = [];
        const context = canvas.current.getContext('2d');
        let tmp = 0;
        list.forEach(item => {
            const p = new Path2D();
            context.beginPath();
            p.moveTo(300, 300);
            context.fillStyle = item.color;
            p.arc(300, 300, 300, tmp, tmp + item.percent * Math.PI * 2, false);
            tmp += item.percent * Math.PI * 2;
            context.fill(p);
            context.closePath();
            tempList.push({path: p, ...item});
        });
        setRectList(tempList);
    };

    useEffect(() => {
        reDraw(data);
    }, [data]);

    const mouseLeave = e => {
        reDraw(data);
        setHasTipState(false);
    };

    const mouseMove = e => {
        const {offsetX, offsetY} = e.nativeEvent;
        if (!hasTip) {
            setHasTipState(true);
        }
        const context = canvas.current.getContext('2d');
        const newPath = rectList.filter(item => context.isPointInPath(item.path, offsetX * 2, offsetY * 2))[0];
        if (!activePath || (newPath && activePath.name != newPath.name)) {
            // console.log('got u', newPath)
            setActivePath(newPath);
            canvas.current.width = canvas.current.width;
            reDraw(data);
            context.beginPath();
            context.shadowColor = 'rgba(0, 0, 0, 0.5)';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 2;
            context.shadowBlur = 2;
            context.fillStyle = newPath.activeColor || newPath.color;
            setTipName(newPath.name);
            setTipData((newPath.percent * 100) + '%');
            context.fill(newPath.path);
            context.closePath();
        }
        setMoveStyle({
            transform: `translate(${offsetX + 10}px, ${offsetY + 10}px)`
        })

    };

    const mouseEnter = e => {
        setHasTipState(true);
    };


    return <div className="circle-canvas-wrapper">
        <canvas
            className="circle-canvas"
            ref={canvas}
            height={600}
            width={600}
            onMouseMove={mouseMove}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
        ></canvas>
        {hasTip && <div className="line-tip" style={moveStyle}>
            <p>{tipName}</p>
            <p>{tipData}</p>
        </div>}
        <div className="example">
            {data.map(item => {
                return <div className="example-line">
                    <div className="color-block" style={{background: item.color}}></div>
                    <span>{item.name}</span>
                </div>
            })}
        </div>
    </div>;
};


export default CircleTable;