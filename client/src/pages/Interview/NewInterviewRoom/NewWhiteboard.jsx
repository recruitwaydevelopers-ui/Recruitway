// import { useEffect, useRef } from "react";
// import { useAuthContext } from "../../../context/auth-context";

// const NewWhiteboard = ({ roomId, socket, state, onStateChange }) => {
//     const { user, server, token } = useAuthContext();
//     const canvasRef = useRef(null);
//     const isDrawingRef = useRef(false);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         // Set canvas dimensions
//         const resizeCanvas = () => {
//             const displayWidth = canvas.clientWidth;
//             const displayHeight = canvas.clientHeight;
//             if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
//                 canvas.width = displayWidth;
//                 canvas.height = displayHeight;
//                 redrawCanvas();
//             }
//         };

//         // Redraw all saved paths
//         const redrawCanvas = () => {
//             ctx.fillStyle = "white";
//             ctx.fillRect(0, 0, canvas.width, canvas.height);

//             state.paths.forEach(path => {
//                 if (path.points.length > 0) {
//                     ctx.beginPath();
//                     ctx.lineWidth = path.lineWidth;
//                     ctx.lineCap = "round";
//                     ctx.strokeStyle = path.color;
//                     ctx.moveTo(path.points[0].x, path.points[0].y);

//                     for (let i = 1; i < path.points.length; i++) {
//                         ctx.lineTo(path.points[i].x, path.points[i].y);
//                     }

//                     ctx.stroke();
//                 }
//             });
//         };

//         resizeCanvas();
//         redrawCanvas();

//         window.addEventListener('resize', resizeCanvas);

//         // Set initial styles
//         ctx.lineWidth = 3;
//         ctx.lineCap = "round";
//         ctx.strokeStyle = "#000000";

//         const startDrawing = (e) => {
//             isDrawingRef.current = true;
//             const rect = canvas.getBoundingClientRect();
//             const x = e.clientX - rect.left;
//             const y = e.clientY - rect.top;

//             ctx.beginPath();
//             ctx.moveTo(x, y);

//             const newPath = {
//                 points: [{ x, y }],
//                 color: ctx.strokeStyle,
//                 lineWidth: ctx.lineWidth
//             };

//             const newState = {
//                 ...state,
//                 currentPath: newPath,
//                 paths: [...state.paths, newPath]
//             };

//             onStateChange(newState);
//             socket.emit("startDrawing", { roomId, path: newPath });
//         };

//         const draw = (e) => {
//             if (!isDrawingRef.current) return;

//             const rect = canvas.getBoundingClientRect();
//             const x = e.clientX - rect.left;
//             const y = e.clientY - rect.top;

//             ctx.lineTo(x, y);
//             ctx.stroke();

//             const updatedPath = {
//                 ...state.currentPath,
//                 points: [...state.currentPath.points, { x, y }]
//             };

//             const updatedPaths = [...state.paths];
//             updatedPaths[updatedPaths.length - 1] = updatedPath;

//             const newState = {
//                 ...state,
//                 currentPath: updatedPath,
//                 paths: updatedPaths
//             };

//             onStateChange(newState);
//             socket.emit("draw", { roomId, x, y });
//         };

//         const stopDrawing = () => {
//             if (isDrawingRef.current) {
//                 isDrawingRef.current = false;
//                 const newState = {
//                     ...state,
//                     currentPath: null
//                 };
//                 onStateChange(newState);
//                 socket.emit("stopDrawing", { roomId });
//             }
//         };

//         // Mouse events
//         canvas.addEventListener("mousedown", startDrawing);
//         canvas.addEventListener("mousemove", draw);
//         canvas.addEventListener("mouseup", stopDrawing);
//         canvas.addEventListener("mouseout", stopDrawing);

//         // Touch events
//         canvas.addEventListener("touchstart", (e) => {
//             e.preventDefault();
//             const touch = e.touches[0];
//             const mouseEvent = new MouseEvent("mousedown", {
//                 clientX: touch.clientX,
//                 clientY: touch.clientY
//             });
//             canvas.dispatchEvent(mouseEvent);
//         });

//         canvas.addEventListener("touchend", (e) => {
//             e.preventDefault();
//             const mouseEvent = new MouseEvent("mouseup", {});
//             canvas.dispatchEvent(mouseEvent);
//         });

//         canvas.addEventListener("touchmove", (e) => {
//             e.preventDefault();
//             const touch = e.touches[0];
//             const mouseEvent = new MouseEvent("mousemove", {
//                 clientX: touch.clientX,
//                 clientY: touch.clientY
//             });
//             canvas.dispatchEvent(mouseEvent);
//         });

//         // Socket events
//         socket.on("startDrawing", ({ path }) => {
//             const newState = {
//                 ...state,
//                 currentPath: path,
//                 paths: [...state.paths, path]
//             };
//             onStateChange(newState);
//         });

//         socket.on("draw", ({ x, y }) => {
//             if (!state.currentPath) return;

//             const rect = canvas.getBoundingClientRect();
//             const updatedPath = {
//                 ...state.currentPath,
//                 points: [...state.currentPath.points, { x, y }]
//             };

//             const updatedPaths = [...state.paths];
//             updatedPaths[updatedPaths.length - 1] = updatedPath;

//             const newState = {
//                 ...state,
//                 currentPath: updatedPath,
//                 paths: updatedPaths
//             };

//             onStateChange(newState);

//             // Draw on canvas
//             ctx.lineTo(x, y);
//             ctx.stroke();
//         });

//         socket.on("stopDrawing", () => {
//             const newState = {
//                 ...state,
//                 currentPath: null
//             };
//             onStateChange(newState);
//         });

//         socket.on("whiteboardState", (data) => {
//             onStateChange(data);
//             redrawCanvas();
//         });

//         return () => {
//             window.removeEventListener('resize', resizeCanvas);
//             canvas.removeEventListener("mousedown", startDrawing);
//             canvas.removeEventListener("mousemove", draw);
//             canvas.removeEventListener("mouseup", stopDrawing);
//             canvas.removeEventListener("mouseout", stopDrawing);
//             socket.off("startDrawing");
//             socket.off("draw");
//             socket.off("stopDrawing");
//             socket.off("whiteboardState");
//         };
//     }, [roomId, state, onStateChange, socket]);

//     return <canvas ref={canvasRef} className="w-100 h-100" />;
// };

// export default NewWhiteboard;











import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../../context/auth-context";

const NewWhiteboard = ({ roomId, socket, state, onStateChange }) => {
    const { user, server, token } = useAuthContext();
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        const resizeCanvas = () => {
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                redrawCanvas();
            }
        };

        // Redraw all saved paths
        const redrawCanvas = () => {
            // Clear canvas first
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Redraw all paths
            if (state.paths && state.paths.length > 0) {
                state.paths.forEach(path => {
                    if (path.points && path.points.length > 0) {
                        ctx.beginPath();
                        ctx.lineWidth = path.lineWidth || 3;
                        ctx.lineCap = "round";
                        ctx.strokeStyle = path.color || "#000000";
                        ctx.moveTo(path.points[0].x, path.points[0].y);

                        for (let i = 1; i < path.points.length; i++) {
                            ctx.lineTo(path.points[i].x, path.points[i].y);
                        }

                        ctx.stroke();
                    }
                });
            }
        };

        // Initial setup
        resizeCanvas();
        redrawCanvas();

        // Handle window resize
        window.addEventListener('resize', resizeCanvas);

        // Set current drawing styles
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        const startDrawing = (e) => {
            isDrawingRef.current = true;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.beginPath();
            ctx.moveTo(x, y);

            const newPath = {
                points: [{ x, y }],
                color: color,
                lineWidth: lineWidth
            };

            const newState = {
                ...state,
                currentPath: newPath,
                paths: [...(state.paths || []), newPath]
            };

            onStateChange(newState);
            socket.emit("startDrawing", { roomId, path: newPath });
        };

        const draw = (e) => {
            if (!isDrawingRef.current) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineTo(x, y);
            ctx.stroke();

            if (state.currentPath) {
                const updatedPath = {
                    ...state.currentPath,
                    points: [...(state.currentPath.points || []), { x, y }]
                };

                const updatedPaths = [...(state.paths || [])];
                if (updatedPaths.length > 0) {
                    updatedPaths[updatedPaths.length - 1] = updatedPath;
                }

                const newState = {
                    ...state,
                    currentPath: updatedPath,
                    paths: updatedPaths
                };

                onStateChange(newState);
                socket.emit("draw", { roomId, x, y });
            }
        };

        const stopDrawing = () => {
            if (isDrawingRef.current) {
                isDrawingRef.current = false;
                const newState = {
                    ...state,
                    currentPath: null
                };
                onStateChange(newState);
                socket.emit("stopDrawing", { roomId });
            }
        };

        // Mouse events
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseout", stopDrawing);

        // Touch events
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
        });

        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });

        // Socket events
        socket.on("startDrawing", ({ path }) => {
            const newState = {
                ...state,
                currentPath: path,
                paths: [...(state.paths || []), path]
            };
            onStateChange(newState);
            redrawCanvas();
        });

        socket.on("draw", ({ x, y }) => {
            if (!state.currentPath) return;

            const updatedPath = {
                ...state.currentPath,
                points: [...(state.currentPath.points || []), { x, y }]
            };

            const updatedPaths = [...(state.paths || [])];
            if (updatedPaths.length > 0) {
                updatedPaths[updatedPaths.length - 1] = updatedPath;
            }

            const newState = {
                ...state,
                currentPath: updatedPath,
                paths: updatedPaths
            };

            onStateChange(newState);

            // Draw on canvas
            ctx.beginPath();
            ctx.moveTo(state.currentPath.points[state.currentPath.points.length - 1]?.x || 0, 
                      state.currentPath.points[state.currentPath.points.length - 1]?.y || 0);
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        socket.on("stopDrawing", () => {
            const newState = {
                ...state,
                currentPath: null
            };
            onStateChange(newState);
        });

        socket.on("whiteboardState", (data) => {
            onStateChange(data);
            redrawCanvas();
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", stopDrawing);
            canvas.removeEventListener("mouseout", stopDrawing);
            socket.off("startDrawing");
            socket.off("draw");
            socket.off("stopDrawing");
            socket.off("whiteboardState");
        };
    }, [roomId, state, onStateChange, socket, color, lineWidth]);

    const clearWhiteboard = () => {
        const newState = {
            ...state,
            paths: [],
            currentPath: null
        };
        onStateChange(newState);
        socket.emit("whiteboardState", { roomId, state: newState });
        
        // Clear the canvas immediately
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="d-flex flex-column h-100 bg-white">
            <div className="p-2 bg-light border-bottom">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <label className="form-label mb-0 text-dark">Color:</label>
                        <input
                            type="color"
                            className="form-control form-control-color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            title="Choose color"
                        />
                        <label htmlFor="range1" className="form-label mb-0 text-dark">Size:</label>
                        <input
                            type="range"
                            className="form-range custom-range"
                            id="range1"
                            min="1"
                            max="20"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(parseInt(e.target.value))}
                            style={{ width: "80px" }}
                        />
                    </div>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={clearWhiteboard}
                    >
                        <i className="bi bi-trash me-1"></i> Clear
                    </button>
                </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
                <canvas ref={canvasRef} className="w-100 h-100" />
            </div>

            <style>{`
                .custom-range::-webkit-slider-runnable-track {
                    background: black;
                    height: 0.5rem;
                    border-radius: 0.25rem;
                }

                .custom-range::-moz-range-track {
                    background: black;
                    height: 0.5rem;
                    border-radius: 0.25rem;
                }

                .custom-range::-ms-track {
                    background: black;
                    height: 0.5rem;
                    border-radius: 0.25rem;
                    border-color: transparent;
                    color: transparent;
                }

                .custom-range::-webkit-slider-thumb {
                    background: white;
                    border: 2px solid black;
                }

                .custom-range::-moz-range-thumb {
                    background: white;
                    border: 2px solid black;
                }

                .custom-range::-ms-thumb {
                    background: white;
                    border: 2px solid black;
                }
            `}</style>
        </div>
    );
};

export default NewWhiteboard;

