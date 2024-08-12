from django.shortcuts import render
from rest_framework import viewsets, generics, status, parsers, permissions
from .models import *
from .serializers import *
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
import cloudinary
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response as DRFResponse


# Create your views here.
class BillViewSet(viewsets.ViewSet, generics.ListAPIView):

    def get_permissions(self):
        if self.action in ['get_bill', 'upload_imgbank', ]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

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
