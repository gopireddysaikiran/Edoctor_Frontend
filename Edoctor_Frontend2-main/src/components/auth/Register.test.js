import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";

jest.mock("axios");

describe("Register Component", () => {
    it("renders registration form correctly", () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
    });

    it("handles form submission and redirects to OTP page on successful registration", async () => {
        axios.post.mockResolvedValueOnce({ data: {} });

        render(
            <MemoryRouter initialEntries={["/register"]}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<div>OTP Verification</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "newuser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: "newuser@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "password123" },
        });

        fireEvent.submit(screen.getByText(/Register/i));

        await waitFor(() => {
            expect(screen.getByText(/OTP Verification/i)).toBeInTheDocument();
        });
    });

    it("displays error message when registration fails", async () => {
        axios.post.mockRejectedValueOnce(new Error("Registration failed"));

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "newuser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), {
            target: { value: "newuser@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "password123" },
        });

        fireEvent.submit(screen.getByText(/Register/i));

        await waitFor(() => {
            expect(screen.getByText(/Registration failed. Please try again./i)).toBeInTheDocument();
        });
    });

    it("handles role selection correctly", () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue("PATIENT")).toBeInTheDocument();
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "DOCTOR" },
        });
        expect(screen.getByDisplayValue("DOCTOR")).toBeInTheDocument();
    });
});
