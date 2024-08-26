import random
import string
import cloudinary
import yagmail
from rest_framework import viewsets, generics, status, parsers, permissions
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
from django.db.models import Q
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



class ResidentLoginViewset(viewsets.ViewSet, generics.ListAPIView):  # API Người dùng đăng nhập
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializers
    parser_classes = [parsers.MultiPartParser, JSONParser, FormParser]

    def get_permissions(self):
        if self.action in ['upload_avatar', 'get_admin']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    # Khi nguời dùng đăng nhập lần đầu tiên thì bắt buộc đổi mk + avt

    @action(methods=['post'], url_path='upload_avatar', detail=False)
    def update_account(self, request):
        user = request.user  # Người dùng đang đăng nhập

        try:
            if user.change_password_required:
                # Nếu change_password_required là True, chỉ xuất ra dữ liệu của tài khoản
                serializer = UpdateResidentSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                user.password = request.data.get('password')
                avatar_file = request.data.get('avatar')

                new_avatar = cloudinary.uploader.upload(avatar_file)
                user.avatar_acount = new_avatar['secure_url']
                user.change_password_required = True
                user.save()
                return Response({'message': 'Avatar uploaded successfully'}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"message": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

    # Thong tin tai khoang User
    @action(methods=['get'], url_path='get_user', detail=False)  # Người dùng xem thông tin user đăng nhập của mình
    def get_user(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        user = User.objects.filter(id=current_user.id).first()
        serialized = self.serializer_class(user).data
        return Response(serialized, status=status.HTTP_200_OK)

    # def get_queryset(self):
    #     queryset = self.queryset
    #
    #     q = self.request.query_params.get('q')
    #     if q:
    #         queryset = queryset.filter(name_acount__icontains=q)
    #
    #     ad_id = self.request.query_params.get('admin_id')
    #
    #     if ad_id:
    #         queryset = queryset.filter(admin_id=ad_id)
    #     return queryset
    @action(methods=['get'], url_path='get_admin', detail=False)  # Người dùng xem id và ten admin
    def get_admin(self, request):
        # Lấy người dùng đang đăng nhập từ request
        user = User.objects.filter(user_role=User.EnumRole.ADMIN).all()
        serialized = AdminSerializers(user, many=True).data
        return Response(serialized, status=status.HTTP_200_OK)

class BillViewSet(viewsets.ViewSet, generics.ListAPIView):

    # def get_permissions(self):
    #     if self.action in ['get_bill', 'upload_imgbank', ]:
    #         return [permissions.IsAuthenticated()]
    #
    #     return [permissions.AllowAny()]

    queryset = Bill.objects.filter(is_active=True)
    serializer_class = BillSerializers


    # Xem hóa đơn của người dùng hiện có
    @action(methods=['get'], url_path='get_bill', detail=False)
    def get_bill(self, request):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các Hóa đơn mà người dùng đang có
        bill_user = Bill.objects.filter(user_resident=current_user.id)
        serialized_data = self.serializer_class(bill_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    # Người dùng tìm kiếm hóa đơn theo tên và id
    @action(methods=['get'], url_path='search_bill', detail=True)
    def search_bill(self, request, pk):
        current_user = request.user
        bill_id = request.query_params.get('id', None)
        bill_name = request.query_params.get('name', None)

        bills = Bill.objects.filter(user_resident=current_user.id)

        if bill_id:
            bills = bills.filter(id=bill_id)
        if bill_name:
            # Sử dụng Q object để tìm kiếm theo tên bill
            bills = bills.filter(Q(name_bill__icontains=bill_name))  # icontains : Tìm kiếm không phân biệt hoa thường

        serialized_data = self.serializer_class(bills, many=True).data

        if not serialized_data:  # Kiểm tra có hóa đơn nào phù hợp hay không
            return Response({"message": "No bills found with the given criteria"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialized_data, status=status.HTTP_200_OK)

    # API UPLOAD ảnh thanh toán qua ngân hàng
    @action(methods=['post'], url_path='upload_imgbanking', detail=False)
    def upload_imgbank(self, request):
        current_user = request.user
        try:

            id_bill = request.data.get('id')
            total = request.data.get('total')
            img_file = request.data.get('image')
            bill = Bill.objects.filter(id=id_bill, money=total, user_resident=current_user.id).first()
            print(id_bill, total, img_file, bill)

            if bill.status_bill == Bill.EnumStatusBill.UNPAID:
                imageCloud = cloudinary.uploader.upload(img_file)
                bill.transaction_images = imageCloud['secure_url']
                bill.payment_style = 'BANKING'
                bill.save()

                return Response({'message': 'Image Bank uploaded successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Cannot find invoice to update"},
                                status=status.HTTP_404_NOT_FOUND)
        except current_user.DoesNotExist:
            return Response({"message": "Account not found"}, status=status.HTTP_404_NOT_FOUND)


class ResidentLoginViewset(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):  # API Người dùng đăng nhập
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializers
    parser_classes = [parsers.MultiPartParser, JSONParser, FormParser]

    @action(methods=['get'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        return Response(UserSerializers(user).data)


# API INFO NGUOI DUNG
class InfoViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = People.objects.filter(is_active=True)
    serializer_class = ForgotPasswordSerializers

    # API tạo code xử lý quên mật khẩu
    @action(methods=['post'], url_path='create_passForgot', detail=False)
    def create_passForgot(self, request):
        name_people = request.data.get('name_people')
        identification_card = request.data.get('identification_card')

        try:
            person = People.objects.get(identification_card=identification_card, name_people=name_people)
        except People.DoesNotExist:
            return Response({"message": "Không tìm thấy người dùng"},
                            status=status.HTTP_404_NOT_FOUND)

        # Tạo mã code ngẫu nhiên
        code = ''.join(random.choices(string.digits, k=6))

        # Xử lý gửi mail
        yag = yagmail.SMTP("phanloan2711@gmail.com", 'mpgnbisxmfgwpdbg')
        to = person.user.email
        subject = 'CHUNG CƯ HIỀN VY: Mã xác thực đổi mật khẩu'
        body = f'Mã xác thực của bạn là: {code}'
        yag.send(to=to, subject=subject, contents=body)

        # Lưu mã code vào session của người dùng
        request.session['verification_code'] = code
        request.session['user_id'] = person.user.id
        request.session.modified = True  # Đảm bảo session được cập nhật

        return Response({"message": "Mã xác thực đã được gửi qua email", "code": code}, status=status.HTTP_200_OK)

    # API gui mat khau moi
    @action(methods=['post'], url_path='reset_password', detail=False)
    def reset_password(self, request):
        code = request.data.get('code')
        new_password = request.data.get('password')
        print(new_password)

        # Lấy mã code đã lưu trong session của người dùng
        session_code = request.session.get('verification_code')
        user_id = request.session.get('user_id')

        if not session_code or not user_id:
            return Response({"message": "Session không hợp lệ hoặc đã hết hạn"}, status=status.HTTP_400_BAD_REQUEST)

        if code != session_code:
            return Response({"message": "Mã xác thực không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        # Đặt mật khẩu mới cho người dùng
        user.password = new_password
        # user.set_password(new_password)
        user.change_password_required = True
        user.save()

        # Xóa mã code khỏi session sau khi đã sử dụng
        del request.session['verification_code']
        del request.session['user_id']

        return Response({"message": "Mật khẩu đã được đặt lại thành công"}, status=status.HTTP_200_OK)


class InfoPeopleViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = People.objects.filter(is_active=True)
    serializer_class = PeopleSerializers

    @action(methods=['get'], url_path='get_infopeople', detail=False)
    def get_infopeople(self, request):
        # Lấy người dùng đăng nhập hiện tại
        user = request.user
        try:
            # Tìm thông tin People tương ứng với người dùng
            people_data = People.objects.get(user=user)
        except People.DoesNotExist:
            return Response({"message": "Không tìm thấy thông tin người dùng"}, status=status.HTTP_404_NOT_FOUND)

        serialized_data = self.serializer_class(people_data).data
        return Response(serialized_data, status=status.HTTP_200_OK)


class CarCardViewset(viewsets.ViewSet, generics.ListAPIView):
    queryset = CarCard.objects.filter(is_active=True)
    serializer_class = CarCardSerializers

    def get_permissions(self):
        if self.action in ['create_carcard', 'delete_card']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_card', detail=True)  # Người dùng xem thông tin thẻ xe của mình
    def get_carcard(self, request, pk):
        # Lấy người dùng đang đăng nhập từ request
        current_user = request.user
        # Lấy thông tin các thẻ xe mà người dùng đã đăng ký
        carcard_user = CarCard.objects.filter(user=current_user)
        serialized_data = self.serializer_class(carcard_user, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='update_card', detail=False)
    def create_carcard(self, request):
        current_user = request.user

        # Kiểm tra số lượng thẻ xe của người dùng
        num_carcards = CarCard.objects.filter(user=current_user).count()
        if num_carcards >= 3:
            return Response({"error": "Bạn đã đạt tối đa số lượng thẻ xe."},
                            status=status.HTTP_403_FORBIDDEN)  # từ chối

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save(user=current_user,
                            status_card=CarCard.EnumStatusCard.CONFIRMER, is_active=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # API Xóa thẻ xe

    @action(methods=['delete'], url_path='delete_card', detail=False)
    def delete(self, request):
        current_user = request.user
        carcard_data = request.data
        carcard_id = carcard_data.get('id')
        try:
            carcard = CarCard.objects.get(user=current_user, id=carcard_id)
        except CarCard.DoesNotExist:
            return Response({"error": "Không tìm thấy thẻ xe hoặc thẻ xe không thuộc về người dùng hiện tại!"},
                            status=status.HTTP_404_NOT_FOUND)

        carcard.delete()
        return Response({"message": "Thẻ xe đã được xóa thành công."}, status=status.HTTP_200_OK)


# Api đơn hàng trong tủ đồ

class GoodsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Goods.objects.filter(is_active=True)
    serializer_class = GoodsSerializers

    def get_permissions(self):
        if self.action in ['get_goods', 'create_goods']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_goods', detail=False)
    def get_goods(self, request):
        try:
            user = request.user  # Người dùng hiện tại đăng nhập
            boxes = Box.objects.filter(user_admin=user)  # Lấy Tất cả các box mà người dùng là admin
            print("ádad")
            goods = Goods.objects.filter(box__in=boxes).order_by(
                '-created_date')  # lọc các đối tượng mà trường đó có giá trị trong một danh sách đã cho
            print("vvvv")
            # Lưu ý: Sử dụng .url để truy cập đường dẫn đầy đủ của hình ảnh từ Cloudinary
            serialized_data = self.serializer_class(goods, many=True, context={'request': request}).data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Không thể lấy thông tin hàng hóa"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='create_goods', detail=False)
    def create_goods(self, request):
        serializer_data = request.data.copy()  # Tạo một bản sao của dữ liệu request để thêm trường box
        user = request.user  # Người dùng hiện tại đăng nhập
        boxes = Box.objects.filter(user_admin=user)  # Tất cả các box của người dùng
        if boxes.exists():  # Kiểm tra xem người dùng có box nào không
            serializer_data['box'] = boxes.first().id  # Lưu id của box đầu tiên vào trường box
            serializer_data['is_active'] = True
        else:
            return Response({"message": "Người dùng không có box"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = GoodsSerializers(data=serializer_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['patch'], url_path='Update_items_tatus', detail=True)
    def Update_items_tatus(self, request, pk):
        try:
            user = request.user
            print(user)
            id_good = request.data.get('id')  # Lấy ID hàng hóa
            print(id_good)
            boxes = Box.objects.filter(user_admin=user)

            # Tìm hàng hóa trong các hộp của user có ID là id_good
            goods = Goods.objects.filter(box__in=boxes, received_Goods=Goods.EnumStatusGood.RECEIVED, id=pk)

            if goods.exists():
                goods.update(received_Goods=Goods.EnumStatusGood.URG)
                return Response({"message": "Cập nhật trạng thái thành công"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Không tìm thấy hàng hóa để cập nhật"},
                                status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message": "Không thể cập nhật trạng thái hàng hóa"},
                            status=status.HTTP_400_BAD_REQUEST)


class LettersViewSet(viewsets.ViewSet):
    queryset = Letters.objects.filter(is_active=True)
    serializer_class = LettersSerializers

    def get_permissions(self):
        if self.action in ['create_letters', ' get_letters']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'], url_path='get_letters', url_name='get_letters')
    def get_letters(self, request):
        user = self.request.user
        letters = Letters.objects.filter(people=user.people)
        serializer = LettersSerializers(letters, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create_letters', url_name='create_letters')
    def create_letters(self, request, *args, **kwargs):
        # Lấy thông tin từ request data
        title_letter = request.data.get('title_letter')
        content = request.data.get('content')
        img_letter = request.data.get('img_letter')
        user_admin_ids = request.data.get('user_admin', [])

        # Xác thực người dùng và lấy thông tin People
        if request.user.is_authenticated:
            try:
                people = request.user.people  # Lấy thông tin People của user đăng nhập
            except People.DoesNotExist:
                return Response({"error": "People profile does not exist for this user."},
                                status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Authentication credentials were not provided."},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Tạo một đối tượng Letters để lưu vào cơ sở dữ liệu
        letters_data = {
            'title_letter': title_letter,
            'content': content,
            'img_letter': img_letter,
            'people': people.id  # Gán people_id vào đối tượng Letters
        }

        # Tạo và lưu đối tượng Letters
        serializer = LettersSerializers(data=letters_data)
        if serializer.is_valid():
            letters = serializer.save()

            # Thêm các admin được chọn vào danh sách user_admin của Letters
            if user_admin_ids:
                letters.user_admin.add(*user_admin_ids)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SurveyViewSet(viewsets.ViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        try:
            survey = self.queryset.get(pk=pk)
            questions = survey.questions.all()
            serializer = QuestionSerializer(questions, many=True)
            return Response(serializer.data)
        except Survey.DoesNotExist:
            return Response({'error': 'Survey not found'}, status=status.HTTP_404_NOT_FOUND)


class QuestionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


from django.db.models import Case, When, BooleanField, F, Value


class SurveyResponseViewSet(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.all()
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        print(data)
        try:
            survey = Survey.objects.get(id=data['survey'])
            respondent = request.user
            response = SurveyResponse.objects.create(survey=survey, respondent=respondent, completed=True)
            print(response)
            answers = data.get('answers', [])
            for answer in answers:
                question = Question.objects.get(id=answer['question'])
                Answer.objects.create(response=response, question=question, score=answer['score'])
            serializer = SurveyResponseSerializer(response)  # Sử dụng serializer trực tiếp
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Survey.DoesNotExist:
            return Response({'error': 'Survey does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnswerViewSet(viewsets.ViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        try:
            response = SurveyResponse.objects.create(
                survey_id=data['survey'],
                respondent_id=data['respondent'],
                timestamp=data['timestamp']
            )
            for answer_data in data['answers']:
                Answer.objects.create(
                    response=response,
                    question_id=answer_data['question'],
                    score=answer_data['score']
                )
            return Response({'status': 'Response and answers created successfully'}, status=status.HTTP_201_CREATED)
        except SurveyResponse.DoesNotExist:
            return Response({'error': 'SurveyResponse does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Question.DoesNotExist:
            return Response({'error': 'Question does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)