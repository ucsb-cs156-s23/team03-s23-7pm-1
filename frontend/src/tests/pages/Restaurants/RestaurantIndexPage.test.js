// import { render, screen, waitFor } from "@testing-library/react";
// import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import mockConsole from "jest-mock-console";

// import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockNavigate
// }));

// const mockDelete = jest.fn();
// jest.mock('main/utils/restaurantUtils', () => {
//     return {
//         __esModule: true,
//         restaurantUtils: {
//             del: (id) => {
//                 return mockDelete(id);
//             },
//             get: () => {
//                 return {
//                     nextId: 5,
//                     restaurants: [
//                         {
//                             "id": 3,
//                             "name": "Freebirds",
//                             "cuisine": "mexican",
//                             "roach counter": "1"
//                         },
//                     ]
//                 }
//             }
//         }
//     }
// });


// describe("RestaurantIndexPage tests", () => {

//     // mock /api/currentUser and /api/systemInfo
//     const axiosMock =new AxiosMockAdapter(axios);
//     axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

//     const queryClient = new QueryClient();
//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("renders correct fields", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         const createRestaurantButton = screen.getByText("Create Restaurant");
//         expect(createRestaurantButton).toBeInTheDocument();
//         expect(createRestaurantButton).toHaveAttribute("style", "float: right;");

//         const name = screen.getByText("Freebirds");
//         expect(name).toBeInTheDocument();

//         const description = screen.getByText("mexican");
//         expect(description).toBeInTheDocument();

//         expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
//         expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Details-button")).toBeInTheDocument();
//         expect(screen.getByTestId("RestaurantTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
//     });

//     test("delete button calls delete and reloads page", async () => {

//         const restoreConsole = mockConsole();

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         const name = screen.getByText("Freebirds");
//         expect(name).toBeInTheDocument();

//         const description = screen.getByText("mexican");
//         expect(description).toBeInTheDocument();

//         const deleteButton = screen.getByTestId("RestaurantTable-cell-row-0-col-Delete-button");
//         expect(deleteButton).toBeInTheDocument();

//         deleteButton.click();

//         expect(mockDelete).toHaveBeenCalledTimes(1);
//         expect(mockDelete).toHaveBeenCalledWith(3);

//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));


//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage = `RestaurantIndexPage deleteCallback: {"id":3,"name":"Freebirds","cuisine":"mexican","roach counter":"1"}`;
//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });


//update to connect backend

import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
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

describe("RestaurantIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "RestaurantTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );


    });

    test("renders three restaurants without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").reply(200, restaurantFixtures.threeRestaurants);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders three restaurants without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").reply(200, restaurantFixtures.threeRestaurants);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/restaurants/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/restaurants/all").reply(200, restaurantFixtures.threeRestaurants);
        axiosMock.onDelete("/api/restaurants").reply(200, "Restaurant with id 1 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); 


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Restaurant with id 1 was deleted") });

    });

});


