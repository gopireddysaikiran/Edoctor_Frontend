import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { AuthContext } from "../../context/AuthContext";

jest.mock("axios");

describe("Login Component", () => {
    it("renders login form correctly", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ setUser: jest.fn() }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it("displays error message for invalid login credentials", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: "Invalid credentials" },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ setUser: jest.fn() }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "wronguser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "wrongpassword" },
        });

        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => {
            expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
        });
    });

    it("redirects to the appropriate dashboard for patient role", async () => {
        axios.post.mockResolvedValueOnce({
            data: { role: "PATIENT" },
        });

        const setUserMock = jest.fn();
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <AuthContext.Provider value={{ setUser: setUserMock }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/patient-dashboard" element={<div>Patient Dashboard</div>} />
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "patientUser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => {
            expect(setUserMock).toHaveBeenCalledWith({
                username: "patientUser",
                password: "password",
                role: "PATIENT",
            });
            expect(screen.getByText(/Patient Dashboard/i)).toBeInTheDocument();
        });
    });

    it("redirects to the appropriate dashboard for doctor role", async () => {
        axios.post.mockResolvedValueOnce({
            data: { role: "DOCTOR" },
        });

        const setUserMock = jest.fn();
        render(
            <MemoryRouter initialEntries={["/login"]}>
                <AuthContext.Provider value={{ setUser: setUserMock }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/doctor-dashboard" element={<div>Doctor Dashboard</div>} />
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Username/i), {
            target: { value: "doctorUser" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "password" },
        });

        fireEvent.click(screen.getByText(/Login/i));

        await waitFor(() => {
            expect(setUserMock).toHaveBeenCalledWith({
                username: "doctorUser",
                password: "password",
                role: "DOCTOR",
            });
            expect(screen.getByText(/Doctor Dashboard/i)).toBeInTheDocument();
        });
    });

    it("renders forgot password link", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ setUser: jest.fn() }}>
                    <Login />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText(/Forgot your password?/i)).toBeInTheDocument();
    });
});

