from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(120))
    street = db.Column(db.String(120))
    city = db.Column(db.String(120))
    state = db.Column(db.String(120))  # changed from suite
    zipcode = db.Column(db.String(20))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "company": {"name": self.company},
            "address": {
                "street": self.street,
                "city": self.city,
                "state": self.state,
                "zipcode": self.zipcode
            }
        }

with app.app_context():
    db.create_all()

# Helper to get trimmed string or None
def get_trimmed_str(d, key):
    val = d.get(key)
    if isinstance(val, str):
        val = val.strip()
        return val if val else None
    return None

@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.json

    name = get_trimmed_str(data, 'name')
    email = get_trimmed_str(data, 'email')
    phone = get_trimmed_str(data, 'phone')

    company = ''
    if isinstance(data.get('company'), dict):
        company = get_trimmed_str(data['company'], 'name') or ''

    address = data.get('address', {}) if isinstance(data.get('address'), dict) else {}
    street = get_trimmed_str(address, 'street') or ''
    city = get_trimmed_str(address, 'city') or ''
    state = get_trimmed_str(address, 'state') or ''
    zipcode = get_trimmed_str(address, 'zipcode') or ''

    if not name:
        return jsonify({"error": "Name is required and must be a non-empty string"}), 400
    if not email:
        return jsonify({"error": "Email is required and must be a non-empty string"}), 400
    if not phone:
        return jsonify({"error": "Phone is required and must be a non-empty string"}), 400

    new_user = User(
        name=name,
        email=email,
        phone=phone,
        company=company,
        street=street,
        city=city,
        state=state,
        zipcode=zipcode
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json

    name = get_trimmed_str(data, 'name')
    email = get_trimmed_str(data, 'email')
    phone = get_trimmed_str(data, 'phone')

    company = ''
    if isinstance(data.get('company'), dict):
        company = get_trimmed_str(data['company'], 'name') or ''

    address = data.get('address', {}) if isinstance(data.get('address'), dict) else {}
    street = get_trimmed_str(address, 'street') or ''
    city = get_trimmed_str(address, 'city') or ''
    state = get_trimmed_str(address, 'state') or ''
    zipcode = get_trimmed_str(address, 'zipcode') or ''

    if not name:
        return jsonify({"error": "Name is required and must be a non-empty string"}), 400
    if not email:
        return jsonify({"error": "Email is required and must be a non-empty string"}), 400
    if not phone:
        return jsonify({"error": "Phone is required and must be a non-empty string"}), 400

    user.name = name
    user.email = email
    user.phone = phone
    user.company = company
    user.street = street
    user.city = city
    user.state = state
    user.zipcode = zipcode

    db.session.commit()
    return jsonify(user.to_dict())

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user_id} deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5555)
