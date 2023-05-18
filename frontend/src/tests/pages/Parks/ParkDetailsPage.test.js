import { render, screen } from "@testing-library/react";
import ParkDetailsPage from "main/pages/Parks/ParkDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/parkUtils', () => {
    return {
        __esModule: true,
        parkUtils: {
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

describe("ParkDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Zion National Park")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });
});
