import React, {useState} from "react"
import "./ClassList.css"
import StudentList from "../StudentList";

const ClassList = ({
    name = null,
    students = null,
    onEdit = () => {},
}) => {
    const [student_count, setStudentCount] = useState(Object.keys(students).length);

    return (
		<div className={"ClassList S" + student_count}>
            <h3>Class {name}: <span>{student_count} students</span></h3>

            {Object.keys(students).map((i) => {	
                let student = students[i];
                return (
                    <StudentList key={student.id + student.c_id} student={student} onEdit={onEdit} studentCount={student_count} studentCounter={setStudentCount}></StudentList>
                )
            })}

        </div>
    );
}

export default ClassList;