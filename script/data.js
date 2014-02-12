
// var dataDispatch=d3.dispatch("end");
var dataCalls=[];
var numCalls=0;

function fetchData() {
    dataCalls=[];
    addStream("data/pullreqs.csv", onFetchPullreqs);
    addStream("data/commits.csv", onFetchCommits);
    addStream("data/users.csv", onFetchUsers);
    startFetch();
}


function onFetchPullreqs(csv) {
    for (var i=0; i < csv.length; i++) {
        var r=csv[i];
        r.value=Number(r.CMT);
        cns[r.PQID]=r;
        pullreqs.push(r);
        if(r.CAT=="REP")
            total_ins+= r.value;
        else
            total_outs+= r.value;
    }
    log("onFetchPullreqs()");
    endFetch();
}

function onFetchCommits(csv) {
    var i=0;
    csv.forEach(function (d) {
        d.Key="H"+(i++);
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
