import { fireEvent, /* queryByTestId, */ render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SchoolEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/school", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
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

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/school", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'Isla Vista Elementary School',
                district: "Goleta Union School District",
                graderange: "K-6"
            });
            axiosMock.onPut('/api/school').reply(200, {
                id: "17",
                name: 'Carpinteria High School',
                district: "Carpinteria Unified School District",
                graderange: "7-12"
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

        test("Is populated with the data provided", async () => {

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
            const graderangeField = getByTestId("SchoolForm-grade range");
            const submitButton = getByTestId("SchoolForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Isla Vista Elementary School");
            expect(districtField).toHaveValue("Goleta Union School District");
            expect(graderangeField).toHaveValue("K-6");
        });

        test("Changes when you click Update", async () => {



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
            const graderangeField = getByTestId("SchoolForm-grade range");
            const submitButton = getByTestId("SchoolForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Isla Vista Elementary School");
            expect(districtField).toHaveValue("Goleta Union School District");
            expect(graderangeField).toHaveValue("K-6");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Carpinteria High School' } })
            fireEvent.change(districtField, { target: { value: 'Carpinteria Unified School District' } })
            fireEvent.change(graderangeField, { target: { value: "7-12" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("School Updated - id: 17 name: Carpinteria High School");
            expect(mockNavigate).toBeCalledWith({ "to": "/school/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Carpinteria High School',
                district: "Carpinteria Unified School District",
                graderange: "7-12"
            })); // posted object

        });

       
    });
});

