import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

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
jest.mock("main/utils/restaurantUtils", () => {
    return {
        __esModule: true,
        restaurantUtils: {
            update: (_restaurant) => {
                return mockUpdate();
            },
            getById: (_id) => {
                return {
                    restaurant: {
                        id: 3,
                        name: "Ca' Dario Cucina Italiana",
                        cuisine: "italian",
                        roachCounter: 3    
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

describe("RestaurantEditPage tests", () => {
    const queryClient = new QueryClient();

    describe("when the backend doesn't return", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurants", { params: { id: 3 } }).timeout();
        });
        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Restaurant");
            expect(queryByTestId("RestaurantForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/restaurants", { params: { id: 3 } }).reply(200, {
                id: 3,
                name: "Ca' Dario Cucina Italiana",
                cuisine: "italian",
                roachCounter: 3 
            });
            axiosMock.onPut("/api/restaurants").reply(200, {
                id: "3",
                name: "The Habit",
                cuisine: "american",
                roachCounter: 5   
            });
        });
        const queryClient = new QueryClient();

        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provide", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const cuisineField = getByTestId("RestaurantForm-cuisine");
            const roachCounterField = getByTestId("RestaurantForm-roachCounter");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Ca' Dario Cucina Italiana");
            expect(cuisineField).toHaveValue("italian");
            expect(roachCounterField).toHaveValue(3);
        });

        test("changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const cuisineField = getByTestId("RestaurantForm-cuisine");
            const roachCounterField = getByTestId("RestaurantForm-roachCounter");

            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Ca' Dario Cucina Italiana");
            expect(cuisineField).toHaveValue("italian");
            expect(roachCounterField).toHaveValue(3);

            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: "The Habit" } });
            fireEvent.change(cuisineField, { target: { value: "american" } });
            fireEvent.change(roachCounterField, { target: { value: 5 } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toHaveBeenCalledWith(
                "Restaurant Updated - id: 3 name: The Habit"
            );
            expect(mockNavigate).toBeCalledWith({ to: "/restaurants" });

            expect(axiosMock.history.put.length).toBe(1);
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });

            expect(axiosMock.history.put[0].data).toBe(
                JSON.stringify({
                    name: "The Habit",
                    cuisine: "american",
                    roachCounter: 5,
                })
            );
        });
    });
});