from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task, TaskStatus

# Create your tests here.

class TaskAPITestCase(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Test Task",
            description="This is a test task.",
            status=TaskStatus.OPEN,
        )
    
    def test_list_tasks(self):
        url = "api/"