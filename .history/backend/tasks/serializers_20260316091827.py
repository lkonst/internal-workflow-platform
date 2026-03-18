from rest_framework import serializers
from .models import Task, TaskStatus

class TaskSerializer(serializers.ModelSerializer):