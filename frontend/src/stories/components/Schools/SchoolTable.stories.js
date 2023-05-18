import React from 'react';
import SchoolTable from 'main/components/Schools/SchoolTable';
import { schoolFixtures } from 'fixtures/schoolFixtures';

export default {
    title: 'components/Schools/SchoolTable',
    component: SchoolTable
};

const Template = (args) => {
    return (
        <SchoolTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    schools: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    schools: schoolFixtures.threeSchools,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    schools: schoolFixtures.threeSchools,
    showButtons: true
};
