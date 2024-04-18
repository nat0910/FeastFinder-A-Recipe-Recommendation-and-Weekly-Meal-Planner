from datetime import datetime
from app.extension import db


class ArchivedMealPlan(db.Model):
    __tablename__ = "archived_meal_plans"
    archived_meal_plan_id = db.Column(db.Integer, primary_key=True, index=True)
    meal_id = db.Column(db.Integer, db.ForeignKey('meal_plan.meal_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id')) 
    plan_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, index=True)

    meal_plan = db.relationship("MealPlan", back_populates="archived_meal_plans")
    user = db.relationship("User", back_populates="archived_meal_plans")


    def to_dict(self):
        return {
            'archived_meal_plan_id': self.archived_meal_plan_id,
            'meal_id': self.meal_id,
            'user_id': self.user_id,
            'plan_data': self.plan_data,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    @staticmethod
    def from_dict(data):
        return ArchivedMealPlan(
            meal_id=data.get('meal_id'),
            user_id=data.get('user_id'),
            plan_data=data.get('plan_data'),
            created_at=datetime.strptime(data.get('created_at'), "%Y-%m-%d %H:%M:%S")
        )
