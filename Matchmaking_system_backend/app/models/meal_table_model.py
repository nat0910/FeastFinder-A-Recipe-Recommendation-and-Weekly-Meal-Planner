from datetime import datetime
from app.extension import db

class MealPlan(db.Model):
    __tablename__ = "meal_plan" 
    meal_id = db.Column(db.Integer, primary_key=True ,index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id')) 
    plan_data = db.Column(db.JSON) 
    created_at = db.Column(db.DateTime, default=datetime.now(),index=True)

    user = db.relationship("User", back_populates="meal_plans")
    archived_meal_plans = db.relationship("ArchivedMealPlan", order_by="ArchivedMealPlan.archived_meal_plan_id", back_populates="meal_plan")

    def to_dict(self):
        return {
            'meal_id': self.meal_id,
            'user_id': self.user_id,
            'plan_data': self.plan_data,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    @staticmethod
    def from_dict(data):
        return MealPlan(
            user_id=data.get('user_id'),
            plan_data=data.get('plan_data'),
            created_at=datetime.now()
        )