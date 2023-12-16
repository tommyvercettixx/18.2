from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

client_app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client_app'))

if not os.path.exists('images'):
    os.makedirs('images')

@app.route("/posts")
def get_posts():
    with open("data.json", "r") as f:
        return json.load(f)
    
@app.route("/posts/create", methods=['POST'])
def create_post():
    try:
        file = request.files.get('file')
        title = request.form.get('title', '')
        content = request.form.get('content', '')

        filename = None
        if file:
            filename = os.path.join(client_app_path, 'images', file.filename)
            file.save(filename)

        post_info = {
            'filename': f"images/{file.filename}",
            'title': title,
            'content': content
        }

        existing_data = []
        if os.path.exists('data.json'):
            with open('data.json', 'r') as file:
                existing_data = json.load(file)

        existing_data.append(post_info)

        with open('data.json', 'w') as file:
            json.dump(existing_data, file, indent=2)

        response_data = {
            'message': 'Post created successfully',
            'filename': filename,
            'title': title,
            'content': content
        }

        return jsonify(response_data), 201
    
    except Exception as e:
        error_message: str(e)
        response_data = {'error': error_message}
        return jsonify(response_data), 500
    

if __name__ == "__main__":
    app.run(debug=True)