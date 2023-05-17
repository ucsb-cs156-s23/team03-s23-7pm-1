import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import ParkEditPage from "main/pages/Parks/ParkEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/parkUtils', () => {
    return {
        __esModule: true,
        parkUtils: {
            update: (_park) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    park: {
                        id: 3,
                        name: "Zion National Park",
                        state: "Utah",
                        acres: 147242
                    }
                }
            }
        }
    }
});


describe("ParkEditPage tests", () => {

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

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("ParkForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Zion National Park')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Utah')).toBeInTheDocument();
        expect(screen.getByDisplayValue(147242)).toBeInTheDocument();
    });

    test("redirects to /parks on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "park": {
                id: 3,
                name: "Zion National Park",
                state: "Utah",
                acres: 147242,
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const stateInput = screen.getByLabelText("State");
        expect(stateInput).toBeInTheDocument();

        const acresInput = screen.getByLabelText("Acres");
        expect(acresInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Zion National Park' } })
            fireEvent.change(stateInput, { target: { value: 'Utah' } })
            fireEvent.change(acresInput, { target: { value: 147242 } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/parks"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedPark: {"park":{"id":3,"name":"Zion National Park","state":"Utah","acres":147242}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});
