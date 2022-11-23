import React, { useState, useEffect } from 'react';
import backend from "../../axios_config";

import ClassList from "../../ClassList";
import './Edit.css';
import Modal from "../../Modal";

const Edit = () => {
    const [studentMenu, setStudentMenu] = useState(null);
    const [classList, setClassList] = useState(null);
    const [students, setStudents] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);
    const [openStudent, setOpenStudent] = useState(null);
    const [count, setCount] = useState(0);

    const getClassList = async () => {
        console.log("getClassList...");
        await backend.get("/users/students")
            .then(response => {
                let d = response.data;
                let students_f = [];
                for (let i = 0; i < d.length; i++) {
                    let c = d[i].class;
                    if (!students_f[c]) { students_f[c] = [];}
                    let n = d[i].id;
                    if (!students_f[c][n]) {
                        students_f[c][n] = {"name":d[i].name, "class":d[i].class, "id":d[i].id, "cars":[d[i].c_id]};
                    } else {
                        students_f[c][n]["cars"].push(d[i].c_id);
                    }
                }
                setStudents(students_f);
                renderClassList(students_f);
            })
            .catch(error => {
                // console.log(error);
            });
    }

    const renderClassList = () => {
        const c = (
            <div className="ClassListWrapper">
                {Object.keys(students).map((key) => (
                    <ClassList key={key} name={key} students={students[key]} onEdit={editStudent}/>
                ))}
            </div>
        )
        setClassList(c);
    }

    const renderStudentMenu = () => {
        const s = (
            <Modal student={openStudent} onClose={() => setOpenMenu(false)} onSave={getClassList}/>
        )
        if (openMenu) {
            setStudentMenu(s);
        } else {
            setStudentMenu(null);
            if (!count) setCount(1);
        }
    }

    const editStudent = (student) => {
        console.log(student);
        setOpenStudent(student);
        setOpenMenu(true);
    }

    // Get classList on page load
    useEffect(() => {
        getClassList();
    }, [])

    // Update display
    useEffect(() => {
        if (students) {
            renderClassList(students);
        }
    }, [students]);

    useEffect(() => {
        renderStudentMenu();
    }, [openMenu]);

    return (
        <div id="Edit">
            <div id="AppMenu">
                <div className="Add"><img src="/add.png" alt="" onClick={() => editStudent()}></img></div>
            </div>
            {studentMenu}
            {classList}
        </div>
    );
}

export default Edit;