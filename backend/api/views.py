"""
ScaleHub REST API — Views
=========================

All class-based API views for the ScaleHub platform.
"""

import time
import socket
import getpass

from rest_framework import status
from rest_framework.views import APIView
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
    """Return the hostname of the running Docker container."""
    try:
        return socket.gethostname()
    except OSError:
        return "unknown"

def create_learning_session(start, user, endpoint, status="success"):
    container_id = _get_container_id()

    elapsed = time.perf_counter() - start
    LearningSession.objects.create(
        user=user if user else None,
        container_id=container_id,
        endpoint=endpoint,
        status=status,
        response_time=elapsed,
    )


# ---------------------------------------------------------------------------
# Authentication  —  POST /api/v1/auth/register/
# ---------------------------------------------------------------------------

class RegisterView(APIView):
    """Register a new user account."""
    permission_classes = [AllowAny]

    def post(self, request):
        start = time.perf_counter()
        serializer = UserRegistrationSerializer(data=request.data)

        if not serializer.is_valid():
            create_learning_session(start, request.user, "get_profile", status="error")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        create_learning_session(start, user, "register")
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

class ProfileView(APIView):
    """Retrieve the authenticated user's full profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start = time.perf_counter()
        serializer = UserSerializer(request.user)

        create_learning_session(start, request.user, "get_profile")
        return Response(
            {
                "user": serializer.data,
                "container_id": _get_container_id(),
            }
        )


# ---------------------------------------------------------------------------
# Update Profile  —  PUT /api/v1/user/profile/update/
# ---------------------------------------------------------------------------

class UpdateProfileView(APIView):
    """Update the authenticated user's editable profile fields."""
    permission_classes = [IsAuthenticated]

    def put(self, request):
        start = time.perf_counter()
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

        
        create_learning_session(start, user, "update_profile")
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
from django.utils import timezone
class SessionListView(APIView):
    """Return the recent learning sessions for the current user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start = time.perf_counter()
        sessions = LearningSession.objects.filter(user=request.user).order_by('-updated_at')
        serializer = LearningSessionSerializer(sessions, many=True)
        container_id = _get_container_id()

        create_learning_session(start, request.user, "session_list")
        return Response({
            "sessions": serializer.data,
            "container_id": container_id,
            "updated_at": timezone.now().isoformat(),
        })


# ---------------------------------------------------------------------------
# Scale Test  —  GET /api/v1/scale/test/
# ---------------------------------------------------------------------------

class ScaleTestView(APIView):
    """Trigger a scaling test and optionally record a session."""
    permission_classes = [AllowAny]

    def get(self, request):
        start = time.perf_counter()
        container_id = _get_container_id()

        create_learning_session(start, request.user, "register")
        return Response({
            "message": "Successfully connected to ScaleHub backend!",
            "container_id": container_id,
            "timestamp": time.time(),
            "status": "success",
        })


# ---------------------------------------------------------------------------
# Health Check  —  GET /api/v1/health/
# ---------------------------------------------------------------------------

class HealthCheckView(APIView):
    """Liveness probe used by Docker and orchestration tools."""
    permission_classes = [AllowAny]

    def get(self, request):
        start = time.perf_counter()
        formatted_time = time.strftime("%d %b %Y %H:%M:%S") + " UTC+6"

        create_learning_session(start, request.user, "health_check")
        return Response(
            {
                "status": "healthy",
                "time": formatted_time,
                "container_id": _get_container_id(),
            }
        )