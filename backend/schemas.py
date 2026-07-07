from pydantic import BaseModel


class MenuItemBase(BaseModel):
    name: str
    price: float
    description: str | None = None
    category: str
    image_url: str | None = None


class MenuItemCreate(MenuItemBase):
    pass


class MenuItem(MenuItemBase):
    id: int

    class Config:
        from_attributes = True