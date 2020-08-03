const server_ip = process.env.REACT_APP_FLOWER_SERVER_IP || "localhost" || "192.168.178.28" || "0.0.0.0";
const base_url = "http://" + server_ip + ":8080/";

export function fetchFlows(filters="", then: (*) => mixed) { // TODO - remove if searchFlows works for App.js gives the same results
    var filter_object = {};

    /*if (hasValueByKey(filters, "text_filter"))
        filter_object["flow.data"] = filters["text_filter"];

    if (hasValueByKey(filters, "dst_ip") && hasValueByKey(filters, "dst_port")) {
        filter_object["dst_ip"] = filters["dst_ip"];
        filter_object["dst_port"] = filters["dst_port"];
    }
    if (hasValueByKey(filters, "from_time") && hasValueByKey(filters, "to_time")) {
        filter_object["from_time"] = filters["from_time"];
        filter_object["to_time"] = filters["to_time"];
    }
    if (hasValueByKey(filters, "starred"))
        filter_object["starred"] = filters["starred"];*/

    console.log("Fetching flows: ");
    console.log(filter_object);

    fetch(base_url + "query", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filter_object)
    })
        .then(response => {
            console.log("[*] RECEIVED: " + response);
            return response.json();
        })
        .then(responseJson => {
            then(responseJson);
        })
        .catch(error => {
            console.log("[***] WS ERROR");
            console.error(error);
        });
}

//////////////////////////// HERE

export function fetchCpuUsage(host: string, then: (*) => mixed) {
    var url = base_url + "get" + host + "CpuUsage";
    return fetchUrl(url, then);
}

export function fetchMemoryUsage(host: string, then: (*) => mixed) {
    var url = base_url + "get" + host + "Memory";
    return fetchUrl(url, then);
}

export function fetchConnectionsCount(host: string, then: (*) => mixed) {
    var url = base_url + "get" + host + "ConnectionsCount";
    return fetchUrl(url, then);
}

export function fetchLastUpdate(host: string, then: (*) => mixed) {
    var url = base_url + "getLast" + host + "UpdateTime";
    return fetchUrl(url, then);
}

export function fetchDiskSpace(host: string, then: (*) => mixed) {
    var url = base_url + "get" + host + "DiskSpace";
    return fetchUrl(url, then);
}

export function fetchApacheStatus(host: string, then: (*) => mixed) {
    var url = base_url + "get" + host + "ApacheStatus";
    return fetchUrl(url, then);
}


export function searchFlows(searchString, filters="", then: (*) => mixed) {
    var filter_object = {};

    if (searchString)
        filter_object["flow.data"] = searchString;

    if (hasValueByKey(filters, "service"))
        filter_object["service"] = filters["service"];

    if (hasValueByKey(filters, "limit"))
        filter_object["limit"] = filters["limit"];

    if (hasValueByKey(filters, "older"))
        filter_object["older"] = filters["older"];

    if (hasValueByKey(filters, "nearId"))
        filter_object["near"] = filters["nearId"];

    if (hasValueByKey(filters, "attacks"))
        filter_object["attacks"] = filters["attacks"]; //init filters in searchbar to not have the dictionary empty when opening the app
        

    /*if (hasValueByKey(filters, "dst_ip") && hasValueByKey(filters, "dst_port")) {
        filter_object["dst_ip"] = filters["dst_ip"];
        filter_object["dst_port"] = filters["dst_port"];
    }
    if (hasValueByKey(filters, "from_time") && hasValueByKey(filters, "to_time")) {
        filter_object["from_time"] = filters["from_time"];
        filter_object["to_time"] = filters["to_time"];
    }
    if (hasValueByKey(filters, "starred"))
        filter_object["starred"] = filters["starred"];*/

    console.log("Fetching flows: ");
    console.log(filter_object);

    fetch(base_url + "query", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filter_object)
    })
        .then(response => {
            console.log("[*] RECEIVED: " + response);
            return response.json();
        })
        .then(responseJson => {
            then(responseJson);
        })
        .catch(error => {
            console.log("[***] WS ERROR");
            console.error(error);
        });
}

export function fetchNearFlows(nearId, then: (*) => mixed) {
    var filter_object = {}
    if (nearId)
        filter_object["near"] = nearId;
    else
        console.error("Cannot fetch nearby flows, no nearId provided")

    console.log("Fetching flows: ");
    console.log(filter_object);

    fetch(base_url + "query", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filter_object)
    })
        .then(response => {
            console.log("[*] RECEIVED: " + response);
            return response.json();
        })
        .then(responseJson => {
            then(responseJson);
        })
        .catch(error => {
            console.log("[***] WS ERROR");
            console.error(error);
        });
}

function hasValueByKey(object, key) {
    return object && key in object; //&& object[key];
}

export function fetchFlow(flow_id: string, then: (*) => mixed) {
    var url = base_url + "flow/" + flow_id;
    return fetchUrl(url, then);
}

export function hasFlag(flow_id: string, then: (*) => mixed) {
    var url = base_url + "flow/hasflag/" + flow_id;
    return fetchUrl(url, then);
}

export function fetchServiceByPort(port: string, then: (*) => mixed) {
    var url = base_url + "service/" + port;
    return fetchUrl(url, then);
}

export function fetchServices(then: (*) => mixed) {
    return fetchUrl(base_url + "services", data => then(data.sort()));
}

export function fetchPyCode(uid: string, then: (*) => mixed) {
    var url = base_url + "to_pwn/" + uid;
    return fetchUrl(url, then);
}

export function fetchReqCode(uid: string, then: (*) => mixed) {
    var url = base_url + "to_python_request/" + uid;
    return fetchUrl(url, then);
}

export function fetchSetStar(uid: string, star: Boolean, then: (*) => mixed) {
    var star = star ? "1" : "0";
    var url = base_url + "star/" + uid + "/" + star;
    return fetchUrl(url, then);
}

export function fetchStarred(then: (*) => mixed) {
    var url = base_url + "starred";
    return fetchUrl(url, then);
}

function fetchUrl(url, then) {
    return fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            then(responseJson);
        })
        .catch(error => {
            console.log("[***] WS ERROR");
            console.error(error);
        });
}