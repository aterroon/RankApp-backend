


function formatDateForSQL(dateString) {
    
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }

    // Formato DATE: YYYY-MM-DD
    return date.toISOString().split('T')[0];
}


module.exports = {
    formatDateForSQL
};