from fastapi import APIRouter, Depends
from dependencies import get_token_header

# Route with a protect route.
# Check dependencies.get_token_header for token.

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    responses={418: {"description": "I'm a teapot"}},
)


@router.post("/")
async def update_admin():
    return {"message": "Admin getting schwifty"}
