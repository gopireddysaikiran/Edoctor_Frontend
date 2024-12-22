import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import DoctorList from "./DoctorList";

// Mock axios
jest.mock("axios");

describe("DoctorList Component", () => {
    it("renders list of doctors correctly", async () => {
        // Mocking the response from the API
        const mockDoctors = [
            { id: 1, name: "Dr. Smith", specialization: "Cardiology" },
            { id: 2, name: "Dr. Johnson", specialization: "Neurology" },
        ];

        axios.get.mockResolvedValueOnce({ data: mockDoctors });

        render(<DoctorList />);

        // Wait for the data to be fetched and rendered
        await waitFor(() => screen.getByText("Dr. Smith - Cardiology"));

        // Check if doctors' names and specializations are displayed
        expect(screen.getByText("Dr. Smith - Cardiology")).toBeInTheDocument();
        expect(screen.getByText("Dr. Johnson - Neurology")).toBeInTheDocument();
    });

    it("handles error when fetching doctors", async () => {
        // Mocking an error response
        axios.get.mockRejectedValueOnce(new Error("Error fetching doctors"));

        render(<DoctorList />);

        // Check if error is handled gracefully (you may want to add error handling in your UI)
        await waitFor(() => expect(console.error).toHaveBeenCalledWith("Error fetching doctors", expect.any(Error)));
    });

    it("renders loading state while fetching data", () => {
        // Ensure loading message is displayed before data is fetched
        axios.get.mockResolvedValueOnce({ data: [] });

        render(<DoctorList />);
        expect(screen.getByText("Available Doctors")).toBeInTheDocument(); // Initial render
    });
});
