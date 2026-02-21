def test_listar_tickets_sem_auth(client):
    response = client.get("/api/tickets")
    assert response.status_code == 403


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
