import React, { useEffect } from "react"
import "./Class.css"
import Student from "../Student";

// Highlight search query

const Class = ({
	name = null,
	students = null,
	query = "",
	selected,
	setSelected,
}) => {
	let car_counts = [], student_count = 0, left_count = 0;
	// Count the number of cars per student
	for (let i = 0; i < students.length; i++) {
		if (car_counts[students[i].name]) {
			car_counts[students[i].name]++;
		} else {
			car_counts[students[i].name] = 1;
			if (!students[i].left) { // Count the number of students still in class
				student_count++;
			} else {
                left_count++;
            }
		}
	}

	useEffect(() => {
		if (selected) {
			setSelected(selected);
		}
	}, [setSelected, selected]);

	// select student i (callback function for Student component)
	function handleChildClick(i) {
		selected[name][i] = !selected[name][i];
		// console.log("class ", selected[name][i], selected[name]);
		console.log("Class:", selected);
	}

	// unselect everything if query is empty
	if (!query.query && selected) {
		selected[name].fill(false);
		// console.log("class ", selected[name]);
	}

	return (
		<div className={"Class S" + student_count}>
			<div className="row">
				<h2>Class {name}</h2>
                <div className="counts">
                    <h2 className={"student_count"}>{student_count}</h2>
                    <h2 className={"left_count"}>{left_count}</h2>
                </div>
			</div>
			<div className="row">
				<h3>NAME</h3>
				<h3>CAR</h3>
			</div>

			{students.map((student, i) => {
				let c = student.c_id;
				if (!query.query) {
					// if no query, collapse students with multiple cars
					if (car_counts[student.name] < 1) return;
					if (car_counts[student.name] > 1) {
						c = "(" + car_counts[student.name] + ")";
						car_counts[student.name] = 0;
					}
				}

				return (
					<Student key={student.id + student.c_id} name={student.name} car={c} query={query.query} left={student.left} onClick={event => handleChildClick(i)} />
				)
			})}
		</div>
	);
}

export default Class;