
function updateLinks(links) {

    linkGroup=linksSvg.selectAll("g.links")
        .data(links, function (d,i) {
            return d.Key;
        });

 //   linkGroup.selectAll("g.links").transition(500).style("opacity",1);

    var enter=linkGroup.enter().append("g").attr("class","links");
    var update=linkGroup.transition();


   /*  ARC SEGMENTS */
    enter.append("g")
        .attr("class", "arc")
        .append("path")
        .attr("id",function (d) { return "a_" + d.Key;})
        .style("fill", function(d) { return (d.CAT=="DEM") ? demColor : (d.CAT=="REP") ? repColor : otherColor; })
        .style("fill-opacity",.2)
        .attr("d", function (d,i) {
            var newArc={};
            var relatedChord=chordsById[d.UID];
            newArc.startAngle=relatedChord.currentAngle;
            relatedChord.currentAngle=relatedChord.currentAngle+(Number(d.CMT_AMT)/relatedChord.value)*(relatedChord.endAngle-relatedChord.startAngle);
            newArc.endAngle=relatedChord.currentAngle;
            newArc.value= Number(d.CMT_AMT);
            var arc=d3.svg.arc(d,i).innerRadius(linkRadius).outerRadius(innerRadius);
            userCommits+=newArc.value;
            total.text(userCommits + " commits");

            return arc(newArc,i);
        })
        .on("mouseover", function (d) { node_onMouseOver(d,"CMT");})
        .on("mouseout", function (d) {node_onMouseOut(d,"CMT"); });

    /* LINKS */
     enter.append("path")
        .attr("class","link")
        .attr("id",function (d) { return "l_" + d.Key;})
        .attr("d", function (d,i) {
              d.links=createLinks(d);
              var diag = diagonal(d.links[0],i);
              diag += "L" + String(diagonal(d.links[1],i)).substr(1);
              diag += "A" + (linkRadius) + "," + (linkRadius) + " 0 0,0 " +  d.links[0].source.x + "," + d.links[0].source.y;

              return diag;
        })
        .style("stroke",function(d) { return (d.CAT=="DEM") ? demColor : (d.CAT=="REP") ? repColor : otherColor; })
        .style("stroke-opacity",.07)
       // .style("stroke-width",function (d) { return d.links[0].strokeWeight;})
        .style("fill-opacity",0.1)
        .style("fill",function(d) { return (d.CAT=="DEM") ? demColor : (d.CAT=="REP") ? repColor : otherColor; })
        .on("mouseover", function (d) { node_onMouseOver(d,"CMT");})
        .on("mouseout", function (d) {node_onMouseOut(d,"CMT"); });


        /* NODES */
     enter.append("g")
        .attr("class","node")
        .append("circle")
        .style("fill",function(d) { return (d.CAT=="DEM") ? demColor : (d.CAT=="REP") ? repColor : otherColor; })
        .style("fill-opacity",0.2)
        .style("stroke-opacity",1)
        .attr("r", function (d) {
            var relatedNode=nodesById[d.PQID];
            //Decrement Related Node
            relatedNode.currentCMT=relatedNode.currentCMT-Number(d.CMT_AMT);
            var ratio=((relatedNode.CMT-relatedNode.currentCMT)/relatedNode.CMT);
            return relatedNode.r*ratio;
        })
        .attr("transform", function (d,i) {
            return "translate(" + (d.links[0].target.x) + "," + (d.links[0].target.y) + ")";
        })


      linkGroup.exit().remove();


    function createLinks(d) {
        var target={};
        var source={};
        var link={};
        var link2={};
        var source2={};

        var relatedChord=chordsById[d.UID];
        var relatedNode=nodesById[d.PQID];
        var r=linkRadius;
        var currX=(r * Math.cos(relatedChord.currentLinkAngle-1.57079633));
        var currY=(r * Math.sin(relatedChord.currentLinkAngle-1.57079633));

        var a=relatedChord.currentLinkAngle-1.57079633; //-90 degrees
        relatedChord.currentLinkAngle=relatedChord.currentLinkAngle+(Number(d.CMT_AMT)/relatedChord.value)*(relatedChord.endAngle-relatedChord.startAngle);
        var a1=relatedChord.currentLinkAngle-1.57079633;

        source.x=(r * Math.cos(a));
        source.y=(r * Math.sin(a));
        target.x=relatedNode.x-(chordsTranslate-nodesTranslate);
        target.y=relatedNode.y-(chordsTranslate-nodesTranslate);
        source2.x=(r * Math.cos(a1));
        source2.y=(r * Math.sin(a1));
        link.source=source;
        link.target=target;
        link2.source=target;
        link2.target=source2;

        return [link,link2];

    }


 //   console.log("updateLinks()");


}

function updateNodes() {

    var node = nodesSvg.selectAll("g.node")
        .data(pulls, function (d,i) {
            return d.PQID;
        });


    var enter=node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    enter.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill-opacity", function (d) { return (d.depth < 2) ? 0 : 0.05})
        .style("stroke",function(d) {
            return ((d.CAT=='DEM') ? demColor : repColor);
        })
        .style("stroke-opacity", function (d) { return (d.depth < 2) ? 0 : 0.2})
        .style("fill", function(d) {
            return ((d.CAT=='DEM') ? demColor : repColor);
        });



    var g=enter.append("g")
        .attr("id", function(d) { return "c_" + d.PQID; })
        .style("opacity",0);

        g.append("circle")
        .attr("r", function(d) { return d.r+2; })
        .style("fill-opacity", 0)
        .style("stroke", "#FFF")
        .style("stroke-width",2.5)
        .style("stroke-opacity",.7);

        g.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill-opacity", 0)
        .style("stroke", "#FFFF66")
        .style("stroke-width",3)
        .style("stroke-opacity",1)
        .on("mouseover", function (d) { node_onMouseOver(d,"PULL"); })
        .on("mouseout", function (d) {node_onMouseOut(d,"PULL"); });


    node.exit().remove().transition(500).style("opacity",0);


    log("updateBubble()");
}

function updateChords() {


    var arcGroup = chordsSvg.selectAll("g.arc")
        .data(chords, function (d) {
            return d.label;
        });

    var enter =arcGroup.enter().append("g").attr("class","arc");

    enter.append("text")
        .attr("class","chord")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return trimLabel(userByID[d.label].UNM); })
        .on("mouseover", function (d) { node_onMouseOver(d,"USER");})
        .on("mouseout", function (d) {node_onMouseOut(d,"USER"); });

    arcGroup.transition()
        .select("text")
        .attr("id",function (d) { return "t_"+ d.label;})
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .style("fill", "#777")
        .text(function(d) { return trimLabel(userByID[d.label].UNM); });



     enter.append("path")
        .style("fill-opacity",0)
        .style("stroke", "#555")
        .style("stroke-opacity",0.4)
        .attr("d", function (d,i) {
                var arc=d3.svg.arc(d,i).innerRadius(innerRadius-20).outerRadius(innerRadius);
                return arc(d.source,i);
            });

    arcGroup.transition()
        .select("path")
        .attr("d", function (d,i) {
            var arc=d3.svg.arc(d,i).innerRadius(innerRadius-20).outerRadius(innerRadius);
            return arc(d.source,i);
        });


    arcGroup.exit().remove();

    log("updateChords()");
}

function trimLabel(label) {
    if (label.length > 25) {
        return String(label).substr(0,25) + "...";
    }
    else {
        return label;
    }
}

function getChordColor(i) {
    var country=nameByIndex[i];
    if (colorByName[country]==undefined) {
        colorByName[country]=fills(i);
    }

    return colorByName[country];
}


