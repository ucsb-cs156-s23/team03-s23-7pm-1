import { render, waitFor, fireEvent } from "@testing-library/react";
import SchoolCreatePage from "main/pages/Schools/SchoolCreatePage";
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

describe("SchoolCreatePage tests", () => {

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
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const school = {
            id: 17,
            name: "Dos Pueblos High School",
            district: "Santa Barbara Unified School District",
            graderange: "9-12"
        };

        axiosMock.onPost("/api/school/post").reply( 202, school );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("SchoolForm-grade range")).toBeInTheDocument();
        });

        const graderangeField = getByTestId("SchoolForm-grade range");
        const nameField = getByTestId("SchoolForm-name");
        const districtField = getByTestId("SchoolForm-district");
        const submitButton = getByTestId("SchoolForm-submit");

        fireEvent.change(graderangeField, { target: { value: '9-12' } });
        fireEvent.change(nameField, { target: { value: 'Dos Pueblos High School' } });
        fireEvent.change(districtField, { target: { value: 'Santa Barbara Unified School District' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Dos Pueblos High School",
            "district": "Santa Barbara Unified School District",
            "grade range": "9-12"
        });

        expect(mockToast).toBeCalledWith("New school Created - id: 17 name: Dos Pueblos High School");
        expect(mockNavigate).toBeCalledWith({ "to": "/school/list" });
    });


});




