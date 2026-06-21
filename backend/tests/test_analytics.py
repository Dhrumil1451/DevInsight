def test_get_analytics(client):

    response = client.get("/api/analytics/torvalds")


    assert response.status_code == 200


    data = response.json()


    assert data["success"] is True


    analytics = data["data"]


    # Developer score
    assert "developer_score" in analytics

    assert analytics["developer_score"]["score"] is not None



    # Language analysis
    assert "language_analysis" in analytics

    assert analytics["language_analysis"]["total_languages"] >= 1



    # Growth analysis
    assert "growth_analysis" in analytics



    # Repository health
    assert "repo_health" in analytics



    # Insights
    assert analytics["insights"] is not None