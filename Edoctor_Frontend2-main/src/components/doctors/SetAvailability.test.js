import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import SetAvailability from "./SetAvailability";
import { AuthContext } from "../../context/AuthContext";

// Mock axios
jest.mock("axios");

describe("SetAvailability Component", () => {
    const mockUser = { username: "doctor123", password: "password123" };

    it("renders the availability form", () => {
        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <SetAvailability />
            </AuthContext.Provider>
        );

        // Check if the form elements are rendered correctly
        expect(screen.getByText("Set Availability")).toBeInTheDocument();
        expect(screen.getByLabelText("Monday")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Start Time")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("End Time")).toBeInTheDocument();
    });

    it("sets availability successfully", async () => {
        // Mock successful response
        axios.post.mockResolvedValueOnce({ data: { message: "Availability set successfully!" } });

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <SetAvailability />
            </AuthContext.Provider>
        );

        // Simulate form input
        fireEvent.change(screen.getByPlaceholderText("Start Time"), { target: { value: "08:00" } });
        fireEvent.change(screen.getByPlaceholderText("End Time"), { target: { value: "10:00" } });
        fireEvent.change(screen.getByLabelText("Monday"), { target: { value: "MONDAY" } });

        fireEvent.click(screen.getByText("Set Availability"));

        await waitFor(() => screen.getByText("Availability set successfully!"));

        expect(screen.getByText("Availability set successfully!")).toBeInTheDocument();
    });

    it("handles error when setting availability", async () => {
        // Mock error response
        axios.post.mockRejectedValueOnce(new Error("Failed to set availability"));

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <SetAvailability />
            </AuthContext.Provider>
        );

        fireEvent.change(screen.getByPlaceholderText("Start Time"), { target: { value: "08:00" } });
        fireEvent.change(screen.getByPlaceholderText("End Time"), { target: { value: "10:00" } });

        fireEvent.click(screen.getByText("Set Availability"));

        await waitFor(() => screen.getByText("Failed to set availability."));

        expect(screen.getByText("Failed to set availability.")).toBeInTheDocument();
    });
});
