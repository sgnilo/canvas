import React, {useEffect, useState} from 'react';
import CircleTable from '../CircleTable/index.jsx';
import './Calender.less';

const Calender = props => {

    const {dates} = props;
    const [activeDay, setActiveDay] = useState(0);

    const changeDate = current => {
        setActiveDay(current);
    };

    useEffect(() => {
        console.log(dates[activeDay], dates[activeDay]);
    }, [activeDay]);

    return <div className="calender">
        <div className="dates-area">
            {dates.map((item, index) => {
                return (<div className={`every-day${index === activeDay ? ' active-day' : ''}`} key={item.date} onClick={() => changeDate(index)}>
                    {item.date}
                </div>)
            })}
        </div>
        {dates[activeDay] && <CircleTable data={dates[activeDay].info} />}
    </div>;
};


export default Calender;