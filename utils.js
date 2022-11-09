function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function formatCurrentDate() {
    const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July",
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ];
    const date = new Date();
    const formatDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    return formatDate;
}