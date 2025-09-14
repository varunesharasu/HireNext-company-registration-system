import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { configureStore } from "@reduxjs/toolkit"
import Login from "../pages/Login"
import authSlice from "../store/slices/authSlice"
import theme from "../styles/theme"

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...initialState.auth,
      },
    },
  })
}

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState)
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </BrowserRouter>
    </Provider>,
  )
}

describe("Login Component", () => {
  it("renders login form correctly", () => {
    renderWithProviders(<Login />)

    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    renderWithProviders(<Login />)

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument()
      expect(screen.getByText("Password is required")).toBeInTheDocument()
    })
  })

  it("shows validation error for invalid email", async () => {
    renderWithProviders(<Login />)

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: "invalid-email" } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument()
    })
  })

  it("toggles password visibility", () => {
    renderWithProviders(<Login />)

    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByLabelText(/toggle password visibility/i)

    expect(passwordInput.type).toBe("password")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("text")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("password")
  })
})
