from pydantic import BaseModel, Field, ConfigDict
from typing import List
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List

from typing_extensions import Annotated
PyObjectId = Annotated[str, BeforeValidator(str)]


class GroupModel(BaseModel):
    id: Optional[PyObjectId] = Field(default= None, alias="_id")
    name: str = Field(...)
    users: List[str] = []
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
