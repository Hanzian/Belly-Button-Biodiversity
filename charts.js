function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildChart function.
function buildCharts(sample) {
  // 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 5. Create a variable that holds the first sample in the array
    var sampResult = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = sampResult.otu_ids;
    var otuLabels = sampResult.otu_labels;
    var sampleValues = sampResult.sample_values;

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    // Deliverable 3: 3. Create a variable that holds the washing frequency.


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuId.slice(0,10).map(id => "OTU" + id).reverse();


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }

    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        width: 470,
        height: 386,
        title: "Top 10 Bacteria Cultures Found"      
      };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble Charts

    //1. Create the trace for the bubble chart.
    var bubbleData = [{
      y: sampleValues,
      x: otuId,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuId,
        size: sampleValues,
        colorscale: 'Earth'
      }
    }]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = { 
      width: 1150, 
      height: 450, 
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"}
    }; 
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // GAUGE CHART
    
    var metadata = data.metadata
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //  Create a variable that holds the washing frequency.
    var washFreq = result.wfreq;
    
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: {color: 'black'},
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: 'red' },
            { range: [2, 4], color: 'orange' },
            { range: [4, 6], color: 'yellow' },
            { range: [6, 8], color: 'lightgreen' },
            { range: [8, 10], color: 'darkgreen' },            
          ]
        
        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 470, height: 386, margin: { t: 0, b: 0, l:0, r:1}  
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
};
