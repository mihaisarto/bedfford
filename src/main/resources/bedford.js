var session_id = null;

$(document).ready(function () {
            $('#upload_btn').jqxFileUpload({ width: "100%", fileInputName: 'file', uploadUrl: '/upload_data' });
            $('#upload_btn').on('uploadEnd', function (event) {
                    var args = event.args;
                    resp = JSON.parse(args['response'])
                    session_id = resp['id']
                    populateTable(session_id);
                });

            $("#expander").jqxRibbon({ width: "100%", height: 200 });

        });


function populateTable(id) {
    $.getJSON("/data/" + id, function (data) {
        console.log(data)
        gridDataSource = {
            localdata: data.content,
            datatype: "json"
        };
        var gridColumns = []
        for (let i = 0; i <= data.columns.length-1; i++) {
                gridColumns.push({ text:data.columns[i],
                datafield:data.columns[i],
                });
        }

         var dataAdapter = new $.jqx.dataAdapter(gridDataSource, {
            downloadComplete: function (data, status, xhr) { },
            loadComplete: function (data) {
                 populateBedford();
            },
            loadError: function (xhr, status, error) { }
        });
        console.log(gridColumns)
         $("#jsGrid").jqxGrid({
            width: "100%",
            source: dataAdapter,
            pageable: true,
            autoheight: false,
            sortable: false,
            altrows: true,
            theme: 'classic',
            showcolumnlines: false,
            enabletooltips: true,
            pagesize: 50,
            pagesizeoptions: [50, 100, 200],
            editable: false,
            columnsautoresize: true,
            selectionmode: 'multiplecellsadvanced',
            columns:gridColumns
        });
    });
}

function bedford_match_str(bedford_data) {
    const distribution = bedford_data.digit_distribution
    const data_size = bedford_data.data_size
    for (let i = 1; i <= distribution.length-2; i++) {
        if (distribution[i] < distribution[i+1]) return "does NOT match";
    }
    return "does match";
}

function populateBedford() {

    $.getJSON("/data/" + session_id +"/bedford", function (data) {
        $("#bedfordFields").jqxDropDownList({
            placeHolder: "Select field to validate Benford’s assertion",
            width: '100%',
            source: data,
            disabled: false
        });
        $('#bedfordFields').on('change', function (event) {
            const selected = event.args.item.value;
            $.getJSON("/data/" + session_id +"/bedford/"+ selected, function (bedford_data) {
                console.log("Bedford selection for "+selected)
                console.log(bedford_data)

                var gridData = [
                //{ Digit: 1, Items: 0, Percent: 0},
                ];
                data_size = bedford_data.data_size
                for (let i = 1; i <= bedford_data.digit_distribution.length-1; i++) {
                    items = bedford_data.digit_distribution[i]
                    gridData.push({ Digit:i, Items:items,Percent:items*100/data_size });
                }
                title_str = "Field " + selected + " " + bedford_match_str(bedford_data) + " Benford’s law"

                var settings = {
                    description: "Benford’s data for "+selected,
                    title: title_str,
                    enableAnimations: true,
                    padding: { left: 5, top: 5, right: 5, bottom: 5 },
                    titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
                    source: gridData,
                    valueAxis: {
                        minValue: 0,
                        maxValue: bedford_data.data_size,
                        unitInterval: Math.round(bedford_data.data_size / 10),
                        title: {text: 'Records'}
                    },
                    xAxis:
                        {
                            dataField: 'Digit',
                            showGridLines: false
                        },
                    colorScheme: 'scheme02',
                    seriesGroups:
                    [
                        {
                            type: 'column',
                            columnsGapPercent: 30,
                            seriesGapPercent: 10,
                            series: [
                                    { dataField: 'Items', displayText: 'Items'}
                                ]
                        }
                    ]
                };
                $('#chartContainerItems').jqxChart(settings);
            });
        });
    });
}