def calculate_contribution(repositories):
    """
    Calculates developer contribution score
    based on repository activity signals.
    """

    if not repositories:
        return 0.0


    total_stars = sum(
        repo.stargazers_count or 0
        for repo in repositories
    )


    total_forks = sum(
        repo.forks_count or 0
        for repo in repositories
    )


    total_repos = len(repositories)


    # Weighted contribution formula
    score = (
        (total_repos * 5)
        +
        (total_stars * 0.01)
        +
        (total_forks * 0.05)
    )


    return round(
        min(score, 100),
        2
    )