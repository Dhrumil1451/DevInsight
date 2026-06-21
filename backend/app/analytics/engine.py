from sqlalchemy.orm import Session

from app.repositories import repository_repo

from app.analytics.diversity import calculate_language_diversity
from app.analytics.growth import calculate_growth_metrics
from app.analytics.health import calculate_health_average
from app.analytics.insights import generate_textual_insights
from app.analytics.contribution import calculate_contribution


def generate_analytics_for_profile(db: Session, profile) -> dict:
    """
    Orchestrates the complete analytics pipeline.
    """

    # Fetch cached repositories
    repos = repository_repo.get_by_profile_id(
        db,
        profile.id,
        skip=0,
        limit=1000
    )


    # 1. Language Analysis
    lang_metrics = calculate_language_diversity(repos)

    language_score = float(
        min(lang_metrics["total_languages"] * 10, 100)
    )


    # 2. Growth Analytics
    growth_score = calculate_growth_metrics(
        profile,
        repos
    )


    # 3. Repository Health
    health_average = calculate_health_average(
        repos
    )


    # 4. Contribution Score
    contribution_score = calculate_contribution(
        repos
    )


    # 5. Developer Score
    dev_score = (
        (contribution_score * 0.35)
        +
        (growth_score * 0.25)
        +
        (language_score * 0.20)
        +
        (health_average * 0.20)
    )

    dev_score = round(dev_score, 2)


    # 6. Insights
    insights = generate_textual_insights(
        profile=profile,
        most_used_language=lang_metrics["most_used_language"],
        total_languages=lang_metrics["total_languages"],
        overall_score=dev_score
    )


    # 7. Final analytics response
    return {

        "developer_score": {

            "score": dev_score,

            "breakdown": {

                "growth": growth_score,

                "contribution": contribution_score,

                "language_diversity": language_score,

                "repo_health": health_average

            }

        },


        "language_analysis": {

            "most_used_language":
                lang_metrics["most_used_language"],

            "total_languages":
                lang_metrics["total_languages"],

            "distribution":
                lang_metrics["distribution"]

        },


        "growth_analysis": {

            "growth_score": growth_score

        },


        "repo_health": {

            "average_health": health_average

        },


        "insights": insights

    }