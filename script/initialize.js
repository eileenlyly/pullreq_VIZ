function initialize() {

    userCommits=0;
    renderLinks=[];
    pulls=[];
    contr=[];

        var root={};
        var r={};
        r.value=total_ins+total_outs;
        r.children=pullreqs;

        root.children=[r];
        root.CAT="root";

        nodes=bubble.nodes(root);

        var totalPullAmount=0;
        nodes.forEach (function (d) {
            if (d.depth==2) {
                nodesById[d.PQID]=d;
                d.relatedLinks=[];
                d.CMT=Number(d.CMT);
                d.currentCMT= d.CMT;
                pulls.push(d);
                totalPullAmount+= d.CMT;
            }
        })

        log("totalPullAmount=" + totalPullAmount);
        commits.forEach(function (d) {
            contr.push(d);
        });

    buildChords();

    var totalContr=0;
    contr.forEach(function (d) {
        nodesById[d.PQID].relatedLinks.push(d);
        chordsById[d.UID].relatedLinks.push(d);
        totalContr+= Number(d.CMT_AMT);
    })

    log("userCommits=" + totalContr);


    log("initialize()");

}
