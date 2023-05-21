import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import RestaurantTable, { showCell } from "main/components/Restaurants/RestaurantTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "../../../fixtures/currentUserFixtures";
import mockConsole from "jest-mock-console";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("RestaurantTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["id", "Name", "Cuisine", "Roach Counter"];
    const expectedFields = ["id", "name", "cuisine", "roachCounter"];
    const testId = "RestaurantTable";

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
                    <RestaurantTable restaurants={[]} currentUser={null} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantTable restaurants={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantTable restaurants={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers, content, and buttons for adminUser", () => {
        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantTable
                        restaurants={restaurantFixtures.threeRestaurants}
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

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("The Habit");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].cuisine);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Freebirds");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].cuisine);

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
                    <RestaurantTable
                        restaurants={restaurantFixtures.threeRestaurants}
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

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("The Habit");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].cuisine);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Freebirds");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].cuisine);

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
                    <RestaurantTable
                        restaurants={restaurantFixtures.threeRestaurants}
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

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("The Habit");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[0].cuisine);

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-name`)
        ).toHaveTextContent("Freebirds");
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-roachCounter`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].roachCounter);
        expect(
            screen.getByTestId(`${testId}-cell-row-1-col-cuisine`)
        ).toHaveTextContent(restaurantFixtures.threeRestaurants[1].cuisine);

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
                    <RestaurantTable
                        restaurants={restaurantFixtures.threeRestaurants}
                        currentUser={currentUser}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("1");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("The Habit");

        const editButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Edit-button`
        );
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/restaurants/edit/1")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `editCallback: {"id":1,"name":"The Habit","cuisine":"american","roachCounter":5}`;
        expect(message).toBe(expectedMessage);
        restoreConsole();
    });

    test("Details button navigates to the details page", async () => {
        const restoreConsole = mockConsole();

        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantTable
                        restaurants={restaurantFixtures.threeRestaurants}
                        currentUser={null}
                    />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert - check that the expected content is rendered
        expect(
            await screen.findByTestId(`${testId}-cell-row-0-col-id`)
        ).toHaveTextContent("1");
        expect(
            screen.getByTestId(`${testId}-cell-row-0-col-name`)
        ).toHaveTextContent("The Habit");

        const detailsButton = screen.getByTestId(
            `${testId}-cell-row-0-col-Details-button`
        );
        expect(detailsButton).toBeInTheDocument();

        // act - click the details button
        fireEvent.click(detailsButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() =>
            expect(mockedNavigate).toHaveBeenCalledWith("/restaurants/details/1")
        );

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `detailsCallback: {"id":1,"name":"The Habit","cuisine":"american","roachCounter":5}`;
        expect(message).toBe(expectedMessage);
        restoreConsole();
    });
});