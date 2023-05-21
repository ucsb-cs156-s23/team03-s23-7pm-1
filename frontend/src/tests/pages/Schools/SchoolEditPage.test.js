import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";

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
jest.mock("main/utils/schoolUtils", () => {
    return {
        __esModule: true,
        schoolUtils: {
            update: (_school) => {
                return mockUpdate();
            },
            getById: (_id) => {
                return {
                    school: {
                        id: 3,
                        name: "Carpinteria High School",
                        district: "Carpinteria Unified School District",
                        gradeRange: "9-12",
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

describe("SchoolEditPage tests", () => {
    const queryClient = new QueryClient();

    describe("when the backend doesn't return", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/schools", { params: { id: 3 } }).timeout();
        });
        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();

            const { getByText, queryByTestId, findByText } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit School");
            expect(queryByTestId("SchoolForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/schools", { params: { id: 3 } }).reply(200, {
                id: 3,
                name: "Carpinteria High School",
                district: "Carpinteria Unified School District",
                gradeRange: "9-12"
            });
            axiosMock.onPut("/api/schools").reply(200, {
                id: "3",
                name: "Goleta Valley Junior High School",
                district: "Santa Barbara Unified School District",
                gradeRange: "7-8"
            });
        });
        const queryClient = new QueryClient();

        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provide", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SchoolForm-name");

            const idField = getByTestId("SchoolForm-id");
            const nameField = getByTestId("SchoolForm-name");
            const districtField = getByTestId("SchoolForm-district");
            const graderangeField = getByTestId("SchoolForm-gradeRange");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Carpinteria High School");
            expect(districtField).toHaveValue("Carpinteria Unified School District");
            expect(graderangeField).toHaveValue("9-12");
        });

        test("changes when you click Update", async () => {
            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("SchoolForm-name");

            const idField = getByTestId("SchoolForm-id");
            const nameField = getByTestId("SchoolForm-name");
            const districtField = getByTestId("SchoolForm-district");
            const graderangeField = getByTestId("SchoolForm-gradeRange");

            const submitButton = getByTestId("SchoolForm-submit");

            expect(idField).toHaveValue("3");
            expect(nameField).toHaveValue("Carpinteria High School");
            expect(districtField).toHaveValue("Carpinteria Unified School District");
            expect(graderangeField).toHaveValue("9-12");

            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: "Goleta Valley Junior High School" } });
            fireEvent.change(districtField, { target: { value: "Santa Barbara Unified School District" } });
            fireEvent.change(graderangeField, { target: { value: "7-8" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toHaveBeenCalledWith(
                "School Updated - id: 3 name: Goleta Valley Junior High School"
            );
            expect(mockNavigate).toBeCalledWith({ to: "/schools" });

            expect(axiosMock.history.put.length).toBe(1);
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });

            expect(axiosMock.history.put[0].data).toBe(
                JSON.stringify({
                    name: "Goleta Valley Junior High School",
                    district: "Santa Barbara Unified School District",
                    gradeRange: "7-8",
                })
            );
        });
    });
});