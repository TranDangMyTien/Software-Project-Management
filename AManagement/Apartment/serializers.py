from rest_framework import serializers
from .models import *


class BillSerializers(serializers.ModelSerializer):
    class Meta:
        model = Bill
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'name_bill', 'money', 'decription', 'type_bill', 'status_bill', 'user_resident', 'created_date',
                  'updated_date', ]


class UserSerializers(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar_acount:
            rep['avatar_acount'] = instance.avatar_acount.url

        return rep

    class Meta:
        model = User
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'username', 'password', 'avatar_acount', 'change_password_required', 'email']
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }


class AdminSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        # filter chỉ định các trường serialize ra pare thành json để gửi ra bên ngoài để client gọi API
        fields = ['id', 'username', ]


#         extra_kwargs = {# các trường chí ghi chớ không đọc
#                 'pass_acount': {
#                     'write_only': 'True'
#                 },
#                 'admin': {
#                     'write_only': 'True'
#                 }
#         }

class UpdateResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password', 'avatar_acount', ]
        extra_kwargs = {
            'pass_acount': {
                'write_only': True
            }
        }
