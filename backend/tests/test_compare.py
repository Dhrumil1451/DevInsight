def test_compare_developers(client):

    response = client.get(
        "/api/compare?user1=torvalds&user2=gvanrossum"
    )


    assert response.status_code == 200


    data = response.json()


    assert data["success"] is True


    comparison = data["data"]


    # User 1 validation

    assert "user1" in comparison

    assert comparison["user1"]["profile"]["username"] == "torvalds"



    # User 2 validation

    assert "user2" in comparison

    assert comparison["user2"]["profile"]["username"] == "gvanrossum"



    # Analytics existence

    assert "analytics" in comparison["user1"]

    assert "analytics" in comparison["user2"]