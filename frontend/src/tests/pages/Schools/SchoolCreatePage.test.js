import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import SchoolCreatePage from "main/pages/Schools/SchoolCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("SchoolCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /schools on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "school": {
                "id": 3,
                "name": "Dos Pueblos High School",
                "district": "Santa Barbara Unified School District",
                "grade range": "9-12"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const districtInput = screen.getByLabelText("District");
        expect(districtInput).toBeInTheDocument();

        const graderangeInput = screen.getByLabelText("Grade Range");
        expect(graderangeInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

       
        fireEvent.change(nameInput, { target: { value: 'Dos Pueblos High School' } })
        fireEvent.change(districtInput, { target: { value: 'Santa Barbara Unified School District' } })
        fireEvent.change(graderangeInput, { target: { value: '9-12' } })
        fireEvent.click(createButton);
        

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/schools"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdSchool: {"school":{"id":3,"name":"Dos Pueblos High School","district":"Santa Barbara Unified School District","grade range":"9-12"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


