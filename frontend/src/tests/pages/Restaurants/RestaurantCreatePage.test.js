//update to connect to backend
import { render, waitFor, fireEvent } from "@testing-library/react";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

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
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const restaurant = {
            id: 17,
            name: "Chipotle",
            cuisine: "mexican"
        };

        axiosMock.onPost("/api/restaurants/post").reply( 202, restaurant );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("RestaurantForm-roachCounter")).toBeInTheDocument();
        });

        const nameField = getByTestId("RestaurantForm-name");
        const cuisineField = getByTestId("RestaurantForm-cuisine");
        const roachCounterField = getByTestId("RestaurantForm-roachCounter");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'Chipotle' } });
        fireEvent.change(cuisineField, { target: { value: 'mexican' } });
        fireEvent.change(roachCounterField, { target: { value: '13' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "cuisine": "mexican",
            "name": "Chipotle",
            "roachCounter": 13
        });

        expect(mockToast).toBeCalledWith("New restaurant Created - id: 17 name: Chipotle");
        expect(mockNavigate).toBeCalledWith({ "to": "/restaurants/" });
    });


});
