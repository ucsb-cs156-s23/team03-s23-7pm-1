import { render, screen, waitFor } from "@testing-library/react";
import ParkIndexPage from "main/pages/Parks/ParkIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/parkUtils', () => {
    return {
        __esModule: true,
        parkUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    parks: [
                        {
                            id: 3,
                            name: "Zion National Park",
                            state: "Utah",
                            acres: 147242,
                            description: "Magnificent sandstone cliffs, narrow canyons, and diverse plant and animal life."
                        },
                    ]
                }
            }
        }
    }
});


describe("ParkIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createParkButton = screen.getByText("Create Park");
        expect(createParkButton).toBeInTheDocument();
        expect(createParkButton).toHaveAttribute("style", "float: right;");

        const name = screen.getByText("Zion National Park");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Magnificent sandstone cliffs, narrow canyons, and diverse plant and animal life.");
        expect(description).toBeInTheDocument();

        expect(screen.getByTestId("ParkTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("ParkTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("ParkTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Zion National Park");
        expect(name).toBeInTheDocument();

        const description = screen.getByText("Magnificent sandstone cliffs, narrow canyons, and diverse plant and animal life.");
        expect(description).toBeInTheDocument();

        const deleteButton = screen.getByTestId("ParkTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/parks"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = "ParkIndexPage deleteCallback: {\"id\":3,\"name\":\"Zion National Park\",\"state\":\"Utah\",\"description\":\"Magnificent sandstone cliffs, narrow canyons, and diverse plant and animal life.\",\"acres\":147242})";
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


