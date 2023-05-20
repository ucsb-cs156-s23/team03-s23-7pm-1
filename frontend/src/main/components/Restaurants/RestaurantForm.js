// import React from 'react'
// import { Button, Form } from 'react-bootstrap';
// import { useForm } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom'


// function RestaurantForm({ initialRestaurant, submitAction, buttonLabel="Create" }) {

//     // Stryker disable all
//     const {
//         register,
//         formState: { errors },
//         handleSubmit,
//     } = useForm(
//         { defaultValues: initialRestaurant || {}, }
//     );
//     // Stryker enable all

//     const navigate = useNavigate();

//     return (

//         <Form onSubmit={handleSubmit(submitAction)}>

//             {initialRestaurant && (
//                 <Form.Group className="mb-3" >
//                     <Form.Label htmlFor="id">Id</Form.Label>
//                     <Form.Control
//                         data-testid="RestaurantForm-id"
//                         id="id"
//                         type="text"
//                         {...register("id")}
//                         value={initialRestaurant.id}
//                         disabled
//                     />
//                 </Form.Group>
//             )}

//             <Form.Group className="mb-3" >
//                 <Form.Label htmlFor="name">Name</Form.Label>
//                 <Form.Control
//                     data-testid="RestaurantForm-name"
//                     id="name"
//                     type="text"
//                     isInvalid={Boolean(errors.name)}
//                     {...register("name", {
//                         required: "Name is required."
//                     })}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                     {errors.name?.message}
//                 </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group className="mb-3" >
//                 <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
//                 <Form.Control
//                     data-testid="RestaurantForm-cuisine"
//                     id="cuisine"
//                     type="text"
//                     isInvalid={Boolean(errors.cuisine)}
//                     {...register("cuisine", { 
//                         required: "Cuisine is required."
//                     })}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                     {errors.cuisine && 'Cuisine is required.'}
//                 </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group className="mb-3" >
//                 <Form.Label htmlFor="roachCounter">Roach Counter</Form.Label>
//                 <Form.Control
//                     data-testid="RestaurantForm-roachCounter"
//                     id="roachCounter"
//                     type="number"
//                     isInvalid={Boolean(errors.roachCounter)}
//                     {...register("roachCounter", { 
//                         required: "Roach counter is required.", 
//                         valueAsNumber: true
//                     })}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                     {errors.roachCounter && 'Roach counter is required.'}
//                 </Form.Control.Feedback>
//             </Form.Group>

//             <Button
//                 type="submit"
//                 data-testid="RestaurantForm-submit"
//             >
//                 {buttonLabel}
//             </Button>
//             <Button
//                 variant="Secondary"
//                 onClick={() => navigate(-1)}
//                 data-testid="RestaurantForm-cancel"
//             >
//                 Cancel
//             </Button>

//         </Form>

//     )
// }

// export default RestaurantForm;


import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function RestaurantForm({ initialRestaurant, submitAction, buttonLabel="Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialRestaurant || {}, }
    );
    // Stryker enable all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // // Stryker disable next-line Regex
    // const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // // Stryker disable next-line all
    // const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialRestaurant && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="RestaurantForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialRestaurant.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-name"
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-cuisine"
                    id="cuisine"
                    type="text"
                    isInvalid={Boolean(errors.cuisine)}
                    {...register("cuisine", { 
                        required: "Cuisine is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.cuisine && 'Cuisine is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="roachCounter">Roach Counter</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-roachCounter"
                    id="roachCounter"
                    type="number"
                    isInvalid={Boolean(errors.roachCounter)}
                    {...register("roachCounter", { 
                        required: "Roach counter is required.",
                        valueAsNumber: true
                     })}

                />
                <Form.Control.Feedback type="invalid">
                    {errors.roachCounter && 'Roach counter is required.'}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid="RestaurantForm-submit"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="RestaurantForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RestaurantForm;
