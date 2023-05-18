import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ParkCreatePage from "main/pages/Parks/ParkCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/parkUtils', () => {
    return {
        __esModule: true,
        parkUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("ParkCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /parks on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "park": {
                id: 3,
                name: "Zion National Park",
                state: "Utah",
                acres: 147242
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const stateInput = screen.getByLabelText("State");
        expect(stateInput).toBeInTheDocument();

        const acresInput = screen.getByLabelText("Acres");
        expect(acresInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(nameInput, { target: { value: 'Zion National Park' } })
        fireEvent.change(stateInput, { target: { value: 'Utah' } })
        fireEvent.change(acresInput, { target: { value: 147242 } })
        fireEvent.click(createButton);

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/parks"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdPark: {"park":{"id":3,"name":"Zion National Park","state":"Utah","acres":147242}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});
