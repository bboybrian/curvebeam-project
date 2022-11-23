import { useState } from 'react';
import backend from "../axios_config";
import "./Modal.css";

const Modal = ({ student = null, onClose, onSave }) => {
    let name = "", c = "", cars = [], hideName = false;
    let mode = 0;     // mode 0 = new student, mode 1 = edit student, mode 2 = add car, mode 3 = del car
    c = student?.class;

    if (student?.cars) {
        cars = student.cars;
        mode = 1;
    }

    let h1 = student ? "Edit Student" : "Add Student";
    if (student) {
        if (student[0] === 1) {
            h1 = "Add Car";
            c = "Car";
            mode = 2;
            hideName = true;

        } else if (student[0] === 2) {
            h1 = "Delete Car";
            c = "Car";
            mode = 3;
            hideName = true;
        }
        student = student[1] ? student[1] : student;
    }
    name = student?.name;

    const [newName, setNewName] = useState(name);
    const [newClass, setNewClass] = useState(c);

    const save = () => {
        if (mode === 1) {
            // update student
            backend.put("/users/student/", {
                name: newName,
                class: newClass,
                s_id: student.id,
            }).then(response => {
                onSave();
            }).catch(error => {
                // console.log(error);
            });

        } else if (mode === 0) {
            // create student
            backend.post("/users/student/", {
                name: newName,
                class: newClass,
            }).then(response => {
                onSave();
            }).catch(error => {
                // console.log(error);
            });
        } else if (mode === 2) {
            // add car
            backend.post("/users/assign-car/", {
                s_id: student.id,
                car: newClass.toUpperCase(),
            }).then(response => {
                onSave();
            }).catch(error => {
                // console.log(error);
            });
        } else if (mode === 3) {
            // delete car
            console.log(student.id, newClass);
            backend.delete("/users/unassign-car/", {
                data: {
                    s_id: student.id,
                    car: newClass.toUpperCase(),
                }
            }).then(response => {
                onSave();
            }).catch(error => {
                // console.log(error);
            });
        }
        onClose(false);
    };

    return (
        <div className="modalContainer" onClick={() => onClose(false)}>
            <div className="modalMenu" onClick={(e) => e.stopPropagation()}>
                <h1>{h1}</h1>
                <div className={hideName ? "studentName" : "deleted"}>{name ? name : "Name"}</div>
                <input className={hideName ? "deleted" : "studentName"} placeholder={name ? name : "Name"} onChange={(e) => setNewName(e.target.value)}></input>
                <input className={hideName ? "studentCars" : "StudentClass"} placeholder={c ? c : "Class"} onChange={(e) => setNewClass(e.target.value)}></input>
                {cars.map((car) => {
                    return (
                        <div className="studentCars">{car}</div>
                    )
                })}
                <div className="modalButton" onClick={save}>Save</div>
            </div>
        </div>
    );
}

export default Modal;