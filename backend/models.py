from sqlalchemy import Column, Integer, String, Float

from database import Base


class PizzaItem(Base):
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    price = Column(Float, nullable=False)

    description = Column(String, nullable=True)

    category = Column(String, nullable=False)

    image_url = Column(String, nullable=True)