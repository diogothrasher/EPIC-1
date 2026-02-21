from app.security import hash_password, verify_password, create_access_token
from uuid import uuid4


def test_password_hash():
    senha = "MinhaSenh@123"
    hashed = hash_password(senha)
    assert hashed != senha
    assert verify_password(senha, hashed)
    assert not verify_password("errada", hashed)


def test_create_token():
    uid = uuid4()
    token = create_access_token(uid)
    assert isinstance(token, str)
    assert len(token) > 10
