import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import './Availability.css';

const SetAvailability = () => {
    const { user } = useContext(AuthContext); // Retrieve logged-in user information
    const [availability, setAvailability] = useState({
        day: "MONDAY",
        startTime: "",
        endTime: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAvailability({ ...availability, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create payload with username and availability details
            const payload = {
                username: user.username, // Include logged-in doctor's username
                day: availability.day,
                startTime: availability.startTime,
                endTime: availability.endTime,
            };

            // Add Basic Authentication header
            const authHeader = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${user.username}:${user.password}`)}`, // Encode username and password in Base64
                },
            };

            const response = await axios.post(
                "http://localhost:8080/api/availability",
                payload,
                authHeader
            );

            setMessage("Availability set successfully!");
            setAvailability({ day: "MONDAY", startTime: "", endTime: "" });
        } catch (error) {
            console.error("Error setting availability:", error);
            if (error.response && error.response.status === 401) {
                setMessage("Unauthorized. Please log in.");
            } else {
                setMessage("Failed to set availability.");
            }
        }
    };

    return (
        <div className="availability-container">
            <h2>Set Availability</h2>
            <form onSubmit={handleSubmit}>
                <select name="day" value={availability.day} onChange={handleChange}>
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                </select>
                <input
                    type="time"
                    name="startTime"
                    placeholder="Start Time"
                    value={availability.startTime}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="endTime"
                    placeholder="End Time"
                    value={availability.endTime}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Set Availability</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetAvailability;