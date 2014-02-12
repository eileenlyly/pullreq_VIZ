function initialize() {

    totalContributions=0;
    renderLinks=[];
    cands=[];
    pacs=[];
    contr=[];

        var root={};
        var d={};
        //d.value=total_hDems+total_hReps;
        //d.children=h_dems;

        var r={};
        r.value=total_hReps;
        r.children=h_reps;

        var o={};
        o.value=total_hOthers;
        o.children=h_others;

        root.children=[r];
        root.PTY="root";

        nodes=bubble.nodes(root);

        var totalCandAmount=0;
        nodes.forEach (function (d) {
            if (d.depth==2) {
                nodesById[d.CAND_ID]=d;
                d.relatedLinks=[];
                d.Amount=Number(d.Amount);
                d.currentAmount= d.Amount;
                cands.push(d);
                totalCandAmount+= d.Amount;
            }
        })

        log("totalCandAmount=" + totalCandAmount);
        pacs=pacsHouse;
        c_house.forEach(function (d) {
            contr.push(d);
        });

    buildChords();

    var totalContr=0;
    contr.forEach(function (d) {
        nodesById[d.CAND_ID].relatedLinks.push(d);
        chordsById[d.CMTE_ID].relatedLinks.push(d);
        totalContr+= Number(d.TRANSACTION_AMT);
    })

    log("totalContributions=" + totalContr);


    log("initialize()");

}
