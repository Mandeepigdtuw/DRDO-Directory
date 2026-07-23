from fastapi import APIRouter, Depends
from database import search_logs_collection, personnel_collection
from auth import verify_token
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/summary")
def summary(token: str = Depends(verify_token)):
    total_searches = search_logs_collection.count_documents({})
    total_personnel = personnel_collection.count_documents({})
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    searches_today = search_logs_collection.count_documents(
        {"timestamp": {"$gte": today}}
    )
    zero_result_count = search_logs_collection.count_documents({"results_count": 0})
    return {
        "total_personnel": total_personnel,
        "total_searches": total_searches,
        "searches_today": searches_today,
        "zero_result_searches": zero_result_count
    }

@router.get("/top-searches")
def top_searches(token: str = Depends(verify_token)):
    pipeline = [
        {"$group": {"_id": "$query_text", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
        {"$project": {"query": "$_id", "count": 1, "_id": 0}}
    ]
    results = list(search_logs_collection.aggregate(pipeline))
    return {"top_searches": results}

@router.get("/trends")
def search_trends(token: str = Depends(verify_token)):
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    pipeline = [
        {"$match": {"timestamp": {"$gte": thirty_days_ago}}},
        {"$group": {
            "_id": {
                "year": {"$year": "$timestamp"},
                "month": {"$month": "$timestamp"},
                "day": {"$dayOfMonth": "$timestamp"}
            },
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}},
        {"$project": {
            "date": {
                "$dateToString": {
                    "format": "%Y-%m-%d",
                    "date": {
                        "$dateFromParts": {
                            "year": "$_id.year",
                            "month": "$_id.month",
                            "day": "$_id.day"
                        }
                    }
                }
            },
            "count": 1,
            "_id": 0
        }}
    ]
    results = list(search_logs_collection.aggregate(pipeline))
    return {"trends": results}

@router.get("/zero-results")
def zero_results(token: str = Depends(verify_token)):
    pipeline = [
        {"$match": {"results_count": 0}},
        {"$group": {"_id": "$query_text", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
        {"$project": {"query": "$_id", "count": 1, "_id": 0}}
    ]
    results = list(search_logs_collection.aggregate(pipeline))
    return {"zero_result_queries": results}

@router.get("/department-stats")
def department_stats(token: str = Depends(verify_token)):
    pipeline = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$project": {"department": "$_id", "count": 1, "_id": 0}}
    ]
    results = list(personnel_collection.aggregate(pipeline))
    return {"department_stats": results}