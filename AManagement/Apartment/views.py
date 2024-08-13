import random
import string

import cloudinary
import yagmail
from django.db.models import Q
from rest_framework import viewsets, generics, status, parsers, permissions
from Apartment import serializers, paginators
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, People, CarCard, Box, Goods, Letters, Bill, Survey, Question, Answer, SurveyResponse
from .serializers import PeopleSerializers, UserSerializers, CarCardSerializers, BoxSerializers, GoodsSerializers, \
    LettersSerializers, BillSerializers, UpdateResidentSerializer, \
    ForgotPasswordSerializers, SurveySerializer, QuestionSerializer, AnswerSerializer, \
    SurveyResponseSerializer, AdminSerializers
from datetime import datetime, timedelta, timezone, time
from django.views.decorators.csrf import csrf_exempt
import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response as DRFResponse



# API TỦ ĐỒ
class BoxViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Box.objects.filter(is_active=True)
    serializer_class = BoxSerializers

    @action(methods=['get'], url_path='get_box', detail=False)
    def get_box(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các Hóa đơn mà người dùng đang có
        box_user = Box.objects.filter(user_admin=current_user.id)
        serialized_data = self.serializer_class(box_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)


