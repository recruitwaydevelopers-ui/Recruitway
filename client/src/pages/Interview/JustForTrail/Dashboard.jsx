import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import InterviewTable from "./InterviewTable";
import CompletedInterviewsTable from "./CompletedInterviewsTable";
import StatCards from "./StatCards";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import Layout from "./Layout";

const Dashboard = () => {
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    // const [allInterviews, setAllInterviews] = useState([]);
    const [todayInterviews, setTodayInterviews] = useState([]);
    // const [completedInterviews, setCompletedInterviews] = useState([]);
    const [interviewStats, setInterviewStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Custom function to fetch data
    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all interviews
            const allInterviewsResponse = await axios.get("http://localhost:4000/api/interviews/all");
            setAllInterviews(allInterviewsResponse.data);

            // Fetch today's interviews
            const todayInterviewsResponse = await axios.get("http://localhost:4000/api/interviews/today");
            setTodayInterviews(todayInterviewsResponse.data);

            // Fetch completed interviews
            // const completedInterviewsResponse = await axios.get("http://localhost:4000/api/interviews/completed");
            // setCompletedInterviews(completedInterviewsResponse.data);

            // Fetch interview stats
            const statsResponse = await axios.get("http://localhost:4000/api/interview-stats");
            setInterviewStats(statsResponse.data);
        } catch (error) {
            toast.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const allInterviews = [
        {
            id: 1,
            date: "2025-04-10",
            startTime: "10:00",
            endTime: "11:00",
            status: "Completed",
            meetingLink: "https://meet.example.com/abc123",
            meetingLinkSent: true,
            candidate: {
                id: 101,
                name: "Aarav Mehta",
                email: "aarav.mehta@example.com",
                phone: "9876543210",
                resumeUrl: "https://example.com/resume-aarav.pdf",
                imageUrl: "https://example.com/images/aarav.jpg"
            },
            position: {
                id: 201,
                title: "Backend Developer",
                department: "Engineering"
            }
        },
        {
            id: 2,
            date: "2025-04-11",
            startTime: "14:00",
            endTime: "15:00",
            status: "scheduled",
            meetingLink: "https://meet.example.com/xyz456",
            meetingLinkSent: false,
            candidate: {
                id: 102,
                name: "Nisha Kapoor",
                email: "nisha.kapoor@example.com",
                phone: null,
                resumeUrl: null,
                imageUrl: null
            },
            position: {
                id: 202,
                title: "Frontend Developer",
                department: "UI/UX"
            }
        },
        {
            id: 3,
            date: "2025-04-12",
            startTime: "09:00",
            endTime: "10:30",
            status: "Completed",
            meetingLink: "https://meet.example.com/lmn789",
            meetingLinkSent: true,
            candidate: {
                id: 103,
                name: "Ravi Joshi",
                email: "ravi.joshi@example.com",
                phone: "9123456789",
                resumeUrl: "https://example.com/resume-ravi.pdf",
                imageUrl: "https://example.com/images/ravi.jpg"
            },
            position: {
                id: 203,
                title: "Full Stack Engineer",
                department: "Development"
            }
        },
        {
            id: 4,
            date: "2025-04-13",
            startTime: "11:00",
            endTime: "12:00",
            status: "Cancelled",
            meetingLink: "https://meet.example.com/opq123",
            meetingLinkSent: true,
            candidate: {
                id: 104,
                name: "Meera Sinha",
                email: "meera.sinha@example.com",
                phone: "9876501234",
                resumeUrl: null,
                imageUrl: null
            },
            position: {
                id: 204,
                title: "Data Analyst",
                department: "Data Science"
            }
        },
        {
            id: 5,
            date: "2025-04-14",
            startTime: "15:00",
            endTime: "16:00",
            status: "scheduled",
            meetingLink: "https://meet.example.com/ghi321",
            meetingLinkSent: false,
            candidate: {
                id: 105,
                name: "Karan Patel",
                email: "karan.patel@example.com",
                phone: "9845612378",
                resumeUrl: "https://example.com/resume-karan.pdf",
                imageUrl: null
            },
            position: {
                id: 205,
                title: "DevOps Engineer",
                department: "Infrastructure"
            }
        },
        {
            id: 6,
            date: "2025-04-15",
            startTime: "13:00",
            endTime: "14:00",
            status: "Completed",
            meetingLink: "https://meet.example.com/stu654",
            meetingLinkSent: true,
            candidate: {
                id: 106,
                name: "Anjali Rao",
                email: "anjali.rao@example.com",
                phone: "9898123456",
                resumeUrl: null,
                imageUrl: "https://example.com/images/anjali.jpg"
            },
            position: {
                id: 206,
                title: "QA Tester",
                department: "Quality Assurance"
            }
        },
        {
            id: 7,
            date: "2025-04-16",
            startTime: "16:00",
            endTime: "17:00",
            status: "in-progress",
            meetingLink: "https://meet.example.com/vwx987",
            meetingLinkSent: true,
            candidate: {
                id: 107,
                name: "Dev Khanna",
                email: "dev.khanna@example.com",
                phone: null,
                resumeUrl: "https://example.com/resume-dev.pdf",
                imageUrl: null
            },
            position: {
                id: 207,
                title: "Cloud Architect",
                department: "Engineering"
            }
        },
        {
            id: 8,
            date: "2025-04-17",
            startTime: "12:00",
            endTime: "13:00",
            status: "Completed",
            meetingLink: "https://meet.example.com/yza112",
            meetingLinkSent: true,
            candidate: {
                id: 108,
                name: "Ishita Nair",
                email: "ishita.nair@example.com",
                phone: "9823412345",
                resumeUrl: "https://example.com/resume-ishita.pdf",
                imageUrl: "https://example.com/images/ishita.jpg"
            },
            position: {
                id: 208,
                title: "Product Manager",
                department: "Product"
            }
        },
        {
            id: 9,
            date: "2025-04-18",
            startTime: "10:30",
            endTime: "11:30",
            status: "scheduled",
            meetingLink: "https://meet.example.com/bcd345",
            meetingLinkSent: false,
            candidate: {
                id: 109,
                name: "Vikram Chauhan",
                email: "vikram.chauhan@example.com",
                phone: null,
                resumeUrl: null,
                imageUrl: null
            },
            position: {
                id: 209,
                title: "Machine Learning Engineer",
                department: "AI/ML"
            }
        },
        {
            id: 10,
            date: "2025-04-19",
            startTime: "17:00",
            endTime: "18:00",
            status: "Completed",
            meetingLink: "https://meet.example.com/efg678",
            meetingLinkSent: true,
            candidate: {
                id: 110,
                name: "Sneha Verma",
                email: "sneha.verma@example.com",
                phone: "9901122334",
                resumeUrl: "https://example.com/resume-sneha.pdf",
                imageUrl: "https://example.com/images/sneha.jpg"
            },
            position: {
                id: 210,
                title: "UI Designer",
                department: "UI/UX"
            }
        }
    ];


    const completedInterviews = [
        {
            candidate: {
                id: 'c1',
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                phone: '555-123-4567',
                resumeUrl: 'https://example.com/resumes/alice.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            position: {
                id: 'p1',
                title: 'Software Engineer',
                department: 'Engineering'
            }
        },
        {
            candidate: {
                id: 'c2',
                name: 'Michael Smith',
                email: 'michael.smith@example.com',
                phone: '555-987-6543',
                resumeUrl: 'https://example.com/resumes/michael.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            position: {
                id: 'p2',
                title: 'Product Manager',
                department: 'Product'
            }
        },
        {
            candidate: {
                id: 'c3',
                name: 'Emily Davis',
                email: 'emily.davis@example.com',
                phone: null,
                resumeUrl: null,
                imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            position: {
                id: 'p3',
                title: 'UX Designer',
                department: 'Design'
            }
        },
        {
            candidate: {
                id: 'c4',
                name: 'James Lee',
                email: 'james.lee@example.com',
                phone: '555-222-3344',
                resumeUrl: 'https://example.com/resumes/james.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
            },
            position: {
                id: 'p4',
                title: 'DevOps Engineer',
                department: 'Engineering'
            }
        },
        {
            candidate: {
                id: 'c5',
                name: 'Olivia Brown',
                email: 'olivia.brown@example.com',
                phone: '555-666-7788',
                resumeUrl: null,
                imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg'
            },
            position: {
                id: 'p5',
                title: 'Data Scientist',
                department: 'Data'
            }
        },
        {
            candidate: {
                id: 'c6',
                name: 'Daniel Wilson',
                email: 'daniel.wilson@example.com',
                phone: null,
                resumeUrl: 'https://example.com/resumes/daniel.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/men/6.jpg'
            },
            position: {
                id: 'p6',
                title: 'QA Analyst',
                department: 'Quality Assurance'
            }
        },
        {
            candidate: {
                id: 'c7',
                name: 'Sophia Martinez',
                email: 'sophia.martinez@example.com',
                phone: '555-111-2233',
                resumeUrl: 'https://example.com/resumes/sophia.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/women/7.jpg'
            },
            position: {
                id: 'p7',
                title: 'Marketing Specialist',
                department: 'Marketing'
            }
        },
        {
            candidate: {
                id: 'c8',
                name: 'William Anderson',
                email: 'william.anderson@example.com',
                phone: '555-444-5566',
                resumeUrl: 'https://example.com/resumes/william.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/men/8.jpg'
            },
            position: {
                id: 'p8',
                title: 'Sales Representative',
                department: 'Sales'
            }
        },
        {
            candidate: {
                id: 'c9',
                name: 'Isabella Clark',
                email: 'isabella.clark@example.com',
                phone: '555-888-9990',
                resumeUrl: null,
                imageUrl: 'https://randomuser.me/api/portraits/women/9.jpg'
            },
            position: {
                id: 'p9',
                title: 'HR Coordinator',
                department: 'Human Resources'
            }
        },
        {
            candidate: {
                id: 'c10',
                name: 'Liam Martinez',
                email: 'liam.martinez@example.com',
                phone: null,
                resumeUrl: 'https://example.com/resumes/liam.pdf',
                imageUrl: 'https://randomuser.me/api/portraits/men/10.jpg'
            },
            position: {
                id: 'p10',
                title: 'Business Analyst',
                department: 'Business Intelligence'
            }
        }
    ];



    // Filter scheduled interviews
    const scheduledInterviews = allInterviews.filter(
        (interview) =>
            interview.status === "scheduled" || interview.status === "in-progress"
    );

    // Fallback stats if loading
    const stats = interviewStats || {
        scheduledCount: 0,
        inProgressCount: 0,
        completedCount: 0,
        cancelledCount: 0,
    };

    return (
        <Layout>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold">Scheduled Interviews</h2>
                        <p className="text-muted">Manage and monitor all your scheduled interviews.</p>
                    </div>
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setShowScheduleModal(true)}
                    >
                        <i className="ti ti-plus-circle"></i> Schedule Interview
                    </button>
                </div>

                {/* Stats Cards */}
                <StatCards stats={stats} isLoading={loading} />

                {/* Scheduled Interviews Table */}
                <InterviewTable interviews={scheduledInterviews} isLoading={loading} />

                {/* Completed Interviews Table */}
                <CompletedInterviewsTable interviews={completedInterviews} isLoading={loading} />

                {/* Schedule Interview Modal */}
                <ScheduleInterviewModal
                    isOpen={showScheduleModal}
                    onClose={() => setShowScheduleModal(false)}
                />
            </div>
        </Layout>

    );
};

export default Dashboard;
