from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.register, name='register'),
    
    # User Profile
    path('user/profile/', views.profile, name='profile'),
    path('user/profile/update/', views.update_profile, name='update_profile'),
    path('user/sessions/', views.get_sessions, name='sessions'),
    
    # Testing and Health
    path('scale/test/', views.ScaleTestView.as_view(), name='scale_test'),
    path('health/', views.health_check, name='health'),
]
