from django.db import router
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from Apartment import views

router = DefaultRouter()
router.register('Box', views.BoxViewSet)

urlpatterns = [
    path('', include(router.urls)),

]