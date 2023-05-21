import { render, waitFor, fireEvent } from "@testing-library/react";
import ParkCreatePage from "main/pages/Parks/ParkCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        }
    };
});

describe("ParkCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
        const queryClient = new QueryClient();
        const park = {
            id: 17,
            name: "Zion National Park",
            state: "Utah",
            acres: 147242
        };

        axiosMock.onPost("/api/parks/post").reply(202, park);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("ParkForm-acres")).toBeInTheDocument();
        });

        const acresField = getByTestId("ParkForm-acres");
        const nameField = getByTestId("ParkForm-name");
        const stateField = getByTestId("ParkForm-state");
        const submitButton = getByTestId("ParkForm-submit");

        fireEvent.change(acresField, { target: { value: 147242 } });
        fireEvent.change(nameField, { target: { value: "Zion National Park" } });
        fireEvent.change(stateField, { target: { value: "Utah" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            name: "Zion National Park",
            state: "Utah",
            acres: 147242,
        });

        expect(mockToast).toBeCalledWith("New park created - id: 17 name: Zion National Park");
        expect(mockNavigate).toBeCalledWith({ to: "/parks/" });
    });
});
