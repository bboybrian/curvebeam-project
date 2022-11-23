import React, { useState } from "react"
import backend from "../axios_config";
import "./StudentList.css"

const StudentList = ({
    student = null,
    onEdit = () => {},
    studentCount,
    studentCounter,
}) => {
    const [active, setActive] = useState(true);

    let cars = student.cars;
    let name = student.name;
    const toggle = () => {
        backend.delete("/users/student/", { data: { student_id: student.id }})
            .then(response => {
                setActive(false);
                studentCount--;
                studentCounter(studentCount);
            })
            .catch(error => {
                // console.log(error);
            });
    }

    let c = "StudentList-car";
    if (cars.length > 1) {
        c += " multi";
        cars = '(' + cars.length + ')';
    }
    if (cars.indexOf("(") === 0) {
        c += " multi";
    }

    return (
        <div className={active ? "StudentList-row" : "StudentList-row deleted"}>
            <div className="edit button" onClick={() => onEdit(student)}><img src="edit2.png" alt=""></img></div>
            <div className="StudentList-name">{name}</div>
            <div className={c}>{cars}</div>
            <div className="deleteCar button" onClick={() => onEdit([2,student])}><img src="deleteCar.png" alt=""></img></div>
            <div className="addCar button" onClick={() => onEdit([1,student])}><img src="addCar.png" alt=""></img></div>
            <div className="delete button" onClick={toggle}><img src="delete.png" alt=""></img></div>
        </div>
    );
}

export default StudentList;