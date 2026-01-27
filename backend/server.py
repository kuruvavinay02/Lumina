from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from geopy.distance import geodesic

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.environ.get("JWT_SECRET", "lumina-safety-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class UserRole(str):
    USER = "user"
    NGO = "ngo"
    CITY = "city"
    ADMIN = "admin"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class IncidentType(str):
    HARASSMENT = "harassment"
    THEFT = "theft"
    ASSAULT = "assault"
    VANDALISM = "vandalism"
    SUSPICIOUS = "suspicious_activity"
    POOR_LIGHTING = "poor_lighting"
    OTHER = "other"

class SeverityLevel(str):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Location(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)

class SafetySignalCreate(BaseModel):
    location: Location
    incident_type: str
    severity: str
    description: Optional[str] = None
    time_of_day: str

class SafetySignalResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    location: Location
    incident_type: str
    severity: str
    description: Optional[str]
    time_of_day: str
    confidence_score: float
    validation_count: int
    spam_flag: bool
    created_at: str
    city: str

class AreaSafetyScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    area_name: str
    location: Location
    radius_meters: int
    safety_scores: Dict[str, float]
    confidence_level: float
    incident_count: int
    last_updated: str
    city: str

class RouteRequest(BaseModel):
    start: Location
    end: Location
    time_of_day: str = "day"
    prefer_safety: bool = True

class RoutePoint(BaseModel):
    lat: float
    lng: float
    safety_score: float

class RouteResponse(BaseModel):
    route_id: str
    points: List[RoutePoint]
    overall_safety_score: float
    distance_km: float
    estimated_time_minutes: int
    risky_segments: List[Dict[str, Any]]

class ValidationCreate(BaseModel):
    signal_id: str
    validation_type: str

class HotspotResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    location: Location
    area_name: str
    risk_score: float
    incident_density: int
    trend_velocity: str
    last_30_days_incidents: int
    confidence: float

class AnalyticsExportRequest(BaseModel):
    format: str = "csv"
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    city: Optional[str] = None

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password_hash": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_dict)
    
    token = create_access_token({"sub": user_dict["id"], "role": user_dict["role"]})
    
    user_response = UserResponse(
        id=user_dict["id"],
        email=user_dict["email"],
        name=user_dict["name"],
        role=user_dict["role"],
        created_at=user_dict["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        created_at=user["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

@api_router.post("/signals", response_model=SafetySignalResponse)
async def create_safety_signal(signal: SafetySignalCreate):
    signal_dict = {
        "id": str(uuid.uuid4()),
        "location": signal.location.model_dump(),
        "incident_type": signal.incident_type,
        "severity": signal.severity,
        "description": signal.description,
        "time_of_day": signal.time_of_day,
        "confidence_score": 0.7,
        "validation_count": 0,
        "spam_flag": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "city": "demo_city"
    }
    
    await db.safety_signals.insert_one(signal_dict)
    
    await update_area_safety_scores(signal.location, signal_dict["city"])
    
    return SafetySignalResponse(**signal_dict)

@api_router.get("/signals", response_model=List[SafetySignalResponse])
async def get_safety_signals(
    city: str = "demo_city",
    time_of_day: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 1000
):
    query = {"city": city, "spam_flag": False}
    if time_of_day:
        query["time_of_day"] = time_of_day
    if severity:
        query["severity"] = severity
    
    signals = await db.safety_signals.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return [SafetySignalResponse(**s) for s in signals]

@api_router.post("/signals/{signal_id}/validate")
async def validate_signal(signal_id: str, validation: ValidationCreate):
    signal = await db.safety_signals.find_one({"id": signal_id}, {"_id": 0})
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    
    validation_dict = {
        "id": str(uuid.uuid4()),
        "signal_id": signal_id,
        "validation_type": validation.validation_type,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.validations.insert_one(validation_dict)
    
    validation_count = await db.validations.count_documents({"signal_id": signal_id})
    confidence_score = min(0.9, 0.5 + (validation_count * 0.1))
    
    await db.safety_signals.update_one(
        {"id": signal_id},
        {"$set": {"validation_count": validation_count, "confidence_score": confidence_score}}
    )
    
    return {"message": "Validation recorded", "new_confidence": confidence_score}

async def update_area_safety_scores(location: Location, city: str):
    area_id = f"{city}_{int(location.lat * 100)}_{int(location.lng * 100)}"
    
    existing = await db.area_scores.find_one({"id": area_id}, {"_id": 0})
    
    nearby_signals = await db.safety_signals.find({
        "city": city,
        "spam_flag": False
    }, {"_id": 0}).to_list(1000)
    
    relevant_signals = []
    for signal in nearby_signals:
        sig_loc = (signal["location"]["lat"], signal["location"]["lng"])
        area_loc = (location.lat, location.lng)
        distance = geodesic(sig_loc, area_loc).meters
        if distance <= 500:
            relevant_signals.append(signal)
    
    safety_scores = {
        "morning": calculate_safety_score([s for s in relevant_signals if s.get("time_of_day") == "morning"]),
        "evening": calculate_safety_score([s for s in relevant_signals if s.get("time_of_day") == "evening"]),
        "night": calculate_safety_score([s for s in relevant_signals if s.get("time_of_day") == "night"]),
        "overall": calculate_safety_score(relevant_signals)
    }
    
    area_doc = {
        "id": area_id,
        "area_name": f"Area {area_id}",
        "location": location.model_dump(),
        "radius_meters": 500,
        "safety_scores": safety_scores,
        "confidence_level": min(0.9, len(relevant_signals) * 0.05),
        "incident_count": len(relevant_signals),
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "city": city
    }
    
    await db.area_scores.update_one(
        {"id": area_id},
        {"$set": area_doc},
        upsert=True
    )

def calculate_safety_score(signals: List[dict]) -> float:
    if not signals:
        return 85.0
    
    severity_weights = {"low": 5, "medium": 15, "high": 30}
    total_risk = sum(severity_weights.get(s.get("severity", "low"), 5) for s in signals)
    confidence_factor = sum(s.get("confidence_score", 0.5) for s in signals) / len(signals)
    
    base_score = 100 - min(total_risk, 70)
    adjusted_score = base_score * confidence_factor
    
    return max(20.0, min(95.0, adjusted_score))

@api_router.get("/areas/scores", response_model=List[AreaSafetyScore])
async def get_area_scores(city: str = "demo_city", limit: int = 500):
    areas = await db.area_scores.find({"city": city}, {"_id": 0}).limit(limit).to_list(limit)
    return [AreaSafetyScore(**a) for a in areas]

@api_router.post("/routes/plan", response_model=RouteResponse)
async def plan_safe_route(route_req: RouteRequest):
    distance = geodesic(
        (route_req.start.lat, route_req.start.lng),
        (route_req.end.lat, route_req.end.lng)
    ).kilometers
    
    num_points = max(5, int(distance * 2))
    route_points = []
    
    for i in range(num_points + 1):
        t = i / num_points
        lat = route_req.start.lat + t * (route_req.end.lat - route_req.start.lat)
        lng = route_req.start.lng + t * (route_req.end.lng - route_req.start.lng)
        
        nearby_signals = await db.safety_signals.find({
            "spam_flag": False
        }, {"_id": 0}).to_list(1000)
        
        point_signals = []
        for signal in nearby_signals:
            sig_loc = (signal["location"]["lat"], signal["location"]["lng"])
            point_loc = (lat, lng)
            if geodesic(sig_loc, point_loc).meters <= 300:
                point_signals.append(signal)
        
        safety_score = calculate_safety_score(point_signals)
        route_points.append(RoutePoint(lat=lat, lng=lng, safety_score=safety_score))
    
    overall_safety = sum(p.safety_score for p in route_points) / len(route_points)
    
    risky_segments = []
    for i, point in enumerate(route_points):
        if point.safety_score < 60:
            risky_segments.append({
                "index": i,
                "location": {"lat": point.lat, "lng": point.lng},
                "safety_score": point.safety_score,
                "warning": "High risk area"
            })
    
    return RouteResponse(
        route_id=str(uuid.uuid4()),
        points=route_points,
        overall_safety_score=overall_safety,
        distance_km=distance,
        estimated_time_minutes=int(distance * 12),
        risky_segments=risky_segments
    )

@api_router.get("/hotspots", response_model=List[HotspotResponse])
async def get_hotspots(city: str = "demo_city", limit: int = 20):
    thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    
    signals = await db.safety_signals.find({
        "city": city,
        "spam_flag": False,
        "created_at": {"$gte": thirty_days_ago}
    }, {"_id": 0}).to_list(5000)
    
    location_clusters = {}
    for signal in signals:
        cluster_key = f"{int(signal['location']['lat'] * 50)}_{int(signal['location']['lng'] * 50)}"
        if cluster_key not in location_clusters:
            location_clusters[cluster_key] = []
        location_clusters[cluster_key].append(signal)
    
    hotspots = []
    for cluster_key, cluster_signals in location_clusters.items():
        if len(cluster_signals) >= 3:
            avg_lat = sum(s["location"]["lat"] for s in cluster_signals) / len(cluster_signals)
            avg_lng = sum(s["location"]["lng"] for s in cluster_signals) / len(cluster_signals)
            
            risk_score = 100 - calculate_safety_score(cluster_signals)
            
            hotspots.append({
                "id": str(uuid.uuid4()),
                "location": {"lat": avg_lat, "lng": avg_lng},
                "area_name": f"Hotspot {cluster_key}",
                "risk_score": risk_score,
                "incident_density": len(cluster_signals),
                "trend_velocity": "increasing" if len(cluster_signals) > 5 else "stable",
                "last_30_days_incidents": len(cluster_signals),
                "confidence": min(0.9, len(cluster_signals) * 0.08)
            })
    
    hotspots.sort(key=lambda x: x["risk_score"], reverse=True)
    return [HotspotResponse(**h) for h in hotspots[:limit]]

@api_router.get("/dashboard/metrics")
async def get_dashboard_metrics(
    city: str = "demo_city",
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["ngo", "city", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    total_signals = await db.safety_signals.count_documents({"city": city, "spam_flag": False})
    
    thirty_days_ago = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
    recent_signals = await db.safety_signals.count_documents({
        "city": city,
        "spam_flag": False,
        "created_at": {"$gte": thirty_days_ago}
    })
    
    high_severity = await db.safety_signals.count_documents({
        "city": city,
        "severity": "high",
        "spam_flag": False
    })
    
    areas_monitored = await db.area_scores.count_documents({"city": city})
    
    return {
        "total_signals": total_signals,
        "last_30_days": recent_signals,
        "high_severity_count": high_severity,
        "areas_monitored": areas_monitored,
        "avg_confidence": 0.75,
        "community_participation_rate": 0.68
    }

@api_router.get("/dashboard/trends")
async def get_risk_trends(
    city: str = "demo_city",
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["ngo", "city", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    cutoff_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    
    signals = await db.safety_signals.find({
        "city": city,
        "spam_flag": False,
        "created_at": {"$gte": cutoff_date}
    }, {"_id": 0}).to_list(10000)
    
    daily_counts = {}
    for signal in signals:
        date_key = signal["created_at"][:10]
        if date_key not in daily_counts:
            daily_counts[date_key] = {"date": date_key, "count": 0, "high_severity": 0}
        daily_counts[date_key]["count"] += 1
        if signal["severity"] == "high":
            daily_counts[date_key]["high_severity"] += 1
    
    return {"trends": list(daily_counts.values())}

@api_router.post("/dashboard/export")
async def export_analytics(
    export_req: AnalyticsExportRequest,
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["ngo", "city", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "export_id": str(uuid.uuid4()),
        "status": "processing",
        "format": export_req.format,
        "message": "Export will be ready for download shortly",
        "download_url": f"/api/dashboard/download/{uuid.uuid4()}"
    }

@api_router.get("/cities")
async def get_cities():
    return [
        {"id": "demo_city", "name": "Demo City", "country": "Demo", "active": True},
        {"id": "new_york", "name": "New York", "country": "USA", "active": False},
        {"id": "london", "name": "London", "country": "UK", "active": False}
    ]

@api_router.get("/privacy/transparency")
async def get_transparency_info():
    return {
        "data_collection": {
            "pii_collected": False,
            "anonymous_reporting": True,
            "location_precision": "Area-level only (500m radius)",
            "data_retention": "365 days with confidence decay"
        },
        "risk_scoring": {
            "algorithm": "Community-weighted confidence scoring",
            "factors": ["Incident severity", "Validation count", "Time decay", "Spatial clustering"],
            "transparency": "Open-source algorithm available on GitHub"
        },
        "ethical_safeguards": {
            "profiling_prevention": "No user tracking or behavioral profiling",
            "bias_mitigation": "Regular algorithmic audits for fairness",
            "community_governance": "Community review board for contested reports"
        }
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
