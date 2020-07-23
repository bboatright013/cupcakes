"""Flask app for Cupcakes"""
from flask import Flask, render_template, request, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

from flask_debugtoolbar import DebugToolbarExtension
app.config['SECRET_KEY'] = "SECRET!"
debug = DebugToolbarExtension(app)

db.create_all()


def serialize_my_cupcake(cake):
    """Serialize a cupcake SQLAlchemy obj to dictionary."""

    return {
        "id": cake.id,
        "flavor": cake.flavor,
        "size": cake.size,
        "rating": cake.rating,
        "image": cake.image,
    }

@app.route('/')
def home_page():
    return render_template('home_page.html')


@app.route('/api/cupcakes')
def list_cupcakes():
    """returns json of cupcakes in db"""
    cupcakes = Cupcake.query.order_by(Cupcake.id.desc()).all()
    serialized = [serialize_my_cupcake(cupcake) for cupcake in cupcakes]

    return jsonify(cupcakes=serialized)

@app.route('/api/cupcakes/<int:cupcake_id>')
def get_cupcake(cupcake_id):
    """returns json of particular cupcake in db"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = serialize_my_cupcake(cupcake)

    return jsonify(cupcake=serialized)   

@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    """create a cupcake object that returns json of newly added creamy delight"""
    print(request.json)
    new_cupcake = Cupcake(flavor=request.json['$flavor'], size=request.json["$size"], rating=request.json["$rating"], image=request.json["$image"])
    db.session.add(new_cupcake)
    db.session.commit()
    serialized = serialize_my_cupcake(new_cupcake)
    print(jsonify(serialized))
    return (jsonify(cupcake=serialized), 201 )

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    """update a cupcake object that returns json of updated creamy delight"""
    fix_cake = Cupcake.query.get_or_404(cupcake_id)
    fix_cake.flavor=request.json.get("flavor", fix_cake.flavor)
    fix_cake.size=request.json.get("size", fix_cake.size)
    fix_cake.rating=request.json.get("rating", fix_cake.rating)
    fix_cake.image=request.json.get("image", fix_cake.image)
    # db.session.query(fix_cake).filter_by(id=id).update(request.json)
    db.session.commit()
    serialized = serialize_my_cupcake(fix_cake)

    return (jsonify(cupcake=serialized), 200 )

@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    """delete a cupcake object that returns json message of deleted"""
    delete_cake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(delete_cake)
    db.session.commit()
    msg = { "message" : "Deleted"}

    return jsonify(msg=msg)