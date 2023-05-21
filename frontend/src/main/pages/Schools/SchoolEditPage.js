import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SchoolForm from "main/components/Schools/SchoolForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolEditPage() {
    let { id } = useParams();

    const { data: school, error, status } = useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/schools?id=${id}`],
        {
            // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/schools`,
            params: { id }
        }
    );

    const objectToAxiosPutParams = (school) => ({
        url: "/api/schools",
        method: "PUT",
        params: { id: school.id },
        data: {
            name: school.name,
            district: school.district,
            "grade range": school["grade range"],
        }
    });

    const onSuccess = (school) => {
        toast(`School Updated - id: ${school.id} name: ${school.name}`);
    };

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/schools?id=${id}`]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    if (isSuccess) {
        return <Navigate to="/schools" />;
    }
    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit School</h1>
                {school && (
                    <SchoolForm
                        submitAction={onSubmit}
                        buttonLabel={"Update"}
                        initialContents={school}
                    />
                )}
            </div>
        </BasicLayout>
    );
}