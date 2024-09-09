from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from transformers import BertTokenizer, BertModel
from io import BytesIO

app = Flask(__name__)
CORS(app)

vectorized_data = None
uploaded_filename = ""

@app.route('/')
def index():
    return "Vectorizer Backend is running"

@app.route('/upload', methods=['POST'])
def upload_file():
    global uploaded_filename
    file = request.files['file']
    uploaded_filename = file.filename  # Store the uploaded file name
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    elif file.filename.endswith('.parquet'):
        df = pd.read_parquet(file)
    else:
        return jsonify({'error': 'Unsupported file format'}), 400
    return jsonify({'columns': df.columns.tolist()})

@app.route('/vectorize', methods=['POST'])
def vectorize():
    global vectorized_data
    data = request.json
    column = data['column']
    df = pd.DataFrame(data['data'])
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')

    inputs = tokenizer(df[column].tolist(), return_tensors='pt', padding=True, truncation=True)
    outputs = model(**inputs)
    vectors = outputs.last_hidden_state.mean(dim=1).tolist()

    # Add the vectorized column to the DataFrame
    df['vectorized'] = vectors
    vectorized_data = df

    # print(f"Vectorized data stored with shape: {vectorized_data.shape}")
    # print(f"Columns: {vectorized_data.columns.tolist()}")

    return jsonify({'vectors': vectors})

@app.route('/download', methods=['GET'])
def download():
    global vectorized_data, uploaded_filename
    if vectorized_data is None:
        print("No vectorized data available")  # if there is missing data
        return jsonify({'error': 'No vectorized data available'}), 400

    csv_buffer = BytesIO()
    vectorized_data.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)

    # Generate the filename -- not working
    download_filename = f"vectorized_{uploaded_filename}"

    return send_file(
        csv_buffer,
        mimetype="text/csv",
        as_attachment=True,
        download_name=download_filename
    )

if __name__ == '__main__':
    app.run(debug=True, port=5001)
