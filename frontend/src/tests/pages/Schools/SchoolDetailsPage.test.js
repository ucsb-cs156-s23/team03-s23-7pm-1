import { render, screen } from "@testing-library/react";
import SchoolDetailsPage from "main/pages/Schools/SchoolDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

// for mocking /api/currentUser and /api/systemInfo
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 3,
            name: "Dos Pueblos High School",
            district: "Santa Barbara Unified School District",
            gradeRange: "9-12",
        }),
        Navigate: (x) => {
            mockNavigate(x);
            return null;
        },
    };
});

describe("SchoolDetailsPage tests", () => {
    // mock /api/currentUser and /api/systemInfo
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/schools", { params: { id: 3 } }).reply(200, {
            id: 3,
            name: "Dos Pueblos High School",
            district: "Santa Barbara Unified School District",
            gradeRange: "9-12",
        });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Dos Pueblos High School")).toBeInTheDocument();
        expect(screen.getByText("Santa Barbara Unified School District")).toBeInTheDocument();
        expect(screen.getByText("9-12")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });
});