from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.CharField(max_length=200, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    class Meta:
        ordering = ['-created_at']

class LearningSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='sessions', null=True, blank=True)
    container_id = models.CharField(max_length=255)
    endpoint = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='success')
    response_time = models.FloatField(default=0.0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.container_id}" if self.user else f"Anonymous - {self.container_id}"

    class Meta:
        ordering = ['-updated_at']
