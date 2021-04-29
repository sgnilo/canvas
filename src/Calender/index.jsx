import React, {useEffect, useState} from 'react';
import CircleTable from '../CircleTable/index.jsx';
import './Calender.less';
import Ajax from '../util/request';

const colorMap = [
    {
        color: 'rgb(81, 107, 145)',
        activeColor: 'rgba(81, 107, 145, 0.8)'
    },{
        color: 'rgb(89, 196, 230)',
        activeColor: 'rgba(89, 196, 230, .8)'
    },{
        color: 'rgb(237, 175, 218)',
        activeColor: 'rgba(237, 175, 218, .8)'
    },{
        color: 'rgb(147, 183, 227)',
        activeColor: 'rgba(147, 183, 227, .8)'
    },{
        color: 'rgb(165, 231, 240)',
        activeColor: 'rgba(165, 231, 240, .8)'
    },{
        color: 'rgb(203, 176, 227)',
        activeColor: 'rgba(203, 176, 227, .8)'
    }
]

const Calender = props => {

    const {onChange} = props;
    const [activeDay, setActiveDay] = useState(0);
    const [dates, setDates] = useState([]);

    const changeDate = current => {
        setActiveDay(current);
        onchange && onchange(dates[current]);
    };

    const tableProcess = obj => {
        const info = [];
        let i = 0;
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                info.push({
                    percent: obj[key].toFixed(4),
                    name: key,
                    color: colorMap[i].color,
                    activeColor: colorMap[i].activeColor
                });
            }
            i++;
        }
        return info;
    };

    const preProcess = list => {
        return list.map(item => {
            const {time, ratio_rb, ratio_tb} = item;
            return {date: time, send: tableProcess(ratio_rb), recv: tableProcess(ratio_tb)};
        });
    };

    useEffect(() => {
        Ajax.get({url: 'http://192.168.8.8:8010/all_time'}).then(res => {
            const result = JSON.parse(res);
            const list = preProcess(result);
            setDates(list);
            onChange && onChange(list[0]);
        }).catch(err => console.error(err));
    }, []);

    return <div className="calender">
        <div className="dates-area">
            {dates.map((item, index) => {
                return (<div className={`every-day${index === activeDay ? ' active-day' : ''}`} key={item.date} onClick={() => changeDate(index)}>
                    {item.date}
                </div>)
            })}
        </div>
    </div>;
};


export default Calender;