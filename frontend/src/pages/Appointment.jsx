import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = () => {
        const docInfo = doctors.find(doc => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = () => {
        const slots = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + i);

            // Start and end times for the day's available slots
            const startTime = (i === 0) ? today : new Date(currentDate.setHours(10, 0, 0, 0));
            const endTime = new Date(currentDate.setHours(21, 0, 0, 0));

            const timeSlots = [];
            let currentTime = startTime.getTime();

            // Adjust current time for today
            if (i === 0) {
                currentTime = Math.max(today.getTime(), startTime.getTime());
            }

            while (currentTime < endTime.getTime()) {
                let formattedTime = new Date(currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSlots.push({
                    datetime: new Date(currentTime),
                    time: formattedTime
                });
                currentTime += 30 * 60 * 1000; // Increment by 30 minutes
            }

            slots.push(timeSlots);
        }
        setDocSlots(slots);
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        getAvailableSlots();
    }, [doctors, docId]);

    return docInfo && (
        <div>
            {/* -----------doctor details-------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-72 rounded-lg' src={docInfo.image} alt="" />
                </div>
                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0'>
                    {/* ------Doc Info------- */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>
                    {/* -------Doctor About------ */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>
            {/* -----BOOKING SLOTS----- */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length > 0 && docSlots.map((item, index) => (
                            <div 
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} 
                                key={index} 
                                onClick={() => setSlotIndex(index)}
                            >
                                <p>
                                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                                </p>
                                {item[0] && item[0].datetime.getDate()}
                            </div>
                        ))
                    }
                </div>
                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                            <p 
                                onClick={() => setSlotTime(item.time)} 
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-400'}`} 
                                key={index}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        ))
                    }
                </div>
                <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
            </div>
            {/* ---listing related doctors---- */}
            <RelatedDoctors speciality={docInfo.speciality} docInfo={docInfo} />

        </div>
    );
};

export default Appointment;