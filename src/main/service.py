import json

import flask
import csv
import os
import uuid

MAX_ITEMS_DISPLAY = 10000

app = flask.Flask(__name__,
                  static_url_path='/ui',
                  static_folder='resources')


@app.route('/upload_data', methods=['POST'])
def upload_data():
    session_id = str(uuid.uuid4())
    file = flask.request.files['file']
    if file.filename == '':
        flask.flash('No selected file')
        return None
    if file:
        file.save(os.path.join('/tmp', session_id))
    return json.dumps({'id': session_id})


def json_field_from_row(row, columns):
    field = {}
    if len(columns) != len(row):
        ## we will ignore invalid columns
        return None
    for i in range(0, len(columns)):
        field[columns[i]] = row[i]
    return field


def data_iter(id):
    data_sniff = open('/tmp/' + id, 'r').readline()
    sniffer = csv.Sniffer()
    sniff_delim = sniffer.sniff(data_sniff)
    delimiter = sniff_delim.delimiter
    rd = csv.reader(open('/tmp/' + id, 'r'), delimiter=delimiter)
    return rd


@app.route('/data/<id>', methods=['GET'])
def get_data(id):
    rd = data_iter(id)
    response_template = {
        "columns": None,
        "content": []
    }
    records_allowed = 0
    records_on_display = 0
    for row in rd:
        if not response_template["columns"]:
            response_template["columns"] = row
            if len(row) > 0:
                records_allowed = round(MAX_ITEMS_DISPLAY / len(row))
                print("Allow UI max records: " + str(records_allowed))
        else:
            if records_allowed > records_on_display:
                field = json_field_from_row(row, response_template["columns"])
                if field:
                    records_on_display = records_on_display + 1
                    response_template["content"].append(field)
    return json.dumps(response_template)


@app.route('/data/<id>/bedford', methods=['GET'])
def get_bedford_targets(id):
    rd = data_iter(id)
    viable_targets = None
    for row in rd:
        if not viable_targets:
            viable_targets = row
        elif any(viable_targets):
            for i in range(0, len(viable_targets)):
                if not is_valid_bf(row, i):
                    viable_targets[i] = None
        else:
            ## there is no available target here...
            return json.dumps([])

    return json.dumps([x for x in viable_targets if x is not None])


def is_valid_bf(row, index):
    try:
        if row and len(row) > index and not row[index].isnumeric():
            float(row[index])
            return True
    except Exception:
        return False

    return True


@app.route('/data/<id>/bedford/<target>', methods=['GET'])
def get_bedford(id, target):
    rd = data_iter(id)
    response_template = {
        "target": target,
        "data_size": 0,
        "digit_distribution": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    target_index = None
    for row in rd:
        if not target_index:
            target_index = row.index(target)
        elif len(row) > target_index:
            number = row[target_index]
            start_digit = int(str(number)[0])
            ## print(str(row) + " - start digit for " + str(number) + " is " + str(start_digit))
            response_template["data_size"] = response_template["data_size"] + 1
            response_template['digit_distribution'][start_digit] = response_template['digit_distribution'][
                                                                       start_digit] + 1

    return json.dumps(response_template)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
