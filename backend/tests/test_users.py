def test_get_user(client):

    response = client.get("/api/users/torvalds")


    assert response.status_code == 200


    data = response.json()


    assert data["success"] is True


    assert data["data"]["username"] == "torvalds"


    assert data["data"]["name"] is not None