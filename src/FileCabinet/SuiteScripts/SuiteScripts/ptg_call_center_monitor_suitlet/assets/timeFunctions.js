
function getRestTime(datetime, type = "1") { 
    let hours = Math.abs(new Date().getTime() - datetime.getTime()) / 3600000,
        days = 0;

    if(type == "1") {
        if(hours >= 24) {
            days = Math.floor(hours / 24);
            hours = hours - (days * 24);
        }
    
        return (days > 0 ? days + (days > 1 ? ' días con ' : ' día con ') : '') + this.getTimeFromDecimal(hours);
    } else {
        return hours;
    }    
}

function dateFormatFromDate(date, format = "1") {
    if (typeof date == "string") {
        let aux = date;
        if(aux.split("-").length > 1) {
            date = new Date(parseInt(aux.split("-")[0]), parseInt(aux.split("-")[1]) - 1, parseInt(aux.split("-")[2]));
        } else {
            date = new Date(parseInt(aux.split("/")[2]), parseInt(aux.split("/")[1]) - 1, parseInt(aux.split("/")[0]));
        }                
    }

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let fecha = "";
    let months = ["Enero", "Febrero", "Marzo", "Abrrl", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    if (format == "1") {
        fecha = day + " de " + months[month] + " - " + timeFormatFromDate(date);
    } else if (format == "2") {
        if (day < 10) {
            day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
            month = "0" + month;
        }
        fecha = year + "-" + month + "-" + day;
    } else if (format == "3") {
        fecha = day + "/" + month + "/" + year + " " + timeFormatFromDate(date);
    } else if (format == "4") {
        if (day < 10) {
            day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
            month = "0" + month;
        }
        fecha = year + "-" + month + "-" + day + "T" + timeFormatFromDate(date, "2");
    } else if (format == "5") {
        if (day < 10) {
            day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
            month = "0" + month;
        }
        fecha = day + "/" + month + "/" + year;
    } else if (format == "6") {
        if (day < 10) {
            day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
            month = "0" + month;
        }
        fecha = day + "-" + month + "-" + year;
    } else if (format == "7") {
        if (day < 10) {
            day = "0" + day;
        }
        month = month + 1;
        if (month < 10) {
            month = "0" + month;
        }
        fecha = day + "/" + month + "/" + year + " " + timeFormatFromDate(date);;
    }

    return fecha;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
        * and you may want to customize it to your needs
        */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function getTimeFromDecimal(decimalTimeString) {
    var decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    var hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    var minutes = Math.floor((decimalTime / 60));
    decimalTime = decimalTime - (minutes * 60);


    let auxHour = "";
    auxHour += hours > 0 ? hours > 1 ? hours + ' horas' : ' hora' : '';

    if(minutes > 0) {
        if(auxHour != "") {
            auxHour += " y ";
        }
        auxHour += minutes > 0 ? minutes > 1 ? minutes + ' minutos' : minutes+' minuto' : '';
    }    
    return auxHour ? auxHour : '0 minutos';
}

function dateFormatFromString(datetime, format = "1") {
    if (format == "1") {
        let date = datetime.split(" ")[0].split("-");
        let time = [0, 0, 0]
        if (datetime.split(" ").length > 1) {
            time = datetime.split(" ")[1].split(":");
            if (datetime.split(" ")[2] == "PM") {
                time[0] = parseInt(time[0]) + 12;
            }
        }
        
        return new Date(date[0], parseInt(date[1]) - 1, date[2], time[0], time[1]);
    } else if (format == "2") {
        let date = datetime.split(" ")[0].split("/");
        let time = [0, 0];
        if (datetime.split(" ").length > 1) {
            time = datetime.split(" ")[1].split(":");
            if (datetime.split(" ")[2] == "PM") {
                time[0] = parseInt(time[0]) + 12;
            }
        }
        return new Date(date[2], parseInt(date[1]) - 1, date[0], time[0], time[1]);
    }
}

function getTimeFromString(time) {
    let aux = time.split(" "),
    aux2 = aux[0].split(":");

    if (aux[1] && (aux[1].toLowerCase() == "pm" || aux[1].toLowerCase() == "p.m")) {
        aux2[0] = parseInt(aux2[0]) + 12;
    }

    return aux2[0].toString() + ":" + aux2[1];

}

function timeFormatFromDate(date, format = "1") {
    date = new Date(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let period = hours < 12 ? 'a.m.' : 'p.m.';
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    let hora = "";
    if (format == "1") {
        hours = (hours + 24) % 12 || 12;
        if (hours < 10) {
            hours = "0" + hours;
        }

        hora = hours + ":" + minutes + " " + period;
    } else if (format == "2") {
        if (hours < 10) {
            hours = "0" + hours;
        }

        hora = hours + ":" + minutes;
    } else if (format == "3") {
        if (hours < 10) {
            hours = "0" + hours;
        }

        hora = hours + ":" + minutes + ":" + seconds;
    }
    return hora;
}

function removeDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}


function getToday() {
    let $this = this;
    $("#today").html(dateFormatFromDate(new Date(), "7"));
    setTimeout(function () {
        $this.getToday();
    }, 1000);
}