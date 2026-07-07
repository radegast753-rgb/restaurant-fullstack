from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db
from models import PizzaItem
from schemas import MenuItem, MenuItemCreate

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Restaurant API")

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Restaurant API is running"}

@app.get("/api/menu", response_model=list[MenuItem])
def get_menu(db: Session = Depends(get_db)):
    return db.query(PizzaItem).all()


@app.post("/api/menu", response_model=MenuItem)
def create_menu_item(
    item: MenuItemCreate,
    db: Session = Depends(get_db)
):
    new_item = PizzaItem(
        name=item.name,
        price=item.price,
        description=item.description,
        category=item.category,
        image_url=item.image_url
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item

@app.delete("/api/menu/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = db.query(PizzaItem).filter(PizzaItem.id == item_id).first()

    if not item:
        return {"error": "Item not found"}

    db.delete(item)
    db.commit()

    return {"message": "Item deleted"}