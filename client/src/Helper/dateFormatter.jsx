const formatDateToRelative = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();

    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInMs = today - inputDate;
    const diffInDays = diffInMs / (1000 * 3600 * 24);

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 30) return `${Math.floor(diffInDays)} days ago`;

    const diffInMonths = diffInDays / 30;
    if (diffInMonths < 12) {
        const months = Math.floor(diffInMonths);
        return months === 1 ? "a month ago" : `${months} months ago`;
    }

    const diffInYears = diffInMonths / 12;
    const years = Math.floor(diffInYears);
    return years === 1 ? "1 year ago" : `${years} years ago`;
};

export default formatDateToRelative