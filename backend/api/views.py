"""
ScaleHub REST API — Views
=========================

All function-based API views for the ScaleHub platform.
ScaleHub is a Docker-scaling learning tool that lets users observe how
Nginx distributes HTTP requests across multiple backend containers in real time.

Endpoints
---------
Authentication:
    POST  /api/v1/auth/register/          Register a new user account
    POST  /api/v1/auth/login/             Obtain JWT access + refresh tokens
    POST  /api/v1/auth/refresh/           Rotate the access token

User Profile:
    GET   /api/v1/user/profile/           Retrieve the authenticated user's profile
    PUT   /api/v1/user/profile/update/    Update the authenticated user's profile

Sessions:
    GET   /api/v1/user/sessions/          List the 20 most recent learning sessions

Scaling & Health:
    GET   /api/v1/scale/test/             Trigger a scaling test (logs a session)
    GET   /api/v1/health/                 Liveness probe for monitoring

Authentication
--------------
Protected endpoints require the header::

    Authorization: Bearer <access_token>

Tokens are issued by the login endpoint and must be rotated via the refresh
endpoint before expiry (24-hour access / 7-day refresh window).
"""

import socket
import time

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import LearningSession
from .serializers import (
    LearningSessionSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)


# ---------------------------------------------------------------------------
# Private helper
# ---------------------------------------------------------------------------

def _get_container_id() -> str:
    """Return the hostname of the running Docker container.

    In a multi-replica deployment Nginx routes each request to a different
    container using the least-connection algorithm.  The hostname therefore
    changes per request — observing those changes is the entire point of the
    ScaleHub learning experience.

    Returns
    -------
    str
        The container hostname, or ``"unknown"`` when resolution fails.
    """
    try:
        return socket.gethostname()
    except OSError:
        return "unknown"


# ---------------------------------------------------------------------------
# Authentication  —  POST /api/v1/auth/register/
# ---------------------------------------------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Register a new user account.

    Validates the request body, creates a Django ``User`` together with its
    paired ``UserProfile``, and returns the serialised user data plus the ID
    of the container that handled the request.

    Request Body (JSON)
    -------------------
    username : str
        Unique login handle (required).
    email : str
        Unique email address (required).
    password : str
        Plain-text password — minimum 6 characters (required).
    password_confirm : str
        Must match ``password`` exactly (required).
    first_name : str, optional
    last_name : str, optional

    Responses
    ---------
    201 Created
        ``{ message, user: {...}, container_id }``
    400 Bad Request
        ``{ field: ["error message"] }``  — field-level validation errors.
    """
    serializer = UserRegistrationSerializer(data=request.data)

    if not serializer.is_valid():
        # Return every field-level validation error so the UI can display them.
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    return Response(
        {
            "message": "Registration successful. Welcome to ScaleHub!",
            "user": UserSerializer(user).data,
            "container_id": _get_container_id(),
        },
        status=status.HTTP_201_CREATED,
    )


# ---------------------------------------------------------------------------
# User Profile  —  GET /api/v1/user/profile/
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    """Retrieve the authenticated user's full profile.

    The response includes the nested ``UserProfile`` (avatar, bio, timestamps)
    alongside the core Django ``User`` fields.

    Responses
    ---------
    200 OK
        ``{ user: {...}, container_id }``
    401 Unauthorized
        Missing or invalid Bearer token.
    """
    serializer = UserSerializer(request.user)

    return Response(
        {
            "user": serializer.data,
            "container_id": _get_container_id(),
        }
    )


# ---------------------------------------------------------------------------
# Update Profile  —  PUT /api/v1/user/profile/update/
# ---------------------------------------------------------------------------

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update the authenticated user's editable profile fields.

    Only the fields present in the request body are modified; any field that
    is absent is left unchanged.  This allows partial updates without
    requiring the client to resend the entire profile.

    Request Body (JSON)
    -------------------
    first_name : str, optional
    last_name : str, optional
    avatar : str, optional
        URL or emoji identifier used as the user's avatar image.
    bio : str, optional
        Short personal description shown on the profile page.

    Responses
    ---------
    200 OK
        ``{ message, user: {...}, container_id }``
    401 Unauthorized
        Missing or invalid Bearer token.
    """
    user = request.user
    user_profile = user.profile  # OneToOne relation — always exists after register

    # Apply updates to the Django User model (first_name, last_name).
    user_fields = ("first_name", "last_name")
    for field in user_fields:
        if field in request.data:
            setattr(user, field, request.data[field])

    # Apply updates to the UserProfile model (avatar, bio).
    profile_fields = ("avatar", "bio")
    for field in profile_fields:
        if field in request.data:
            setattr(user_profile, field, request.data[field])

    # Persist both models in a single round-trip each.
    user.save()
    user_profile.save()

    return Response(
        {
            "message": "Profile updated successfully.",
            "user": UserSerializer(user).data,
            "container_id": _get_container_id(),
        }
    )


# ---------------------------------------------------------------------------
# Learning Sessions  —  GET /api/v1/user/sessions/
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    """Return the 20 most recent learning sessions for the current user.

    Each ``LearningSession`` record captures:
    - ``container_id``   — which replica handled the request
    - ``endpoint``       — the API path that was called
    - ``status``         — outcome of the request (default: "success")
    - ``response_time``  — seconds from request receipt to session log write
    - ``timestamp``      — when the session was created (UTC)

    Responses
    ---------
    200 OK
        ``{ sessions: [...], container_id }``
    401 Unauthorized
        Missing or invalid Bearer token.
    """
    sessions = (
        LearningSession.objects
        .filter(user=request.user)
        .order_by("-timestamp")[:20]
    )
    serializer = LearningSessionSerializer(sessions, many=True)

    return Response(
        {
            "sessions": serializer.data,
            "container_id": _get_container_id(),
        }
    )


# ---------------------------------------------------------------------------
# Scale Test  —  GET /api/v1/scale/test/
# ---------------------------------------------------------------------------

# Import ApiView here to avoid circular imports with the serializers and models.
from rest_framework.views import APIView
class ScaleTestView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        """Trigger a scaling test and optionally record a session.

        This is the core learning endpoint.  Every request is routed by Nginx to
        whichever backend container has the fewest active connections at that
        moment (least-connection load balancing).  The container hostname embedded
        in the response lets the user watch the distribution change across calls.

        For authenticated users a ``LearningSession`` row is persisted, making the
        interaction visible on the Sessions page together with its response time.

        Responses
        ---------
        200 OK
            ``{ message, container_id, timestamp, status: "success" }``
        """
        container_id = _get_container_id()

        # Capture the wall-clock time before any database work so the recorded
        # response_time reflects only the view's own processing cost.
        start = time.perf_counter()

        if request.user.is_authenticated:
            elapsed = time.perf_counter() - start
            LearningSession.objects.create(
                user=request.user,
                container_id=container_id,
                endpoint="scale_test",
                status="success",
                response_time=elapsed,
            )

        return Response(
            {
                "message": "Successfully connected to ScaleHub backend!",
                "container_id": container_id,
                "timestamp": time.time(),
                "status": "success",
            }
        )


# ---------------------------------------------------------------------------
# Health Check  —  GET /api/v1/health/
# ---------------------------------------------------------------------------

@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """Liveness probe used by Docker and orchestration tools.

    Returns a minimal ``healthy`` payload together with the serving
    container's ID.  Load-balancer health checks and monitoring dashboards
    use this endpoint to confirm that every replica is reachable.

    Responses
    ---------
    200 OK
        ``{ status: "healthy", container_id }``
    """
    return Response(
        {
            "status": "healthy",
            "container_id": _get_container_id(),
        }
    )
