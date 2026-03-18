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
        url = "api/tasks/"
        response = self.client.get(url)
        data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data), 1)

    def test_create_task(self):
        url = "api/tasks/"
        payload = {
            "title": "New Task",
            "description": "This is a new task.",
            "status": TaskStatus.OPEN,
        }
        response = self.client.post(url, payload, format="json")
        data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_valid_status_transition(self):
        url = f"api/tasks/{self.id}/"
        print
        payload = {
            "status": TaskStatus.IN_PROGRESS,
        }
        response = self.client.patch(url, payload, format="json")
        data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data["status"], TaskStatus.IN_PROGRESS)
