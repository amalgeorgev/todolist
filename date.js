// Code to find date (reusable code -creating our own module to reuse if needed)

module.exports.getDate = getDate;  //the value/function assigned to 'module.exports.getDate' (here getData is name we assigned) will be retrieved when the 'require'd file(code) is called in another file(app.js)

function getDate() {
    
    let today = new Date();
    let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
    };

    return today.toLocaleDateString("en-US", options);
}


//Another way to define a function and export it using module.exports

exports.getDay = function () {  // directly assigning an anonymous function , exports is short for module.exports
    
    let today = new Date();
    let options = {
    weekday: "long"
    };

    return today.toLocaleDateString("en-US", options);
}