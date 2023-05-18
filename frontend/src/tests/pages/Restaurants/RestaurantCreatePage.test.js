import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/restaurantUtils', () => {
    return {
        __esModule: true,
        restaurantUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("RestaurantCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /restaurants on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "restaurant": {
                "id": 3,
                "name": "South Coast Deli",
                "cuisine": "Sandwiches and Salads",
                "roach counter":"1"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const cuisineInput = screen.getByLabelText("Cuisine");
        expect(cuisineInput).toBeInTheDocument();

        const roachcounterInput = screen.getByLabelText("Roach Counter");
        expect(roachcounterInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        
        fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } })
        fireEvent.change(cuisineInput, { target: { value: 'Sandwiches and Salads' } })
        fireEvent.change(roachcounterInput, { target: { value: '1' } })

        fireEvent.click(createButton);
    
        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdRestaurant: {"restaurant":{"id":3,"name":"South Coast Deli","cuisine":"Sandwiches and Salads","roach counter":"1"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


