from rest_framework import serializers
from .models import Task, TaskStatus

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "description", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_status(self, value):
        self.instance
        if self.instance and not self.instance.can_transition_to(value):
            raise serializers.ValidationError(
                f"Invalid status transition from {self.instance.status} to {value}."
            )
        return value