import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  
  // Check if doctors is defined and is an array
  if (!doctors || !Array.isArray(doctors)) {
    return <p>No doctors available at the moment.</p>; // Handle the case when no doctors are found
  }

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item) => ( // Removed index from map
          <div 
          onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} 

            key={item._id} // Use unique ID as the key
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-500'
          >
            <img className='bg-blue-50' src={item.image} alt={item.name} />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{ navigate('/doctors'); scrollTo(0,0)}} className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
        More
      </button>
    </div>
  );
}

export default TopDoctors;