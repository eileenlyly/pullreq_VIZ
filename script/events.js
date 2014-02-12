
function node_onMouseOver(d,type) {
    if (type=="PULL") {
        if(d.depth < 2) return;
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        header1.text("Pull Requested by");
        header.text(d.UNM);
        header2.text("Total Commits: " + Number(d.CMT));
        toolTip.style("right",  "100px")
            .style("top", 200 + "px")
            .style("height","80px");

        highlightLinks(d,true);
    }
    else if (type=="CMT") {

        /*
        Highlight chord stroke
         */
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        header1.text(userByID[d.UID].UNM);
        header.text(Number(d.CMT_AMT) + "  commit");
        header2.text("on " + d.Month + "/" + d.Day + "/" + d.Year);
        toolTip.style("right", "100px")
            .style("top", 200 + "px")
            .style("height","100px");
        highlightLink(d,true);
    }
    else if (type=="USER") {
        /*
        highlight all commits and all pulls
         */
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        header1.text("User");
        header.text(userByID[d.label].UNM);
        header2.text("Total Commits: " + userByID[d.label].CMT);
        toolTip.style("right", "100px")
            .style("top", 200 + "px")
            .style("height","110px");
        highlightLinks(chordsById[d.label],true);
    }
}

function node_onMouseOut(d,type) {
    if (type=="PULL") {
        highlightLinks(d,false);
    }
    else if (type=="CMT") {
        highlightLink(d,false);
    }
    else if (type=="USER") {
        highlightLinks(chordsById[d.label],false);
    }


    toolTip.transition()									// declare the transition properties to fade-out the div
        .duration(500)									// it shall take 500ms
        .style("opacity", "0");							// and go all the way to an opacity of nil

}

function highlightLink(g,on) {

    var opacity=((on==true) ? 1 : .1);

      // console.log("fadeHandler(" + opacity + ")");
      // highlightSvg.style("opacity",opacity);

       var link=d3.select(document.getElementById("l_" + g.Key));
        link.transition((on==true) ? 150:550)
            .style("fill-opacity",opacity)
            .style("stroke-opacity",opacity);

        var arc=d3.select(document.getElementById("a_" + g.Key));
        arc.transition().style("fill-opacity",(on==true) ? opacity :.2);

        var circ=d3.select(document.getElementById("c_" + g.PQID));
        circ.transition((on==true) ? 150:550)
        .style("opacity",((on==true) ?1 :0));
        //.style("fill",((on==true) ? "#A8A8A8" : "#777"));

        var text=d3.select(document.getElementById("t_" + g.UID));
         text.transition((on==true) ? 0:550)
             .style("fill",(on==true) ? "#000" : "#777")
             .style("font-size",(on==true) ? "12px" : "8px")
             .style("stroke-width",((on==true) ? 3 : 0));


}

function highlightLinks(d,on) {

    d.relatedLinks.forEach(function (d) {
        highlightLink(d,on);
    })

}
