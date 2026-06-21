def test_user_not_found_error(client):

    response = client.get(
        "/api/users/randomrandomuser123"
    )


    assert response.status_code == 404


    data = response.json()


    assert data["success"] is False


    assert data["error_code"] == "RESOURCE_NOT_FOUND"


    assert "not found" in data["message"].lower()