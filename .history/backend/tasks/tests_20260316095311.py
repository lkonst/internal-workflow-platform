from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models

# Create your tests here.

class TaskAPITestCase(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Test Task",
            description="This is a test task.",
            status=TaskStatus.OPEN,
        )