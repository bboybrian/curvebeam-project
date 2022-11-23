import React, { useState, useEffect } from 'react';
import backend from "../../axios_config";

import Class from "../../Class";
import './Home.css';

const initialState = {
    classes: null,
    students: null,
    query: "",
    selected: null
};

const Home = () => {
    const [classes, setClasses] = useState(null);
    const [students, setStudents] = useState(null);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    // Reset to initial state
    const resetState = () => {
        let c, s, q, sel;
        c = initialState.classes;
        s = initialState.students;
        q = initialState.query;
        sel = initialState.selected;
        setClasses(c);
        setStudents(s);
        setQuery(q);
        setSelected(sel);
    };

    // Get student data from backend
    const getClasses = async () => {
        // setQuery("");
        console.log("getClasses...");
        await backend.get("/users/student-cars")
            .then(response => {
                let d = response.data;
                let students_f = [], selected_f = [];
                for (let i = 0; i < d.length; i++) {
                    var c = d[i].class;
                    (students_f[c] = students_f[c] || []).push(d[i]);
                    (selected_f[c] = selected_f[c] || []).push(false);
                }
                setStudents(students_f);
                setSelected(selected_f);
            })
            .catch(error => {
                // console.log(error);
            });
    }

    // Render dynamic classes
    const renderClasses = () => {
        const c = (
            <div className="ClassWrapper">
                {Object.keys(students).map((key) => (
                    <Class key={key} name={key} students={students[key]} query={query} selected={selected} setSelected={setSelected} />
                ))}
            </div>
        )
        setClasses(c)
    }

    // mark selected students as 'left'
    const send = async () => {
        let ids = [];
        Object.keys(students).map((key) => {
            for (let i = 0; i < students[key].length; i++) {
                if (selected[key][i]) {
                    console.log("pushing ", key, i);
                    ids.push(students[key][i].id.toString());
                }
            }
        })

        if (ids.length > 0) {
            await backend.put("/users/student-left", { ids: ids })
                .then(response => {
                    resetState();
                    getClasses();
                })
                .catch(error => {
                    // console.log(error);
                });
        }
    }

    // mark all students as non-left
    const reset = async () => {
        console.log("Resetting...");
        resetState();
        await backend.put("/users/reset-student-left")
            .then(response => {
                console.log(response.data);
                getClasses();
                for (let j = 0; j < selected['A'].length; j++) {
                    console.log(selected['A'][j]);
                }

            })
            .catch(error => {
                // console.log(error);
            });
    }

    // get classes on page load
    useEffect(() => {
        getClasses();
    }, [])

    useEffect(() => {
        if (query != null && students != null) {
            renderClasses(students, query);
        }
    }, [students, query, selected]);

    return (
        <div id="Home">
            <div id="AppMenu">
                <div className="Reset" onClick={reset}><img src="/reset.png" alt=""></img></div>
            </div>
            {classes}
            <input className="Search" autoFocus autoComplete="on" placeholder={"Search"} onChange={(e) => setQuery({ query: e.target.value.toUpperCase() })} />
            <div className="Send" onClick={send}>Send!</div>
            <div></div>
        </div>
    );
}

export default Home;