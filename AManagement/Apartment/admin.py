from django.contrib import admin
from .models import *
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
from django.urls import reverse
from django.utils.html import format_html


class UserResidentSet(admin.ModelAdmin):
    list_display = ['id', 'username', 'change_password_required', 'avatar_acount', 'edit']
    search_fields = ['username']
    fieldsets = (
        (None, {'fields': ('username', 'password', 'user_role', 'email')}),
        ('Permission', {'fields': ('is_staff', 'is_active', 'is_superuser', 'user_permissions')}),
        ('Personal info', {'fields': ('change_password_required', 'avatar_acount')}),
    )

    ordering = ('id',)
    filter_horizontal = ()
    readonly_fields = ('my_avatar_acount',)

    def my_avatar_acount(self, user):
        if User.avatar_acount:
            return mark_safe(f"<img width='200' src='{user.avatar_acount.url}' />")

    def get_queryset(self, request):
        # Lấy queryset gốc
        queryset = super().get_queryset(request)
        # Lọc chỉ các người dùng có vai trò là Resident
        return queryset.filter(user_role=User.EnumRole.RESIDENT)

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)

    def save_model(self, request, obj, form, change):
        # Kiểm tra xem có phải là tạo mới đối tượng không
        if not change:
            # Nếu là tạo mới, đặt is_staff và is_superuser thành False
            obj.is_staff = False
            obj.is_superuser = False
        # Lưu đối tượng
        obj.save()

class PeopleSet(admin.ModelAdmin):
    list_display = ['id', 'name_people', 'sex', 'phone', 'birthday', 'ApartNum','user', 'edit']
    search_fields = ['id', 'name_people']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)
class ApartmentManagementAdmin(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ CHUNG CƯ"


admin_site = ApartmentManagementAdmin('myapartment')


class BillSet(admin.ModelAdmin):
    list_display = ['id', 'name_bill', 'money', 'decription', 'type_bill', 'status_bill', 'user_resident', 'edit']
    search_fields = ['id', 'name_bill']

    def edit(self, obj):
        edit_url = reverse('admin:%s_%s_change' % (obj._meta.app_label, obj._meta.model_name), args=[obj.pk])
        return format_html(
            '<a href="{}" style="background-color: #4CAF50; border: none; color: white; padding: 8px 14px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer;">Edit</a>',
            edit_url)

admin_site.register(User, UserResidentSet)
admin_site.register(People, PeopleSet)
admin_site.register(Bill, BillSet)
admin_site.register(Application)
admin_site.register(AccessToken)
admin_site.register(Grant)
admin_site.register(IDToken)
admin_site.register(RefreshToken)
# Register your models here
