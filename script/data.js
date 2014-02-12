
// var dataDispatch=d3.dispatch("end");
var dataCalls=[];
var numCalls=0;

function fetchData() {
    dataCalls=[];
//    dataDispatch.on("end",onDataFetched)
    addStream("data/Candidates_House.csv", onFetchCandidatesHouse);
    addStream("data/Contributions_House.csv", onFetchContributionsHouse);
    addStream("data/users.csv", onFetchPacsHouse);
    startFetch();
}


function onFetchCandidatesHouse(csv) {
    for (var i=0; i < csv.length; i++) {
        var r=csv[i];
        r.value=Number(r.Amount);
        cns[r.CAND_ID]=r;
        house.push(r);
        if (1) {
            h_reps.push(r);
            total_hReps+= r.value;
        }
        //else if (r.PTY=="DEM") {
            h_dems.push(r)
            total_hDems+= r.value;
        //}
    }
    log("onFetchCandidatesHouse()");
    endFetch();
}

function onFetchContributionsHouse(csv) {
    var i=0;
    csv.forEach(function (d) {
        d.Key="H"+(i++);
        contributions.push(d);
        c_house.push(d);
    });

    log("onFetchContributionsHouse()");
    endFetch();

}

function onFetchPacsHouse(csv) {

    pacsHouse=csv;
    for (var i=0; i < pacsHouse.length; i++) {
        pacsById["house_" + pacsHouse[i].CMTE_ID]=pacsHouse[i];
    }

    log("onFetchPacsHouse()");
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
