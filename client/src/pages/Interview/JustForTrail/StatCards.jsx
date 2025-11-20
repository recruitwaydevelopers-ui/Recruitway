import React from "react";

const StatCards = ({ stats, isLoading = false }) => {
    const statItems = [
        {
            title: "Scheduled Today",
            value: stats.scheduledCount,
            colorClass: "bg-primary text-white",
            icon: "📅",
        },
        {
            title: "In Progress",
            value: stats.inProgressCount,
            colorClass: "bg-warning text-dark",
            icon: "⏳",
        },
        {
            title: "Completed Today",
            value: stats.completedCount,
            colorClass: "bg-success text-white",
            icon: "✅",
        },
        {
            title: "Cancelled",
            value: stats.cancelledCount,
            colorClass: "bg-secondary text-white",
            icon: "❌",
        },
    ];

    return (
        <div className="row g-4 mb-4">
            {statItems.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex align-items-center">
                            <div
                                className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${item.colorClass}`}
                                style={{ width: "48px", height: "48px", fontSize: "20px" }}
                            >
                                {item.icon}
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="card-subtitle text-muted mb-1">{item.title}</h6>
                                {isLoading ? (
                                    <div className="placeholder-glow w-50">
                                        <span className="placeholder col-6"></span>
                                    </div>
                                ) : (
                                    <h5 className="card-title mb-0">{item.value}</h5>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
