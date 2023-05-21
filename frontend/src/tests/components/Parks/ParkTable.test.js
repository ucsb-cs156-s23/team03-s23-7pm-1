import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { parkFixtures } from "fixtures/parkFixtures";
import ParkTable, { showCell } from "main/components/Parks/ParkTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "../../../fixtures/currentUserFixtures";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("ParkTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "Name", "State", "Acres"];
    const expectedFields = ["id", "name", "state", "acres"];
    const testId = "ParkTable";

    test("showCell function works properly", () => {
        const cell = {
            row: {
                values: { a: 1, b: 2, c: 3 },
            },
        };
        expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
    });

    test("renders without crashing for empty table with user not logged in", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable parks={[]} currentUser={null} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable parks={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable parks={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers, content, and buttons for adminUser", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable
                        parks={parkFixtures.threeParks}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("Grand Canyon National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[0].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[0].state);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Zion National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[1].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[1].state);

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();
        expect(detailsButton).toHaveClass("btn-primary");

        const editButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Edit-button`
        );
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Delete-button`
        );
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });
    test("Has the expected column headers, content, and buttons for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable
                        parks={parkFixtures.threeParks}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("Grand Canyon National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[0].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[0].state);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Zion National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[1].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[1].state);

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();
        expect(detailsButton).toHaveClass("btn-primary");

        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    });

    test("Has the expected column headers, content and no buttons when showButtons=false", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable
                        parks={parkFixtures.threeParks}
                        showButtons={false}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("Grand Canyon National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[0].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[0].state);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Zion National Park");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-acres`)
        ).toHaveTextContent(parkFixtures.threeParks[1].acres);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-state`)
        ).toHaveTextContent(parkFixtures.threeParks[1].state);

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

    test("Edit button navigates to the edit page for admin", async () => {
        const restoreConsole = mockConsole();

        const currentUser = currentUserFixtures.adminUser;

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable
                        parks={parkFixtures.threeParks}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("Grand Canyon National Park");

        const editButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Edit-button`
        );
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/parks/edit/2")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `editCallback: {"id":2,"name":"Grand Canyon National Park","state":"Arizona","acres":1218375}`;
        expect(message).toBe(expectedMessage);
        restoreConsole();
    });

    test("Details button navigates to the details page", async () => {
        const restoreConsole = mockConsole();

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkTable
                        parks={parkFixtures.threeParks}
                        currentUser={null}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("Grand Canyon National Park");

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();

        // act - click the details button
        fireEvent.click(detailsButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/parks/details/2")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `detailsCallback: {"id":2,"name":"Grand Canyon National Park","state":"Arizona","acres":1218375}`;
        expect(message).toBe(expectedMessage);
        restoreConsole();
    });
});
