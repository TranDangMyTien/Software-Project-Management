

from django.db import router
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from Apartment import views

router = DefaultRouter()
router.register('Box', views.BoxViewSet)
router.register('Bill', views.BillViewSet)
router.register('User', views.ResidentLoginViewset)
router.register('CarCard', views.CarCardViewset)


urlpatterns = [
    path('', include(router.urls)),

]