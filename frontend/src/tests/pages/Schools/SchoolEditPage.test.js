import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import SchoolEditPage from "main/pages/Schools/SchoolEditPage";
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
jest.mock('main/utils/schoolUtils', () => {
    return {
        __esModule: true,
        schoolUtils: {
            update: (_school) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    school: {
                        "id": 3,
                        "name": "Dos Pueblos High School",
                        "district": "Santa Barbara Unified School District",
                        "grade range": "9-12"
                    }
                }
            }
        }
    }
});


describe("SchoolEditPage tests", () => {

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

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("SchoolForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dos Pueblos High School')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Santa Barbara Unified School District')).toBeInTheDocument();
        expect(screen.getByDisplayValue('9-12')).toBeInTheDocument();
    });

    test("redirects to /schools on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
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
                    <SchoolEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const districtInput = screen.getByLabelText("District");
        expect(districtInput).toBeInTheDocument();

        const graderangeInput = screen.getByLabelText("Grade Range");
        expect(graderangeInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

    
        fireEvent.change(nameInput, { target: { value: 'Dos Pueblos High School' } })
        fireEvent.change(districtInput, { target: { value: 'Santa Barbara Unified School District' } })
        fireEvent.click(updateButton);
    

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/schools"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedSchool: {"school":{"id":3,"name":"Dos Pueblos High School","district":"Santa Barbara Unified School District","grade range":"9-12"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


