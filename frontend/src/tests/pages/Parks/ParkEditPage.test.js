import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ParkEditPage from "main/pages/Parks/ParkEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
    const originalModule = jest.requireActual("react-toastify");
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x),
    };
});

const mockNavigate = jest.fn();

const mockUpdate = jest.fn();
jest.mock("main/utils/parkUtils", () => {
    return {
        __esModule: true,
        parkUtils: {
            update: (_park) => {
                return mockUpdate();
            },
            getById: (_id) => {
                return {
                    park: {
                        id: 3,
                        name: "Grand Teton National Park",
                        state: "Wyoming",
                        acres: 310044,
                    }
                }
            }
        }
    }
});

jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 3,
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});

describe("ParkEditPage tests", () => {
    const queryClient = new QueryClient();

    describe("when the backend doesn't return", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/parks", { params: { id: 3 } }).timeout();
        });
        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Park");
            expect(queryByTestId("ParkForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("when the backend is working normally", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/parks", { params: { id: 3 } }).reply(200, {
                id: 3,
                name: "Grand Teton National Park",
                state: "Wyoming",
                acres: 310044
            });
            axiosMock.onPut("/api/parks").reply(200, {
                id: "3",
                name: "Yosemite National Park",
                state: "California",
                acres: 761747
            });
        });
        const queryClient = new QueryClient();

        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provide", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ParkForm-name");

            const idField = getByTestId("ParkForm-id");
            const nameField = getByTestId("ParkForm-name");
            const stateField = getByTestId("ParkForm-state");
            const acresField = getByTestId("ParkForm-acres");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Grand Teton National Park");
            expect(stateField).toHaveValue("Wyoming");
            expect(acresField).toHaveValue(310044);
        });

        test("changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ParkForm-name");

            const idField = getByTestId("ParkForm-id");
            const nameField = getByTestId("ParkForm-name");
            const stateField = getByTestId("ParkForm-state");
            const acresField = getByTestId("ParkForm-acres");

            const submitButton = getByTestId("ParkForm-submit");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Grand Teton National Park");
            expect(stateField).toHaveValue("Wyoming");
            expect(acresField).toHaveValue(310044);

            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: "Yosemite National Park" } });
            fireEvent.change(stateField, { target: { value: "California" } });
            fireEvent.change(acresField, { target: { value: 761747 } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toHaveBeenCalledWith(
                "Park Updated - id: 3 name: Yosemite National Park"
            );
            expect(mockNavigate).toBeCalledWith({ to: "/parks" });

            expect(axiosMock.history.put.length).toBe(1);
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });

            expect(axiosMock.history.put[0].data).toBe(
                JSON.stringify({
                    name: "Yosemite National Park",
                    state: "California",
                    acres: 761747,
                })
            );
        });
    });
});
