
var maxWidth=screen.width-120;

var outerRadius = screen.height/2 - 100,
    innerRadius = outerRadius - 40,
    bubbleRadius=innerRadius - 150,
    linkRadius=innerRadius-20,
    nodesTranslate=(outerRadius-bubbleRadius) +50,
    chordsTranslate=outerRadius+50;

d3.select(document.getElementById("mainDiv"))
    .style("width",(maxWidth) + "px");
    //.style("height",(outerRadius*2 + 400) + "px");

d3.select(document.getElementById("bpg"))
    .style("width",(maxWidth) + "px");

var svg = d3.select(document.getElementById("svgDiv"))
    //.style("width", (outerRadius*2 + 200) + "px")
    //.style("height", (outerRadius*2 + 200) + "px")
    .append("svg")
    .attr("id","svg")
    .style("float", "left")
    .style("margin-left", "20px")
    .style("width", (outerRadius*2) + 100 + "px")
    .style("height", (outerRadius*2) + 100 + "px");



var chordsSvg=svg.append("g")
    .attr("class","chords")
    .attr("transform", "translate(" + chordsTranslate + "," + chordsTranslate + ")");


var linksSvg=svg.append("g")
    .attr("class","links")
    .attr("transform", "translate(" + chordsTranslate + "," + chordsTranslate + ")")


var highlightSvg=svg.append("g")
    .attr("transform", "translate(" + chordsTranslate + "," + chordsTranslate + ")")
    .style("opacity",0);

var highlightLink=highlightSvg.append("path");

var nodesSvg=svg.append("g")
    .attr("class","nodes")
    .attr("transform", "translate(" + nodesTranslate + "," + nodesTranslate + ")");


 var bubble = d3.layout.pack()
    .sort(null)
    .size([bubbleRadius*2, bubbleRadius*2])
    .padding(1.5);

var chord = d3.layout.chord()
    .padding(.05)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var diagonal = d3.svg.diagonal.radial();
    //.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });


var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 10);


var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var toolTip = d3.select(document.getElementById("toolTip"));
var header = d3.select(document.getElementById("head"));
var header1 = d3.select(document.getElementById("header1"));
var header2 = d3.select(document.getElementById("header2"));
var total = d3.select(document.getElementById("totalDiv"));
var repColor="#CC99FF";
var demColor="#33CC66";

var fills= d3.scale.ordinal().range(["#00AC6B","#20815D","#007046","#35D699","#60D6A9"]);

var linkGroup;

var cns=[],
    users=[],
    commits=[];
    pulls=[],
    contr=[],
    pullreqs=[],
    total_outs=0,
    total_ins=0,
    userByID={},
    chordsById={},
    nodesById={},
    chordCount=20,
    pText=null,
    pChords=null,
    nodes=[],
    renderLinks=[],
    colorByName={},
    userCommits=0,
    delay=2;

var buf_indexByName={},
    indexByName = {},
    nameByIndex = {},
    labels = [],
    chords = [];

function log(message) {
   // console.log(message);
}
//Events


