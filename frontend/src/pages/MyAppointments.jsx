import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  // Function to format slotDate
  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "Invalid Date";

    const date = new Date(slotDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const makePayment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/make-payment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Redirect to eSewa payment URL
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          appointments.slice(0, 3).map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div>
                {item.docData && (
                  <img
                    className="w-32 bg-indigo-50"
                    src={item.docData.image}
                    alt=""
                  />
                )}
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                {item.docData && (
                  <>
                    <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                    <p>{item.docData.Speciality}</p>
                    <p className="text-zinc-700 font-medium mt-1">Address:</p>
                    <p className="text-xs">{item.docData.address?.line1}</p>
                    <p className="text-xs">{item.docData.address?.line2}</p>
                    <p className="text-xs mt-1">
                      <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && (
                  <button
                    onClick={() => makePayment(item._id)} // Calling your makePayment function here
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                    Pay Online
                  </button>
                )}
                {!item.cancelled && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;