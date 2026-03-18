from django.db import models


# Create your models here
class TaskStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.OPEN,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.status})"

    def can_transition_to(self, new_status):
        allowed_transitions = {
            TaskStatus.OPEN: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS],
            TaskStatus.IN_PROGRESS: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
            TaskStatus.COMPLETED: [TaskStatus.COMPLETED],
        }
        return new_status in allowed_transitions.get(self.status, [])