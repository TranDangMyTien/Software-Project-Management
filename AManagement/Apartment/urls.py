from django.urls import path, include, re_path
from Apartment import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('Bill', views.BillViewSet)
router.register('User', views.ResidentLoginViewset)

urlpatterns = [
    path('', include(router.urls)),

]