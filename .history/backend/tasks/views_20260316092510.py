from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

from .models import Task
from .serializers import TaskSerializer

# Create your views here.
