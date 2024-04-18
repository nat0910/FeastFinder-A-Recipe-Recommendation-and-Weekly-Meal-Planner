from app.extension import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import event

class User(db.Model):
    __table__ = "users"
    
    # Login Details of user
    user_id = db.Column(db.Integer,primaty_key=True)
    username = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128),nullable=False)

    # User Profile Details 
    age = db.Column(db.Integer,nullable=False)
    user_nutritional_cluster = db.Column(db.Integer, nullable=True)
    allergies = db.Column(db.String(255), nullable=True)
    preferred_cuisines = db.Column(db.String(255),nullable=True)
    preferred_cooking_time = db.Column(db.Integer,nullable=True)

    #User Nutrination Values
    calories = db.Column(db.Float, nullable=True)
    fat_content = db.Column(db.Float, nullable=True)
    saturated_fat_content = db.Column(db.Float, nullable=True)
    cholesterol_content = db.Column(db.Float, nullable=True)
    sodium_content = db.Column(db.Float, nullable=True)
    carbohydrate_content = db.Column(db.Float, nullable=True)
    fiber_content = db.Column(db.Float, nullable=True)
    sugar_content = db.Column(db.Float, nullable=True)
    protein_content = db.Column(db.Float, nullable=True)

    def set_password(self,password):
        self.password_hash = generate_password_hash(hash)
    
    def check_password(self,password):
        return check_password_hash(self.password_hash,password)
    
    def update_user_nutritional_cluster(self):
        self.user_nutritional_cluster = compute_cluster(self)
        db.session.commit()
    
    def __repr__(self) -> str:
        return f"Name of the user is {self.username}"


def compute_cluster(user):
    predicted_user_nutritional_cluster = 0
    return predicted_user_nutritional_cluster

def nutritional_value_listener(mapper,connection,target):
    state = db.inspect(target)

    fields_to_watch = ['calories', 'fat_content', 'saturated_fat_content', 'cholesterol_content', 
                    'sodium_content', 'carbohydrate_content', 'fiber_content', 'sugar_content', 
                    'protein_content']
    
    if any(state.attrs[field].history.has_changes() for field in fields_to_watch):
        target.update_user_nutritional_cluster()

event.listen(User, 'before_update', nutritional_value_listener)