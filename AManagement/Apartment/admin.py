from django.contrib import admin
from .models import *
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
from django.urls import reverse
from django.utils.html import format_html


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


admin_site.register(Bill, BillSet)
admin_site.register(Application)
admin_site.register(AccessToken)
admin_site.register(Grant)
admin_site.register(IDToken)
admin_site.register(RefreshToken)
# Register your models here
