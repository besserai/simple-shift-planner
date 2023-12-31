import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import './App.css';

const personal = [{ "name": "Andre", "color": "lightpink" }, { "name": "Susi", "color": "lightblue" }, { "name": "Rene", "color": "lightgreen" }, { "name": "Anna", "color": "lightyellow" }, { "name": "Richard", "color": "moccasin" }, { "name": "Leni", "color": "turquoise" }]

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}-${new Date().getTime()}`,
        content: `${personal[k].name}`,
        color: `${personal[k].color}`
    }));

const getMoreItems = (countPerDay) => {
    let weekdayArray = [];
    for (let i = 0; i < 5; i++) {
        weekdayArray.push(
            getItems(countPerDay, i * countPerDay)
        );
    }
    return weekdayArray
}


const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle, color) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "white" : color,

    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    minWidth: 100,
    flex: 1
});

function QuoteApp() {
    const [state, setState] = useState(getMoreItems(5));

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];
            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];

            setState(newState.filter(group => group.length));
        }
    }

    return (
        <div>
            {/* <button
                type="button"
                onClick={() => {
                    setState([...state, []]);
                }}
            >
                Add new group
            </button> */}
            Schicht hinzufügen:
            {personal.map((item) => (
                <button
                    type="button"
                    style={{ backgroundColor: `${item.color}` }}
                    onClick={() => {
                        let newItem = { id: `item-${new Date().getTime()}`, content: `${item.name}`, color: `${item.color}` }
                        setState([...state, [newItem]]);
                    }}
                >
                    {item.name}
                </button>
            ))}
            <div style={{ display: "flex" }}>
                <span style={{ flex: 1, minWidth: 50 }}>
                    <h2> Schicht: </h2>
                    {["Früh 1", "Früh 2", "Spät 1", "Spät 1", "Nacht"].map((item) => (
                        <div style={{
                            textAlign: "center",
                            border: "1px solid black",
                            padding: 20,
                            backgroundColor: "lightgrey"
                        }}>{item}</div>
                    ))}
                </span>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <div style={{ flex: 2, minWidth: 100 }}>
                            <h2 style={{ textAlign: "center" }}>{["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"][ind]}</h2>
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}

                                        {...provided.droppableProps}
                                    >
                                        {el.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style,
                                                            item.color
                                                        )}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "space-around"
                                                            }}
                                                        >
                                                            {item.content}

                                                            {/* <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newState = [...state];
                                                                newState[ind].splice(index, 1);
                                                                setState(
                                                                    newState.filter(group => group.length)
                                                                );
                                                            }}
                                                        >
                                                            delete
                                                        </button> */}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<QuoteApp />, rootElement);
