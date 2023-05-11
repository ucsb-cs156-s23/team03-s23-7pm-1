import React from 'react';
import SchoolForm from "main/components/Schools/SchoolForm"
import { schoolFixtures } from 'fixtures/schoolFixtures';

export default {
    title: 'components/Schools/SchoolForm',
    component: SchoolForm
};

const Template = (args) => {
    return (
        <SchoolForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    School: schoolFixtures.oneSchool,
    submitText: "",
    submitAction: () => { }
};