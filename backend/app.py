from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import text
from werkzeug.utils import secure_filename
from bcrypt import hashpw, gensalt, checkpw
import os
import base64

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/artist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'mysecretkey'  # Change this to a secure random key in production

jwt = JWTManager(app)
db = SQLAlchemy(app)

class UserRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    type_of_user = db.Column(db.String(50))
    profile_picture = db.Column(db.LargeBinary, nullable=False)
    contact_no = db.Column(db.String(20))

class ArtImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user_registration.artist_id'), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    items_used = db.Column(db.String(255), nullable=True)
    price = db.Column(db.String(20), nullable=True)
    caption = db.Column(db.Text, nullable=True)
    featured = db.Column(db.Boolean, default=False)
    availability = db.Column(db.String(50), nullable=False)
    likes = db.relationship('Like', backref='art_image', lazy=True)
    comments = db.relationship('Comment', backref='art_image', lazy=True)


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_registration.artist_id'), nullable=False)
    art_image_id = db.Column(db.Integer, db.ForeignKey('art_image.id'), nullable=False)
    liked = db.Column(db.Boolean, default=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_registration.artist_id'), nullable=False)
    art_image_id = db.Column(db.Integer, db.ForeignKey('art_image.id'), nullable=False)
    comment = db.Column(db.Text, nullable=False)

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    art_id = db.Column(db.Integer, db.ForeignKey('art_image.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_registration.artist_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.DateTime, server_default=db.func.now())

    art = db.relationship('ArtImage', backref='purchases', lazy=True)
    artist = db.relationship('UserRegistration', backref='purchases', lazy=True)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_registration.artist_id'), nullable=True)
    art_id = db.Column(db.Integer, db.ForeignKey('art_image.id'), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=True)

def get_artists():
    query = text("SELECT id, email, name, password FROM artists")
    connection = db.engine.connect()
    result = connection.execute(query)
    artists = [dict(row._mapping) for row in result.fetchall()]
    result.close()
    connection.close()
    return artists

@app.route('/artists')
def artists():
    artists_data = get_artists()
    return jsonify(artists_data)

@app.route('/signup', methods=['POST'])
def signup():
    artist_id = request.form.get('artist_id')
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    type_of_user = request.form.get('type_of_user')
    email = request.form.get('email')
    password = request.form.get('password')
    profile_picture = request.files.get('profile_picture')
    contact_no = request.form.get('contact_no')
    username = request.form.get('username')




    if not (artist_id and first_name and last_name and type_of_user and email and password and profile_picture and contact_no):
        return jsonify({'message': 'Missing required fields'}), 400

    hashed_password = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

    if profile_picture:
        profile_picture_data = profile_picture.read()
        filename = secure_filename(profile_picture.filename)
        

    user = UserRegistration(artist_id=artist_id,username=username ,first_name=first_name, last_name=last_name, type_of_user=type_of_user,
                            email=email, password=hashed_password, profile_picture=profile_picture_data, contact_no=contact_no)

    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    artist_id = data.get('artist_id')
    password = data.get('password')

    if not artist_id or not password:
        return jsonify({'message': 'Missing artist ID or password'}), 400

    user = UserRegistration.query.filter_by(artist_id=artist_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Now use the user identity directly to create the access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'artist_id': user.artist_id,
        'type_of_user': user.type_of_user
    }), 200


@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'message': 'No image part'}), 400

    file = request.files['image']
    artist_id = request.form.get('artist_id') # Get artist_id from the token's identity
    category = request.form.get('category')
    description = request.form.get('description')
    items_used = request.form.get('items_used')
    price = request.form.get('price')
    caption = request.form.get('caption')
    featured = request.form.get('featured') == 'true'
    availability = request.form.get('availability')

    if not category or not availability:
        return jsonify({'message': 'Missing required fields'}), 400

    image_data = file.read()

    art_image = ArtImage(
        artist_id=artist_id,
        image=image_data,
        category=category,
        description=description,
        items_used=items_used,
        price=price,
        caption=caption,
        featured=featured,
        availability=availability
    )

    try:
        db.session.add(art_image)
        db.session.commit()
        return jsonify({'message': 'Art image uploaded successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to upload art image', 'error': str(e)}), 500

@app.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = UserRegistration.query.all()
        users_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'artist_id': user.artist_id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'type_of_user': user.type_of_user,
                'profile_picture': base64.b64encode(user.profile_picture).decode('utf-8') if user.profile_picture else None,
                'contact_no': user.contact_no
            }
            users_list.append(user_data)
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve users', 'error': str(e)}), 500
        
@app.route('/arts', methods=['GET'])
def get_all_arts():
    try:
        arts = ArtImage.query.all()
        arts_list = []
        for art in arts:
            art_data = {
                'id': art.id,
                'artist_id': art.artist_id,
                'category': art.category,
                'description': art.description,
                'items_used': art.items_used,
                'price': art.price,
                'caption': art.caption,
                'featured': art.featured,
                'availability': art.availability,
                'image_data': base64.b64encode(art.image).decode('utf-8') if art.image else None
            }
            arts_list.append(art_data)
        return jsonify(arts_list), 200
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve art images', 'error': str(e)}), 500
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy



@app.route('/like', methods=['POST'])
def like_art():
    data = request.json
    user_id = data.get('user_id')
    art_image_id = data.get('art_image_id')

    if not user_id or not art_image_id:
        return jsonify({'message': 'Missing required fields'}), 400

    like = Like.query.filter_by(user_id=user_id, art_image_id=art_image_id).first()
    if like:
        # User already liked the art image, so unlike it
        db.session.delete(like)
        db.session.commit()
        return jsonify({'message': 'Art image unliked successfully'}), 200

    # User has not liked the art image, so add a new like
    new_like = Like(user_id=user_id, art_image_id=art_image_id, liked=True)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({'message': 'Art image liked successfully'}), 201




@app.route('/comment', methods=['POST'])
@jwt_required()
def comment_art_image():
    user_id = get_jwt_identity()
    art_image_id = request.json.get('art_image_id')
    comment_text = request.json.get('comment')

    if not (art_image_id and comment_text):
        return jsonify({'message': 'Missing art image ID or comment text'}), 400

    comment = Comment(user_id=user_id, art_image_id=art_image_id, comment=comment_text)

    try:
        db.session.add(comment)
        db.session.commit()
        return jsonify({'message': 'Comment added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to add comment', 'error': str(e)}), 500

@app.route('/purchase', methods=['POST'])
def purchase():
    data = request.json
    art_id = data.get('artId')
    user_id = data.get('userId')  # Corrected from artistId to userId
    quantity = data.get('quantity')
    price = data.get('price')

    if not (art_id and user_id and quantity and price):
        return jsonify({'message': 'Missing required fields'}), 400

    total_price = quantity * price

    # Assuming you have a Purchase model
    purchase = Purchase(
        art_id=art_id,
        user_id=user_id,  # Corrected from artist_id to user_id
        quantity=quantity,
        price=price,
        total_price=total_price
    )

    try:
        db.session.add(purchase)
        db.session.commit()
        return jsonify({'message': 'Purchase completed successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to complete the purchase', 'error': str(e)}), 500

@app.route('/feedback', methods=['POST'])
def post_feedback():
    data = request.json
    user_id = data.get('user_id')
    art_id = data.get('art_id')
    rating = data.get('rating')
    feedback = data.get('feedback')

    if not (art_id and rating):
        return jsonify({'message': 'Missing required fields'}), 400

    feedback_entry = Feedback(user_id=user_id, art_id=art_id, rating=rating, feedback=feedback)

    try:
        db.session.add(feedback_entry)
        db.session.commit()
        return jsonify({'message': 'Feedback submitted successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to submit feedback', 'error': str(e)}), 500



@app.route('/view-items', methods=['GET'])
def view_items():
    try:
        # Assuming you have Purchase and ArtImage models
        items = db.session.query(
            Purchase.id.label('purchase_id'),
            Purchase.art_id,
            ArtImage.artist_id,
            Purchase.user_id,
            ArtImage.caption,
            ArtImage.description,
            ArtImage.category,
            ArtImage.image,  # Assuming image is stored as bytea in the column 'image_data'
            Purchase.price,
            Purchase.total_price,
            Purchase.quantity,
            Feedback.rating,
            Feedback.feedback
        ).join(
            ArtImage, Purchase.art_id == ArtImage.id
        ).outerjoin(
            Feedback, Purchase.art_id == Feedback.art_id
        ).all()

        item_list = []
        for item in items:
            item_dict = {
                'purchase_id': item.purchase_id,
                'art_id': item.art_id,
                'artist_id': item.artist_id,
                'user_id': item.user_id,
                'caption': item.caption,
                'description': item.description,
                'category': item.category,
                'image': base64.b64encode(item.image).decode('utf-8'),  # Convert bytea to base64 string
                'price': item.price,
                'total_price': item.total_price,
                'quantity': item.quantity,
                'rating': item.rating,
                'feedback': item.feedback
            }
            item_list.append(item_dict)

        return jsonify({'items': item_list}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve items', 'error': str(e)}), 500

@app.route('/delete/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    try:
        art_image = ArtImage.query.get(image_id)
        if not art_image:
            return jsonify({'message': 'Art image not found'}), 404

        db.session.delete(art_image)
        db.session.commit()
        return jsonify({'message': 'Art image deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete art image', 'error': str(e)}), 500





@app.route('/arts/<int:id>', methods=['PUT'])
def update_art(id):
    try:
        art = ArtImage.query.get(id)
        if not art:
            return jsonify({'message': 'Art not found'}), 404

        data = request.json
        category = data.get('category')
        description = data.get('description')
        items_used = data.get('items_used')
        price = data.get('price')
        caption = data.get('caption')
        featured = data.get('featured', False)  # Default to False if not provided
        availability = data.get('availability')

        if not category or not availability:
            return jsonify({'message': 'Missing required fields'}), 400

        art.category = category
        art.description = description
        art.items_used = items_used
        art.price = price
        art.caption = caption
        art.featured = featured
        art.availability = availability

        if 'image' in request.files:
            file = request.files['image']
            art.image = file.read()

        db.session.commit()
        return jsonify({'message': 'Art updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update art', 'error': str(e)}), 500


@app.route('/likes', methods=['GET'])
def get_likes():
    art_image_id = request.args.get('art_image_id')
    if not art_image_id:
        return jsonify({'message': 'Missing art_image_id parameter'}), 400

    try:
        likes_count = Like.query.filter_by(art_image_id=art_image_id).count()
        return jsonify({'art_image_id': art_image_id, 'likes': likes_count}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch likes', 'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
