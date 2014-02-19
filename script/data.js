
// var dataDispatch=d3.dispatch("end");
var dataCalls=[];
var numCalls=0;

function fetchData() {
    dataCalls=[];
    var pj = "data/akka";
    addStream(pj+"/pullreqs.csv", onFetchPullreqs);
    addStream(pj+"/commits.csv", onFetchCommits);
    addStream(pj+"/users.csv", onFetchUsers);
    startFetch();
}


function onFetchPullreqs(csv) {
    for (var i=0; i < csv.length; i++) {
        var r=csv[i];
        r.value=Number(r.CMT);
        cns[r.PQID]=r;
        pullreqs.push(r);
        if(r.CAT=="O")
            total_outs+= r.value;
        else
            total_ins+= r.value;
    }
    log("onFetchPullreqs()");
    endFetch();
}

function onFetchCommits(csv) {
    var i=0;
    csv.forEach(function (d) {
        d.Key=i++;
        commits.push(d);
    });

    log("onFetchCommits()");
    endFetch();

}

function onFetchUsers(csv) {

    users=csv;
    for (var i=0; i < users.length; i++) {
        userByID[users[i].UID]=users[i];
    }

    log("onFetchUser()");
    endFetch();

}

function addStream(file,func) {
    var o={};
    o.file=file;
    o.function=func;
    dataCalls.push(o);
}

function startFetch() {
    numCalls=dataCalls.length;
    dataCalls.forEach(function (d) {
        d3.csv(d.file, d.function);
    })
}

function endFetch() {
    numCalls--;
    if (numCalls==0) {
       // dataDispatch.end();
        main();
    }
}
