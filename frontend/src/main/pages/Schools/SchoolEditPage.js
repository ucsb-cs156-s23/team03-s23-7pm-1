
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { schoolUtils }  from 'main/utils/schoolUtils';
import SchoolForm from 'main/components/Schools/SchoolForm';
import { useNavigate } from 'react-router-dom'


export default function SchoolEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = schoolUtils.getById(id);

    const onSubmit = async (school) => {
        const updatedSchool = schoolUtils.update(school);
        console.log("updatedSchool: " + JSON.stringify(updatedSchool));
        navigate("/schools");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit School</h1>
                <SchoolForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.school}/>
            </div>
        </BasicLayout>
    )
}
