import "./Student.css";
import {useState} from "react";

const Student = ({
    name,
    car,
    query = "",
    left,
    onClick,
}) => {
    const [selected, setSelected] = useState(false);

    const toggle = () => {
        setSelected(!selected);
        onClick();
    };

    let i = car.indexOf(query), c = "";
    let l = "row left_" + left; // class: left_0 or left_1
    car.indexOf("(") === 0 ? c = "multi" : c = "";

    // if query is empty
    if (!query) {
        return (
            <div className={l}>
                <p>{name}</p>
                <p className={c}>{car}</p>
            </div>
        )
    }
    if (query && !left) {
        // if query matches and student has not left
        if (i > -1) {
            
            return (
                <div className={l + " clickable"} style={selected ? { backgroundColor: "#8fe490", boxShadow: "0px 0px 4px black" } : {}} onClick={toggle}>
                    <p>{name}</p>
                    <p>
                        <span>{car.substring(0, car.indexOf(query))}</span>
                        <span className="highlight">{query}</span>
                        <span>{car.substring(car.indexOf(query) + query.length)}</span>
                    </p>
                </div>
            )
        } else {
            // deselect if query does not match
            if (selected) {
                toggle();
            }
        }
    }

    // if query does not match or student has left
    return null;
}

export default Student;