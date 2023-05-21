import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolForm from "main/components/Schools/SchoolForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolCreatePage() {
    const objectToAxiosParams = (school) => ({
        url: "/api/schools/post",
        method: "POST",
        params: {
            name: school.name,
            district: school.district,
            "grade range": school["grade range"],
        },
    });

    const onSuccess = (school) => {
        toast(`New school created - id: ${school.id} name: ${school.name}`);
    };

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/schools/all"]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (school) => {
        mutation.mutate(school);
    };

    if (isSuccess) {
        return <Navigate to="/schools/" />;
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New School</h1>
                <SchoolForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    );
}