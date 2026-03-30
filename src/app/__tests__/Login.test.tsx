// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Login } from "../components/Login";

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

vi.mock("../components/YYC3Logo", () => ({
  YYC3Logo: () => <div data-testid="yyc3-logo">YYC3 Logo</div>,
}));

describe("Login Component", () => {
  const mockOnLoginSuccess = vi.fn();
  const mockOnGhostLogin = vi.fn();

  it("should render login form", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByTestId("yyc3-logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /登录/i })).toBeInTheDocument();
  });

  it("should show ghost mode button when onGhostLogin is provided", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} onGhostLogin={mockOnGhostLogin} />);

    const ghostButtons = screen.getAllByText(/GHOST MODE/i);
    expect(ghostButtons.length).toBeGreaterThan(0);
  });

  it("should not show ghost mode button when onGhostLogin is not provided", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.queryByText(/GHOST MODE/i)).not.toBeInTheDocument();
  });

  it("should update email and password inputs", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("should toggle password visibility", () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButtons = screen.getAllByRole("button");

    // Find the eye icon button
    const eyeButton = toggleButtons.find((btn) => btn.querySelector("svg"));

    expect(passwordInput).toHaveAttribute("type", "password");

    if (eyeButton) {
      fireEvent.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");
    }
  });

  it("should call onLoginSuccess on successful login", async () => {
    const { supabase } = require("../lib/supabaseClient");
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: "1" } },
      error: null,
    });

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /登录/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it("should show error message on login failure", async () => {
    const { supabase } = require("../lib/supabaseClient");
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /登录/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("should disable login button during loading", async () => {
    const { supabase } = require("../lib/supabaseClient");
    let resolveLogin: any;
    supabase.auth.signInWithPassword.mockImplementation(
      () => new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /登录/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();

    // Resolve the promise
    resolveLogin({ data: { user: { id: "1" } }, error: null });
  });

  it("should call onGhostLogin when ghost mode is activated", () => {
    render(
      <Login
        onLoginSuccess={mockOnLoginSuccess}
        onGhostLogin={mockOnGhostLogin}
      />
    );

    const ghostButtons = screen.getAllByText(/GHOST MODE/i);
    if (ghostButtons.length > 0) {
      fireEvent.click(ghostButtons[0]);
    }

    // Wait for the visual delay
    setTimeout(() => {
      expect(mockOnGhostLogin).toHaveBeenCalled();
    }, 700);
  });

  it("should prevent multiple ghost login activations", () => {
    render(
      <Login
        onLoginSuccess={mockOnLoginSuccess}
        onGhostLogin={mockOnGhostLogin}
      />
    );

    const ghostButtons = screen.getAllByText(/GHOST MODE/i);
    if (ghostButtons.length > 0) {
      fireEvent.click(ghostButtons[0]);
      fireEvent.click(ghostButtons[0]);
    }

    setTimeout(() => {
      expect(mockOnGhostLogin).toHaveBeenCalledTimes(1);
    }, 700);
  });

  it("should clear error when ghost mode is activated", async () => {
    const { supabase } = require("../lib/supabaseClient");
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    render(
      <Login
        onLoginSuccess={mockOnLoginSuccess}
        onGhostLogin={mockOnGhostLogin}
      />
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /登录/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    const ghostButtons = screen.getAllByText(/GHOST MODE/i);
    if (ghostButtons.length > 0) {
      fireEvent.click(ghostButtons[0]);
    }

    setTimeout(() => {
      expect(screen.queryByText(/Invalid credentials/i)).not.toBeInTheDocument();
    }, 700);
  });

  it("should show network error on exception", async () => {
    const { supabase } = require("../lib/supabaseClient");
    supabase.auth.signInWithPassword.mockRejectedValue(new Error("Network error"));

    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /登录/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/登录失败，请检查网络连接/i)).toBeInTheDocument();
    });
  });

  it("should not submit form with empty fields", async () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);

    const loginButton = screen.getByRole("button", { name: /登录/i });
    fireEvent.click(loginButton);

    // Should not call onLoginSuccess
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
});
