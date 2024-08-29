

from django.db import router
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from Apartment import views

router = DefaultRouter()
router.register('Box', views.BoxViewSet)
router.register('Bill', views.BillViewSet)
router.register('User', views.ResidentLoginViewset)
router.register('CarCard', views.CarCardViewset)
router.register('Info', views.InfoViewSet)
router.register('user_info_people', views.InfoPeopleViewSet, basename='user_info')
router.register('letter', views.LettersViewSet)
router.register(r'surveys', views.SurveyViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'surveyresponses', views.SurveyResponseViewSet)
router.register(r'answers', views.AnswerViewSet)
router.register('goods', views.GoodsViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),

]