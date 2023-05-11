// get schools from local storage
const get = () => {
    const schoolValue = localStorage.getItem("schools");
    if (schoolValue === undefined) {
        const schoolCollection = { nextId: 1, schools: [] }
        return set(schoolCollection);
    }
    const schoolCollection = JSON.parse(schoolValue);
    if (schoolCollection === null) {
        const schoolCollection = { nextId: 1, schools: [] }
        return set(schoolCollection);
    }
    return schoolCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const schoolCollection = get();
    const schools = schoolCollection.schools;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = schools.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `school with id ${id} not found` };
    }
    return { school: schools[index] };
}

// set schools in local storage
const set = (schoolCollection) => {
    localStorage.setItem("schools", JSON.stringify(schoolCollection));
    return schoolCollection;
};

// add a school to local storage
const add = (school) => {
    const schoolCollection = get();
    school = { ...school, id: schoolCollection.nextId };
    schoolCollection.nextId++;
    schoolCollection.schools.push(school);
    set(schoolCollection);
    return school;
};

// update a school in local storage
const update = (school) => {
    const schoolCollection = get();

    const schools = schoolCollection.schools;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = schools.findIndex((r) => r.id == school.id);
    if (index === -1) {
        return { "error": `school with id ${school.id} not found` };
    }
    schools[index] = school;
    set(schoolCollection);
    return { schoolCollection: schoolCollection };
};

// delete a school from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const schoolCollection = get();
    const schools = schoolCollection.schools;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = schools.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `school with id ${id} not found` };
    }
    schools.splice(index, 1);
    set(schoolCollection);
    return { schoolCollection: schoolCollection };
};

const schoolUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { schoolUtils };
