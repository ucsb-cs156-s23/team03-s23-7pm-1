import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RestaurantForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    const navigate = useNavigate();
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker enable all
   
    const testIdPrefix = "RestaurantForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required.",
                        maxLength : {
                            value: 50,
                            message: "Max length 50 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="cuisine">Cuisine</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-cuisine"}
                    id="cuisine"
                    type="text"
                    isInvalid={Boolean(errors.cuisine)}
                    {...register("cuisine", {
                        required: "Cuisine is required.",
                        maxLength : {
                            value: 25,
                            message: "Max length 25 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.cuisine?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="roachCounter">Roach Counter</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-roachCounter"}
                    id="roachCounter"
                    type="number"
                    isInvalid={Boolean(errors.roachCounter)}
                    {...register("roachCounter", {
                        required: "Roach counter is required.",
                        valueAsNumber: true,
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.roachCounter?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RestaurantForm;