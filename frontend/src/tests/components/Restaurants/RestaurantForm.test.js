// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";

// import RestaurantForm from "main/components/Restaurants/RestaurantForm";
// import { restaurantFixtures } from "fixtures/restaurantFixtures";

// import { QueryClient, QueryClientProvider } from "react-query";

// const mockedNavigate = jest.fn();

// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedNavigate
// }));

// describe("RestaurantForm tests", () => {
//     const queryClient = new QueryClient();

//     const expectedHeaders = ["Name","Cuisine","Roach Counter"];
//     const testId = "RestaurantForm";

//     test("renders correctly with no initialContents", async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <Router>
//                     <RestaurantForm />
//                 </Router>
//             </QueryClientProvider>
//         );

//         expect(await screen.findByText(/Create/)).toBeInTheDocument();

//         expectedHeaders.forEach((headerText) => {
//             const header = screen.getByText(headerText);
//             expect(header).toBeInTheDocument();
//           });

//     });

//     test("renders correctly when passing in initialContents", async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <Router>
//                     <RestaurantForm initialContents={restaurantFixtures.oneRestaurant} />
//                 </Router>
//             </QueryClientProvider>
//         );

//         expect(await screen.findByText(/Create/)).toBeInTheDocument();

//         expectedHeaders.forEach((headerText) => {
//             const header = screen.getByText(headerText);
//             expect(header).toBeInTheDocument();
//         });

//         expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
//         expect(screen.getByText(`Id`)).toBeInTheDocument();
//     });


//     test("that navigate(-1) is called when Cancel is clicked", async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <Router>
//                     <RestaurantForm />
//                 </Router>
//             </QueryClientProvider>
//         );
//         expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
//         const cancelButton = screen.getByTestId(`${testId}-cancel`);

//         fireEvent.click(cancelButton);

//         await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
//     });

// });

//update to connect backend

import { render, waitFor, fireEvent } from "@testing-library/react";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RestaurantForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });

    test("renders correctly when passing in a Restaurant", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm initialRestaurant={restaurantFixtures.oneRestaurant}  />
            </Router>
        );
        await findByTestId(/RestaurantForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/RestaurantForm-id/)).toHaveValue("RestaurantForm-id");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-name");
        const nameField = getByTestId("RestaurantForm-name");
        const cuisineField = getByTestId("RestaurantForm-cuisine");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'bad-input' } });
        fireEvent.change(cuisineField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        // await findByText(/name must be in the format YYYYQ/);
        // expect(getByText(/localDateTime must be in ISO format/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-submit");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Cuisine is required./)).toBeInTheDocument();
        expect(getByText(/Roach counter is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <RestaurantForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("RestaurantForm-name");

        const nameField = getByTestId("RestaurantForm-name");
        const cuisineField = getByTestId("RestaurantForm-cuisine");
        const roachCounterField = getByTestId("RestaurantForm-roachCounter");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'The Habit' } });
        fireEvent.change(cuisineField, { target: { value: 'american' } });
        fireEvent.change(roachCounterField, { target: { value: 5 } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());


    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-cancel");
        const cancelButton = getByTestId("RestaurantForm-cancel");

        fireEvent.click(cancelButton);
        
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


