import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import ResetPassword from "./ResetPassword";

jest.mock("axios");

describe("ResetPassword Component", () => {
    it("renders reset password form correctly", () => {
        render(
            <MemoryRouter initialEntries={["/reset-password/:resetToken"]}>
                <Routes>
                    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/Enter your new password/i)).toBeInTheDocument();
        expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    });

    it("handles successful password reset and redirects to login", async () => {
        axios.post.mockResolvedValueOnce({ data: "Password reset successful" });

        render(
            <MemoryRouter initialEntries={["/reset-password/some-token"]}>
                <Routes>
                    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
            target: { value: "newPassword123" },
        });

        fireEvent.submit(screen.getByText(/Reset Password/i));

        await waitFor(() => {
            expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
        });

        // Check redirection to login after 3 seconds
        await waitFor(() => {
            expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
        });
    });

    it("handles error during password reset", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: "Error occurred. Please try again." },
        });

        render(
            <MemoryRouter initialEntries={["/reset-password/some-token"]}>
                <Routes>
                    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter your new password/i), {
            target: { value: "newPassword123" },
        });

        fireEvent.submit(screen.getByText(/Reset Password/i));

        await waitFor(() => {
            expect(screen.getByText(/Error occurred. Please try again./i)).toBeInTheDocument();
        });
    });
});
